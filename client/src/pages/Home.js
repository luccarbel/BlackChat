import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

function Home({ userId }) {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({ roomName: '', description: '' });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('/api/chats/rooms');
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener salas:', error);
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/chats/rooms', newRoom);
      setRooms([...rooms, response.data]);
      setNewRoom({ roomName: '', description: '' });
      setShowCreateRoom(false);
    } catch (error) {
      console.error('Error al crear sala:', error);
    }
  };

  if (loading) {
    return <div className="loading">Cargando salas...</div>;
  }

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Salas de Chat Anónimas</h1>
        <button 
          className="btn-create"
          onClick={() => setShowCreateRoom(!showCreateRoom)}
        >
          {showCreateRoom ? '✕ Cancelar' : '+ Nueva Sala'}
        </button>
      </div>

      {showCreateRoom && (
        <form className="create-room-form" onSubmit={handleCreateRoom}>
          <input
            type="text"
            placeholder="Nombre de la sala"
            value={newRoom.roomName}
            onChange={(e) => setNewRoom({ ...newRoom, roomName: e.target.value })}
            required
          />
          <textarea
            placeholder="Descripción (opcional)"
            value={newRoom.description}
            onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
          />
          <button type="submit" className="btn-submit">Crear Sala</button>
        </form>
      )}

      <div className="rooms-grid">
        {rooms.length === 0 ? (
          <div className="no-rooms">
            <p>No hay salas disponibles. ¡Crea una!</p>
          </div>
        ) : (
          rooms.map((room) => (
            <Link key={room.roomId} to={`/chat/${room.roomId}`} className="room-card">
              <div className="room-header">
                <h3>{room.roomName}</h3>
                <span className="room-badge">{room.activeUsers || 0}</span>
              </div>
              <p className="room-description">{room.description}</p>
              <div className="room-footer">
                <small>{room.messages?.length || 0} mensajes</small>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
