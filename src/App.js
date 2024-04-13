// src/App.js
import React, { useState } from 'react';
import axios from 'axios';
import Dashboard from './Dashboard';

function App() {
  const [facultyId, setFacultyId] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [facultyData, setFacultyData] = useState(null);

  const handleLogin = () => {
    axios.post('http://localhost:5000/api/login', { faculty_id: facultyId, password })
      .then(res => {
        if (res.data.success) {
          setFacultyData(res.data.faculty);
          setLoggedIn(true);
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <div>
      {!loggedIn ? (
        <div>
          <input type="text" placeholder="Faculty ID" value={facultyId} onChange={(e) => setFacultyId(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <Dashboard facultyData={facultyData} />
      )}
    </div>
  );
}

export default App;
