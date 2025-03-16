import React, { useEffect, useState } from "react";
import authApi from '../api/authApi'

const ManageUser = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');

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
    return (
        <div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUser;
