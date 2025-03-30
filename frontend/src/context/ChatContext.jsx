import { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import AuthContext from "../context/AuthContext"; 

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5005");

    newSocket.on("message", (msg) => setMessages((prev) => [...prev, msg]));

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const sendMessage = (content) => {
    if (socket && user) {
      socket.emit("message", { senderName: user.name, content });
    } else {
      console.log("❌ Utilisateur non connecté !");
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
