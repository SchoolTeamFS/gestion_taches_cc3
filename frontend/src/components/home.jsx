import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Home = () => {
    const { user } = useContext(AuthContext);

  console.log(user)
    
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Welcome to the Task Management System</h1>
      {user ? <h2>Hello, {user.name} 👋</h2> : <h2>Please log in</h2>}
    </div>
  );
};

export default Home;
