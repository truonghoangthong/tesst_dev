import React, { useState } from "react";
import { Icon } from "@iconify/react";
import Sidebar from "./sidebar"; // Make sure you import the Sidebar component
import './header.css';

const Header = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <>
      <div className="header">
        <span className="resortlogo">Rakkaranta</span>
        <div className="header-info">
          <Icon icon="mdi:menu" className="menu-icon" onClick={toggleSidebar} />
        </div>
      </div>
      <Sidebar visible={isSidebarVisible} onClose={toggleSidebar} />
    </>
  );
};

export default Header;
