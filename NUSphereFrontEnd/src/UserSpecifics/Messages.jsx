import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import "../OpenMarket/Listings.css";

export function Messages() {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [messageBody, setMessageBody] = useState("");
    const [loading, setLoading] = useState(true);
    const { conversationId } = useParams();
    const token = localStorage.getItem('access_token');

    const authHeaders = {
        headers: { Authorization: `Bearer ${token}` }
    };

    const fetchConversations = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/chat/conversations/`, authHeaders);
            setConversations(response.data);

            const conversationToOpen = response.data.find((conversation) => String(conversation.id) === String(conversationId))
                || response.data[0];

            if (conversationToOpen) {
                fetchMessages(conversationToOpen.id);
            }
        } catch (error) {
            console.error("Error fetching conversations:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/chat/conversations/${id}/messages/`, authHeaders);
            setSelectedConversation(response.data.conversation);
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    const sendMessage = async (event) => {
        event.preventDefault();
        if (!selectedConversation || !messageBody.trim()) {
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/chat/conversations/${selectedConversation.id}/messages/`, {
                body: messageBody
            }, authHeaders);

            setMessages((currentMessages) => [...currentMessages, response.data]);
            setMessageBody("");
            fetchConversations();
        } catch (error) {
            console.error("Error sending message:", error);
            alert(error.response?.data?.error || "Failed to send message.");
        }
    };

    useEffect(() => {
        if (token) {
            fetchConversations();
        } else {
            setLoading(false);
        }
    }, [conversationId]);

    if (!token) {
        return <p style={{ color: "red" }}>Please log in to view messages.</p>;
    }

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <h2>Messages</h2>

            {loading ? <p>Loading messages...</p> :
            conversations.length === 0 ? <p>No conversations yet.</p> :
            <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: "20px" }}>
                <aside style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {conversations.map((conversation) => (
                        <button
                            key={conversation.id}
                            onClick={() => fetchMessages(conversation.id)}
                            style={{
                                textAlign: "left",
                                padding: "12px",
                                border: selectedConversation?.id === conversation.id ? "2px solid #2563eb" : "1px solid #e2e8f0",
                                background: "#fff",
                                borderRadius: "8px",
                                cursor: "pointer"
                            }}
                        >
                            <strong>{conversation.item_name}</strong>
                            <div style={{ color: "#64748b", fontSize: "13px" }}>With {conversation.other_user}</div>
                            <div style={{ color: "#64748b", fontSize: "13px" }}>{conversation.latest_message || "No messages yet"}</div>
                        </button>
                    ))}
                </aside>

                <section className="listing-card" style={{ minHeight: "520px" }}>
                    {selectedConversation && (
                        <>
                            <div className="order-source-row">
                                <span className={`order-source-badge ${selectedConversation.source_type === "shop_product" ? "store" : "market"}`}>
                                    {selectedConversation.source_type === "shop_product" ? "Store" : "Open Market"}
                                </span>
                                <span className="order-source-meta">
                                    {selectedConversation.item_name} with {selectedConversation.other_user}
                                </span>
                            </div>

                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        style={{
                                            alignSelf: message.is_mine ? "flex-end" : "flex-start",
                                            background: message.is_mine ? "#dbeafe" : "#f1f5f9",
                                            padding: "10px 12px",
                                            borderRadius: "8px",
                                            maxWidth: "70%"
                                        }}
                                    >
                                        <div>{message.body}</div>
                                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px" }}>{message.sender}</div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={sendMessage} style={{ display: "flex", gap: "10px" }}>
                                <input
                                    value={messageBody}
                                    onChange={(event) => setMessageBody(event.target.value)}
                                    placeholder="Type a message..."
                                    style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #cbd5e1" }}
                                />
                                <button type="submit">Send</button>
                            </form>
                        </>
                    )}
                </section>
            </div>}
        </div>
    );
}
