import { useNavigate } from "react-router-dom";
import chatIcon from "../assets/ChatIcon.png";

export function ChatButton() {
    const navigate = useNavigate();

    return (
        <img src={chatIcon} alt="Chat Icon" onClick={() => navigate('/messages')} />
    )
}