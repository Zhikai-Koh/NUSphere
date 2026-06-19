import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Dropdown.css';
import profileIcon from "../assets/ProfilePhotoIcon.png";
import { API_BASE_URL } from "../config.js";


const handleLogout = async () => {
  try {
    await fetch('${API_BASE_URL}/api/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      },
      body: JSON.stringify({ refresh: localStorage.getItem('refresh_token') })
    });
  } catch (err) {
    console.error("Failed to notify backend of logout", err);
  }

  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  
  window.location.href = '/login';
};

export const ProfileDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Toggle dropdown on click
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close the dropdown automatically if the user clicks anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      <button className="profile-icon-btn" onClick={toggleDropdown}>
        <img 
          src={user?.profile_pic || profileIcon} 
          alt="Profile" 
          className="profile-avatar"
        />
      </button>

      {/* Conditional Rendering based on isOpen state */}
      {isOpen && (
        <div className="dropdown-menu">
          {user ? 
            // Links visible ONLY when logged in
            <>
              <div className="dropdown-header">Hello, {user.username}</div>
              <hr />
              <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>My Profile</Link>
              <Link to="/orders" className="dropdown-item" onClick={() => setIsOpen(false)}>My Orders</Link>
              <button className="dropdown-item logout-btn" onClick={() => { handleLogout(); setIsOpen(false); }}>
                Logout
              </button>
            </>
           : 
            // Links visible ONLY when logged out
            <>
              <Link to="/login" className="dropdown-item" onClick={() => setIsOpen(false)}>Log In</Link>
              <Link to="/register" className="dropdown-item" onClick={() => setIsOpen(false)}>Sign Up</Link>
            </>
          }
        </div>
      )}
    </div>
  );
};