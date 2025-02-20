import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useAuthStore from "../../../../../Backend/src/store/authStore";
import useAdminEditProfile from "../../../../../Backend/src/hooks/EditProfileHooks/useAdminEditProfile";
import './info.css';
import Popup from '../../popup'; 

const Info = () => {
  const user = useAuthStore((state) => state.user);  
  const { editProfile, isUpdating } = useAdminEditProfile(); 

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    phoneNum: user?.phoneNum || "",
    email: user?.email || ""
  });
  const [selectedFile, setSelectedFile] = useState(null);  
  const [popup, setPopup] = useState({ show: false, title: "", message: "", status: "" });

  useEffect(() => {
    if (user) {
      setFormData({ fullName: user.fullName, phoneNum: user.phoneNum, email: user.email });
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSave = async () => {
    setPopup({ show: false, title: "", message: "", status: "" });

    const inputs = { fullName, phoneNum };
    console.log("InputsInputs:", inputs);
    console.log("File:", selectedFile);

    const response = await editProfile(inputs, selectedFile);
    if (response.Status === "success") {
      setPopup({
        show: true,
        title: "Success",
        message: "Profile updated successfully!",
        status: "success"
      });
    } else {
      setFormData({
        fullName: user?.fullName || "",
        phoneNum: user?.phoneNum || "",
        email: user?.email || ""
      });
      setPopup({
        show: true,
        title: "Error",
        message: `Error: ${response.Message}`,
        status: "error"
      });
    }
  };
  
  

  const closePopup = () => setPopup({ show: false, title: "", message: "", status: "" });

  const { fullName, phoneNum, email } = formData;

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
        <button onClick={handleSave} disabled={isUpdating}>Save</button> 
        <form className="info-form">
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phoneNum">Phone Number</label>
            <input
              type="text"
              id="phoneNum"
              value={phoneNum}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
            />
          </div>
          <div className="form-group">
            <label htmlFor="profileImage">Profile Image</label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              onChange={handleFileChange} 
            />
          </div>
        </form>
      </div>

      {popup.show && (
        <Popup
          title={popup.title}
          message={popup.message}
          status={popup.status}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default Info;
