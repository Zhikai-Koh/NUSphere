import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function MyOrders() {
    const [activeTab, setActiveTab] = useState("pending")
    const [orders, setOrders] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    //fetching history
    const fetchOrders = async () => {
      try{
        const response = await fetch(`${API_BASE_URL}/api/listings/orderhistory/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
          if (!response.ok) {
              throw new Error('Network response failure');
          }
          const data = await response.json();
          setOrders(data);
      } catch (error) {
          console.error('Error fetching orders:', error);
          setLoadSuccess(false);
          setOrders(<p style={{ color: 'red' }}>Failed to load orders. Please try again later.</p>);
      } finally {
          setLoading(false);
      }
  }

    useEffect(() => {
        fetchOrders();
    }, []);

const displayOrders = orders[activeTab] || [];

    return (
        <div className="orders-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <h2>My Order History</h2>

            {/* da tabs */}
            <div className="tab-navigation" style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>
                <button 
                    onClick={() => setActiveTab("pending")}
                    style={{
                        padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600",
                        background: activeTab === "pending" ? "#2563eb" : "transparent",
                        color: activeTab === "pending" ? "#fff" : "#64748b"
                    }}
                >
                    Pending Confirmations ({orders.pending?.length || 0})
                </button>
                <button 
                    onClick={() => setActiveTab("sold")}
                    style={{
                        padding: "10px 20px", borderRadius: "6px", border: "none", fontWeight: "600",
                        background: activeTab === "sold" ? "#16a34a" : "transparent",
                        color: activeTab === "sold" ? "#fff" : "#64748b"
                    }}
                >
                    Completed Purchase ({orders.sold?.length || 0})
                </button>
            </div>

            {/* pending/completed orders. */}
            {displayOrders.length === 0 ? 
                <div style={{ textAlign: "center", color: "#64748b", margin: "40px 0" }}>No {activeTab} orders found.</div>
            : 
                <div className="my-listings-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
                    {displayOrders.map((order, index) => (

                        // Outder border
                        <div key={index} className="listing-card" style={{ border: "1px solid #e2e8f0", padding: "16px", borderRadius: "8px", background: "#fff" }}>

                            {/* image */}
                            {order.image && (
                                <img src={order.image.startsWith('http') ? order.image : `${API_BASE_URL}${order.image}`} 
                                     alt={order.item_name}
                                     className="listing-image"
                                     style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "6px" }}
                                />
                            )}

                            {/* Name */}
                            <h4 className="card-title" style={{ margin: "12px 0 6px" }}>{order.item_name}</h4>
                            <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "10px" }}>
                                <span style={{
                                    padding: "4px 8px",
                                    borderRadius: "4px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    background: order.source_type === "store_product" ? "#e0f2fe" : "#f1f5f9",
                                    color: order.source_type === "store_product" ? "#0369a1" : "#475569"
                                }}>
                                    {order.source_label || "Open Market"}
                                </span>
                                <span style={{ color: "#475569", fontSize: "13px" }}>
                                    {order.source_type === "store_product" && order.store_name
                                        ? `${order.store_name} by ${order.seller || order.user}`
                                        : `Seller: ${order.seller || order.user}`}
                                </span>
                            </div>

                            {/* Qty */}
                            <div className="card-quantity" style={{ display: "flex", justifyContent: "space-between", margin: "6px 0", color: "black" }}>
                                Total Ordered: <strong>{order.quantity}</strong>
                            </div>

                            {/* Price */}
                            {/* nt sure if da qty and price shd b arranged liddat tho, the spacing looks a lil weird */}
                            <div className="price-label" style={{ display: "flex", justifyContent: "space-between", margin: "12px 0" }}>
                                <span style={{ color: "black" }}>Unit Price:</span>
                                <strong className="card-price">${parseFloat(order.item_price).toFixed(2)}</strong>
                            </div>

                            <div className="price-label" style={{ display: "flex", justifyContent: "space-between", margin: "12px 0" }}>
                                <span style={{ color: "black" }}>Total Price:</span>
                                <strong className="card-price">${parseFloat(order.item_price * order.quantity).toFixed(2)}</strong>
                            </div>

                            {/* status at the bottom */}
                            <div className="card-footer" style={{ borderTop: "1px solid #f1f5f9", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ 
                                    padding: "4px 8px", borderRadius: "4px", fontSize: "12px", fontWeight: "bold",
                                    background: activeTab === 'pending' ? '#ffedd5' : '#dcfce7',
                                    color: activeTab === 'pending' ? '#ea580c' : '#15803d'
                                }}>
                                    {activeTab === 'pending' ? "PENDING" : "COMPLETED"}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>  
            }
        </div>
    );
}
