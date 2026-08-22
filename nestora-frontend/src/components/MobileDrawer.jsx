import React from 'react';
import { NavLink } from 'react-router-dom';

export default function MobileDrawer({ open, onClose }) {
  return (
    <div className={`mobile-drawer ${open ? 'open' : ''}`}>
      <button className="close-btn" onClick={onClose} style={{background:'none',border:'none',color:'var(--text-main)',fontSize:'1.5rem',marginBottom:'20px',cursor:'pointer'}}>✕</button>
      <nav>
        <ul style={{listStyle:'none',padding:0}}>
          <li><NavLink to="/" onClick={onClose}>Home</NavLink></li>
          <li><NavLink to="/listings" onClick={onClose}>Listings</NavLink></li>
          <li><NavLink to="/map" onClick={onClose}>Map</NavLink></li>
          <li><NavLink to="/compare" onClick={onClose}>Compare</NavLink></li>
          <li><NavLink to="/calculator" onClick={onClose}>EMI Calculator</NavLink></li>
          <li><NavLink to="/predict" onClick={onClose}>Predict</NavLink></li>
          {/* Add more links as needed */}
        </ul>
      </nav>
    </div>
  );
}
