import { useState, useContext } from "react";
import { ChatContext } from "../context/ChatContext";

const Chat = () => {
    const { messages, sendMessage } = useContext(ChatContext);  
    const [message, setMessage] = useState("");

    const handleSend = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage("");
        }
    };

    return (
        <div>
            <div>
                {messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.senderName}:</strong> {msg.content}
                    </p>
                ))}
            </div>
            <input
                type="text"
                placeholder="Écrire un message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={handleSend}>Envoyer</button>
        </div>
    );
};

export default Chat;
