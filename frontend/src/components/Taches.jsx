import React from "react";
import { Link } from "react-router-dom";
const Taches=()=>{
    return(
        <div style={{ padding: "20px" }}>
        <h1>Gestion des Tâches</h1>
        <ul>
        <li>
            <Link to="/taches/add">Ajouter une tâche</Link>
        </li>
        <li>
            <Link to="/taches/kanban">Afficher le tableau Kanban</Link>
        </li>
        <li>
            <Link to="/taches/manage">Gérer les tâches</Link>
        </li>
        </ul>
    </div>
    )
}
export default Taches;