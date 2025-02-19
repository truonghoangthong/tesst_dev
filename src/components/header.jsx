import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Sidebar from "./sidebar";
import { NavLink } from "react-router-dom"; 
import './header.css';

const Header = ({ privilege = 'guest' }) => {  //default: if no prop passed
  const [isSidebarVisible, setSidebarVisible] = useState(false); 
  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };
  const guestOptions = [
    { name: "Complaint", path: "complaint" },
    { name: "Sauna", path: "sauna" },
    { name: "Laundry", path: "laundry" },
  ];

  return (
    <>
      <div className={`header ${privilege === 'guest' ? 'guest' : ''}`}>
        <img className="resortlogo" src="/public/logo.png" alt="logo" />
        <div className="header-options">
          {privilege === 'guest' && guestOptions.map(option => (
            <NavLink
              key={option.path}
              to={`/client/${option.path}`}
              className={({ isActive }) => (isActive ? 'header-option-link active' : 'header-option-link')}  
            >
              <span>{option.name}</span>
            </NavLink>
          ))}
        </div>

        <div className="header-info">
          {privilege === 'admin' ? (
            <Icon icon="mdi:menu" className="menu-icon" onClick={toggleSidebar} />
          ) : (
            <div className="guest-section">
              <Icon icon="mdi:account" className="guest-icon" />
              <span className="guest-label">Guest</span>
            </div>
          )}
        </div>
      </div>

      {privilege === 'admin' && <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} />}
    </>
  );
};

export default Header;
