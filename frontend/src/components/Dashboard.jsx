import '../styles/dashboardStyle.css';
import { PiUsersThreeLight } from "react-icons/pi";
import { useContext, useEffect, useState } from 'react';
import authApi from '../api/authApi';
import proApi from "../api/proApi";
import AuthContext from '../context/AuthContext';
import { useTaskContext } from "../context/TaskContext";
import { FaTasks } from "react-icons/fa";
import { LuFolders } from "react-icons/lu";

const DashBoard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [projects, setProjects] = useState([]);
  const { user } = useContext(AuthContext);
  const { tasks } = useTaskContext();
  
      useEffect(() => {
          fetchUsers();
          fetchProjects();
      },[]);
  
      const fetchUsers = async () => {
          try {
              const token = localStorage.getItem("token");
              const response = await authApi.get("/auth/all", {
                  headers: {
                      Authorization: `Bearer ${token}`
                  }
              });
              setUsers(response.data);
          } catch (e) {
              setError("Error fetching users");
              console.log(error)
          }
      };
      const fetchProjects = async () => {
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                console.error("No token found");
                return;
            }
    
            const response = await proApi.get("/all", {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error.response?.data || error.message);
        }
    };
      const totalUsers = users.length;
      const totalTasks = tasks.length;
      const totalProjet = projects.length;
      const types = [
        {type:'Users', total:totalUsers, icon:<PiUsersThreeLight/>},
        {type:'Tasks', total:totalTasks, icon:<FaTasks />},
        {type:'Projects', total:totalProjet, icon:<LuFolders/>},
        
      ];
      return (
        <div className="dashboard">
          <h1 className="welcome">Welcome {user.role} {user.name}!</h1>
          <div className="totals">
            {types.map((type, idx)=>(
              <div className="up-box" key={idx}>
                <div className="content">
                  <div className="writhing">
                    <h3>{type.type}</h3>
                    <h2>{type.total}</h2>
                  </div>
                  <p>{type.icon} </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
}
export default DashBoard;