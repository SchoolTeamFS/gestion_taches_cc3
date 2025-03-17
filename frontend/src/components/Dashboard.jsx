import '../styles/dashboardStyle.css';
import { PiUsersThreeLight } from "react-icons/pi";
import { useContext, useEffect, useState } from 'react';
import authApi from '../api/authApi';
import AuthContext from '../context/AuthContext';

const DashBoard = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  
      useEffect(() => {
          fetchUsers();
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
      const totalUsers = users.length;
      const types = [
        {type:'Users', total:totalUsers, icon:<PiUsersThreeLight/>},
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