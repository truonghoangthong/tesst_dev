import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useAuthStore from "../../../../../Backend/src/store/authStore";
import './info.css';

const Info = () => {
  const user = useAuthStore((state) => state.user);  

  const [fullName, setFullName] = useState(user ? user.fullName : "");
  const [phoneNum, setPhoneNumber] = useState(user ? user.phoneNum : "");
  const [email, setEmailAddress] = useState(user ? user.email : "");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setPhoneNumber(user.phoneNum);
      setEmailAddress(user.email);
    }
  }, [user]); 

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  const handleSave = () => {
    alert("Saved successfully!");
  };

  return (
    <div className="info">
      <div className="gradient-box"></div>
      <div className="info-details">
        <div className="name-box">
          <Icon icon="mdi:person-circle-outline" width="125" height="125" />
          <div className="info-column">
            <span className="info-name">{fullName}</span>
            <span className="info-email">{email}</span>
          </div>
        </div>
        <button onClick={handleSave}>Save</button>
        <form className="info-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => handleInputChange(e, setFullName)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNum">Phone Number</label>
            <input
              type="text"
              id="phoneNum"
              value={phoneNum}
              onChange={(e) => handleInputChange(e, setPhoneNumber)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => handleInputChange(e, setEmailAddress)}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Info;
