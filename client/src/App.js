import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ChatRoom from './pages/ChatRoom';
import PhotoGallery from './pages/PhotoGallery';

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Generar o recuperar ID anónimo del usuario
    let storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      storedUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', storedUserId);
    }
    setUserId(storedUserId);
  }, []);

  return (
    <Router>
      <div className="App">
        <Navbar userId={userId} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home userId={userId} />} />
            <Route path="/chat/:roomId" element={<ChatRoom userId={userId} />} />
            <Route path="/photos" element={<PhotoGallery userId={userId} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
