import React, { useState } from "react";
import { Icon } from "@iconify/react";
import classNames from "classnames";
import { Link } from "react-router-dom";
import './sidebar.css';

const Sidebar = ({ visible }) => {
  const [activeItem, setActiveItem] = useState("Home");
  const menuItems = [
    { name: "Home", icon: "mdi:monitor-dashboard", path: "/admin" },
    { name: "Rooms", icon: "material-symbols:key-vertical-outline", path: "/admin/rooms" },
    { name: "Bookings", icon: "ic:outline-list-alt", path: "/admin/bookings" },
    { name: "Complaints", icon: "material-symbols:person-alert-outline-rounded", path: "/admin/complaints" },
    { name: "Admin", icon: "mdi:person-circle-outline", path: "/admin/info" },
    { name: "Logout", icon: "mdi:logout"},
  ];

  return (
    <div className={classNames("sidebar", { "sidebar-visible": visible })}>
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.path}
          className={classNames("sidebar-gr", { active: activeItem === item.name })}
          onClick={() => setActiveItem(item.name)}
        >
          <Icon icon={item.icon} className="sidebar-icon" />
          <span className="sidebar-text">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
