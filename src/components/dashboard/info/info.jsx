import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import './info.css';

const Info = () => {
  const [firstName, setFirstName] = useState("Thong");
  const [lastName, setLastName] = useState("Truong");
  const [phoneNumber, setPhoneNumber] = useState("0455789903h");
  const [emailAddress, setEmailAddress] = useState("thongtruong@mail.com");

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("userInfo"));
    if (savedData) {
      setFirstName(savedData.firstName);
      setLastName(savedData.lastName);
      setPhoneNumber(savedData.phoneNumber);
      setEmailAddress(savedData.emailAddress);
    }
  }, []);

  const handleInputChange = (e, setState) => {
    setState(e.target.value);
  };

  const handleSave = () => {
    const userInfo = { firstName, lastName, phoneNumber, emailAddress };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    alert("Saved successfully!");
  };

  return (
    <div className="info">
      <div className="gradient-box"></div>
      <div className="info-details">
        <div className="name-box">
          <Icon icon="mdi:person-circle-outline" width="125" height="125" />
          <div className="info-column">
            <span className="info-name">{firstName} {lastName}</span>
            <span className="info-email">{emailAddress}</span>
          </div>
        </div>
        <button onClick={handleSave}>Save</button>
        <form className="info-form">
          <div className="info-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => handleInputChange(e, setFirstName)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => handleInputChange(e, setLastName)}
              />
            </div>
          </div>
          <div className="info-row">
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => handleInputChange(e, setPhoneNumber)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="emailAddress">Email Address</label>
              <input
                type="email"
                id="emailAddress"
                value={emailAddress}
                onChange={(e) => handleInputChange(e, setEmailAddress)}
              />
            </div>
          </div>  
        </form>
      </div>
    </div>
  );
};

export default Info;
