// import { createContext, useContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);

//   useEffect(() => {
//     const newSocket = io('http://localhost:5005', {
//       transports: ['websocket', 'polling']
//     });

//     setSocket(newSocket);

//     return () => {
//       newSocket.disconnect();
//     };
//   }, []);

//   const joinProject = (projectId, userId) => {
//     if (!socket) {
//       console.error('Socket non initialisé');
//       return;
//     }
//     socket.emit('joinRoom', { projectId, userId });
//   };

//   return (
//     <ChatContext.Provider value={{ socket, joinProject }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => useContext(ChatContext);





import { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import AuthContext from "./AuthContext"; 

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
