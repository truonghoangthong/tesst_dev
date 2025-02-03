import React from "react";
import { Icon } from "@iconify/react";
import './header.css'

const Header = () => {
  return (
    <div className="header">
      <span className="resortlogo">Rakkaranta</span>
      <div className="header-info"> 
        <Icon icon="mdi:account-circle-outline" className="header-icon" />      
        <span className="header-text">Admin</span>
      </div> 
    </div>
  )
}
export default Header