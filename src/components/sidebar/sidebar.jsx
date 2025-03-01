import React, { useState } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import './sidebar.css';
import LogoutPopup from '../popup/logout-popup'; 

const Sidebar = ({ isAdmin, visible }) => {
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); 

  const adminMenuItems = [
    { name: "Dashboard", icon: "mdi:monitor-dashboard", path: "/admin" },
    { name: "Reports", icon: "mdi:chart-line", path: "/admin/reports" },
    { name: "Rooms", icon: "material-symbols:key-vertical-outline", path: "/admin/rooms" },
    { name: "Bookings", icon: "ic:outline-list-alt", path: "/admin/bookings" },
    { name: "Complaints", icon: "material-symbols:person-alert-outline-rounded", path: "/admin/complaints" },
    { name: "Admin", icon: "mdi:person-circle-outline", path: "/admin/info" },
    { name: "Logout", icon: "mdi:logout" },
  ];

  if (!isAdmin) {
    return null;
  }

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  return (
    <div className={classNames("sidebar", { visible: visible, hidden: !visible })}>
      {adminMenuItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={classNames("sidebar-gr", { active: activeItem === item.name })}
          onClick={() => {
            setActiveItem(item.name);
            if (item.name === "Logout") {
              handleLogoutClick(); 
            }
          }}
        >
          <Icon icon={item.icon} className="sidebar-icon" />
          <span className="sidebar-text">{item.name}</span>
        </Link>
      ))}

      {showLogoutPopup && <LogoutPopup />}
    </div>
  );
};

export default Sidebar;
