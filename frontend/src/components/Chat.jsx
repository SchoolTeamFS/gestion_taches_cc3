// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import io from 'socket.io-client';

// const Chat = () => {
//   const { id } = useParams(); 
//   const [chatData, setChatData] = useState(null);
//   const [newMessage, setNewMessage] = useState('');
//   const [messages, setMessages] = useState([]);
//   const socket = io('http://localhost:5005'); 

//   useEffect(() => {
//     const fetchChatData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5005/chat/${id}`);
//         setChatData(response.data);
//         setMessages(response.data.messages);
//       } catch (error) {
//         console.error('Erreur lors de la récupération des données du chat:', error);
//       }
//     };

//     if (id) {
//       fetchChatData();
//     }

//     socket.emit('join', id); 

//     socket.on('message', (message) => {
//       setMessages((prevMessages) => [...prevMessages, message]); 
//     });

//     return () => {
//       socket.off('message');
//     };
//   }, [id]);

//   const handleMessageChange = (e) => {
//     setNewMessage(e.target.value);
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();

//     if (newMessage.trim() === '') return;

//     // Utilisez `user.name` ou un autre identifiant pour envoyer le nom de l'expéditeur
//     const message = { 
//       text: newMessage, 
//       senderName: 'User' // Remplacez 'User' par le nom de l'utilisateur actuel, par exemple `user.name`
//     };

//     // Envoi du message au serveur WebSocket
//     socket.emit('sendMessage', id, message);

//     // Envoyer le message à l'API pour le stocker dans la base de données
//     axios.post(`http://localhost:5002/chat/${id}/messages`, message)
//       .then((response) => {
//         setNewMessage(''); // Réinitialiser le champ de texte après l'envoi
//       })
//       .catch((error) => {
//         console.error('Erreur lors de l\'envoi du message:', error);
//       });
//   };

//   if (!chatData) {
//     return <div>Chargement du chat...</div>;
//   }

//   return (
//     <div>
//       <h1>Chat pour le projet {chatData.nom}</h1>
//       <div>
//         <ul>
//           {messages.map((message, index) => (
//             <li key={index}>
//               <strong>{message.senderName}:</strong> {message.text}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <form onSubmit={handleSendMessage}>
//         <input
//           type="text"
//           value={newMessage}
//           onChange={handleMessageChange}
//           placeholder="Écrire un message..."
//         />
//         <button type="submit">Envoyer</button>
//       </form>
//     </div>
//   );
// };

// export default Chat;




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

    // Styles internes
    const styles = {
        chatContainer: {
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
        },
        messages: {
            marginBottom: '20px',
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '10px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            border: '1px solid #ddd',
            marginBottom: '20px',
        },
        message: {
            marginBottom: '10px',
        },
        strong: {
            color: '#007bff',
        },
        inputContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        input: {
            width: '80%',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px',
            marginRight: '10px',
        },
        button: {
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
        },
        buttonHover: {
            backgroundColor: '#0056b3',
        },
    };

    return (
        <div style={styles.chatContainer}>
            <h2>Chat</h2>
            <div style={styles.messages}>
                {messages.map((msg, index) => (
                    <div key={index} style={styles.message}>
                        <strong style={styles.strong}>{msg.senderName}:</strong> <p>{msg.content}</p>
                    </div>
                ))}
            </div>
            <div style={styles.inputContainer}>
                <input
                    type="text"
                    placeholder="Écrire un message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={styles.input}
                />
                <button
                    onClick={handleSend}
                    style={styles.button}
                    onMouseOver={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default Chat;
