import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authApi from "../api/authApi";
const UpdateUser=()=>{
    const [user, setUser] = useState([]);
        const [error, setError] = useState('');
        const navigate = useNavigate()
        const {id} = useParams()
        useEffect(() => {
            fetchUser();
        }, []);
    
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await authApi.get(`/auth/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` 
                    }
                });
                setUser(response.data);
            } catch (error) {
                setError("Error fetching user");
            }
        };
        console.log(user)
}
export default UpdateUser;