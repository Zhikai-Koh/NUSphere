import { useNavigate } from "react-router-dom";
import chatIcon from "../assets/ChatIcon.png";

export function ChatButton() {
    const navigate = useNavigate();

    return (
        <button
            type="button"
            className="chat-icon-btn"
            aria-label="Open messages"
            onClick={() => navigate('/messages')}
        >
            <img className="chat-icon" src={chatIcon} alt="" />
        </button>
    )
}
