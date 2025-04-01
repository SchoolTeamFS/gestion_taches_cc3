// // import React, { useEffect, useState } from 'react';
// // import axios from 'axios';
// // import { useChat } from '../context/ChatContext';
// // import { useNavigate } from 'react-router-dom'; // Import de useNavigate

// // const UserProjects = ({ userId }) => {
// //   const [projects, setProjects] = useState([]);
// //   const { joinProject } = useChat();
// //   const navigate = useNavigate();  // Déclaration du hook navigate

// //   useEffect(() => {
// //     const fetchProjects = async () => {
// //       const token = localStorage.getItem('token');
      
// //       try {
// //         const response = await axios.get(`http://localhost:5001/projet/user/${userId}`, {
// //           headers: { Authorization: `Bearer ${token}` }
// //         });

// //         console.log("Réponse API:", response); // Ajout du log

// //         setProjects(response.data);
// //       } catch (error) {
// //         console.error('Erreur lors de la récupération des projets:', error);
// //       }
// //     };

// //     fetchProjects();
// //   }, [userId]);

// //   return (
// //     <div>
// //       <h1>Projets de l'utilisateur {userId}</h1>
// //       <ul>
// //         {projects.map((project) => (
// //           <li key={project._id}>
// //             <span>{project.nom}</span>
// //             <button onClick={() => {
// //               joinProject(project._id, userId);  // Rejoindre le projet et son chat
// //               alert(`Vous avez rejoint le projet ${project.nom} et son chat.`);

// //               // Redirection vers le chat
// //               navigate(`/chat/${project._id}`);  // Naviguer vers la route du chat du projet
// //             }}>
// //               Rejoindre
// //             </button>
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default UserProjects;


// import React, { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { useChat } from '../context/ChatContext';
// import { useNavigate } from 'react-router-dom'; // Import de useNavigate
// import AuthContext  from "../context/AuthContext";

// const UserProjects = () => {
//   const { user } = useContext(AuthContext); // Accéder à l'utilisateur via le contexte
//   console.log("User from context:", user);
//   const [projects, setProjects] = useState([]);
//   const { joinProject } = useChat();
//   const navigate = useNavigate();  // Déclaration du hook navigate

//   useEffect(() => {
//     if (!user) return; // Vérifier si `user` est défini

//     const fetchProjects = async () => {
//       const token = localStorage.getItem("token");

//       try {
//         const response = await axios.get(`http://localhost:5001/projet/user/${user.id}`, { // Utiliser `user._id`
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log("Réponse API:", response);
//         setProjects(response.data);
//       } catch (error) {
//         console.error("Erreur lors de la récupération des projets :", error);
//       }
//     };

//     fetchProjects();
//   }, [user]); // Re-exécuter lorsque `user` change

//   if (!user) {
//     return <div>Veuillez vous connecter pour voir vos projets.</div>;
//   }

//   return (
//     <div>
//       <h2>Projets de l'utilisateur : {user.id}</h2>
//       <ul>
//         {projects.map((project) => (
//           <li key={project._id}>
//             <span>{project.nom}</span>
//             <button onClick={() => {
//               joinProject(project._id, user.id);  // Rejoindre le projet et son chat
//               alert(`Vous avez rejoint le projet ${project.nom} et son chat.`);

//               // Redirection vers le chat
//               navigate(`/chat/${project._id}`);  // Naviguer vers la route du chat du projet
//             }}>
//               Rejoindre
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default UserProjects;
