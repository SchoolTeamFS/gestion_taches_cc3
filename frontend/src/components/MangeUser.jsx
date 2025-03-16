import React, { useEffect, useState } from "react";
import authApi from '../api/authApi'
import { useNavigate } from "react-router-dom";

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await authApi.get("/auth/all", {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
            setUsers(response.data);
        } catch (error) {
            setError("Error fetching users");
        }
    };
    console.log(users)
    const handleupt=(id)=>{
        navigate(`/update_user/${id}`)
    }
    // const handleupt=(id)=>{
    //     try {
    //         const token = localStorage.getItem("token");
    //         const response = authApi.put(`/auth/update/${id}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}` 
    //             }
    //         });
    //         setUsers(response.data);
    //     } catch (error) {
    //         setError("Error updating user");
    //     }
    // }
    const handledel=(id)=>{
        try {
            const token = localStorage.getItem("token");
            const response = authApi.delete(`/auth/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}` 
                }
            });
        fetchUsers();

        } catch (error) {
            setError("Error deleting user");
        }
    }
    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {/* <button type="button" onClick={()=>handleupt(user._id)}>Update</button> */}
                                <button type="button" onClick={()=>handleupt(user._id)}>Update</button>
                                <button type="button" onClick={()=>handledel(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUser;
