import React, { useState } from 'react';
import Login from './pages/Login';
import Notes from './pages/Notes';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');

  const handleLoginSuccess = (userToken, user) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('username', user);
    setToken(userToken);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken('');
    setUsername('');
  };

  return (
    <div className="app-container">
      {token ? (
        <Notes username={username} onLogout={handleLogout} />
      ) : (
        <Login onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
