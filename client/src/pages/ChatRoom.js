import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import './ChatRoom.css';

function ChatRoom({ userId }) {
  const { roomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [room, setRoom] = useState(null);
  const socketRef = useRef();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Conectar socket
    socketRef.current = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000');
    
    socketRef.current.on('connect', () => {
      console.log('Conectado al servidor');
      socketRef.current.emit('join-room', roomId, userId);
    });

    socketRef.current.on('receive-message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    socketRef.current.on('user-joined', (data) => {
      console.log('Usuario se unió:', data);
    });

    // Cargar sala y mensajes
    fetchRoomData();

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId, userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchRoomData = async () => {
    try {
      const response = await axios.get(`/api/chats/rooms/${roomId}`);
      setRoom(response.data);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error al obtener sala:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const message = {
      userId,
      username: `User_${userId.substr(0, 6)}`,
      message: inputValue,
      timestamp: new Date()
    };

    // Enviar por socket
    socketRef.current.emit('send-message', roomId, message);

    // Guardar en BD
    try {
      await axios.post(`/api/chats/rooms/${roomId}/messages`, message);
    } catch (error) {
      console.error('Error al guardar mensaje:', error);
    }

    setInputValue('');
  };

  if (!room) {
    return <div className="loading">Cargando sala...</div>;
  }

  return (
    <div className="chatroom-container">
      <div className="chatroom-header">
        <h2>{room.roomName}</h2>
        <p className="room-desc">{room.description}</p>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">
            <p>No hay mensajes aún. ¡Sé el primero en escribir!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.userId === userId ? 'own' : 'other'}`}>
              <div className="message-content">
                <span className="message-user">{msg.username || 'Anónimo'}</span>
                <p className="message-text">{msg.message}</p>
                <span className="message-time">
                  {new Date(msg.timestamp).toLocaleTimeString('es-ES', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          placeholder="Escribe un mensaje anónimo..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          maxLength={500}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default ChatRoom;
