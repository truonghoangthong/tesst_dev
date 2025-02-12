import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Sidebar from "./sidebar";
import './header.css';

const Header = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false); // State for sidebar visibility

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible); // Toggle sidebar visibility
  };

  return (
    <>
      <div className="header">
        <span className="resortlogo">Rakkaranta</span>
        <div className="header-info">
          <Icon icon="mdi:menu" className="menu-icon" onClick={toggleSidebar} /> {/* Toggle sidebar */}
        </div>
      </div>
      <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} /> {/* Pass visibility state */}
    </>
  );
};

export default Header;
