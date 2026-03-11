import React from 'react';
import { Link } from 'react-router-dom';
import { FaComments, FaImage, FaHome } from 'react-icons/fa';
import './Navbar.css';

function Navbar({ userId }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🖤</span>
          BlackChat
        </Link>
        
        <div className="nav-menu">
          <Link to="/" className="nav-link">
            <FaHome /> Inicio
          </Link>
          <Link to="/photos" className="nav-link">
            <FaImage /> Fotos
          </Link>
        </div>

        <div className="user-info">
          <span className="user-id">{userId?.substr(0, 8)}...</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
