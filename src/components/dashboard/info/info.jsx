import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import useAuthStore from "../../../../../Backend/src/store/authStore";
import useAdminEditProfile from "../../../../../Backend/src/hooks/EditProfileHooks/useAdminEditProfile";
import useClientEditProfile from "../../../../../Backend/src/hooks/EditProfileHooks/useClientEditProfile"; 
import usePreviewImage from "../../../../../Backend/src/hooks/EditProfileHooks/usePreviewImage";
import useChangePassword from "../../../../../Backend/src/hooks/AuthenicationHooks/useChangePassword";
import Popup from "../../popup/popup";
import './info.css';

const Info = () => {
  const user = useAuthStore((state) => state.user);
  const { editProfile: adminEditProfile, isUpdating } = useAdminEditProfile();
  const { editProfile: clientEditProfile } = useClientEditProfile(); 
  const [popup, setPopup] = useState({ show: false, title: "", message: "", status: "" });
  const { selectedFile, error, setSelectedFile, handleImageChange } = usePreviewImage();
  const [formData, setFormData] = useState({
    fullName: user.fullName || "",
    phoneNum: user.phoneNum || "",
    email: user.email || "",
    profileImage: user.profileImage || "",
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordPopup, setPasswordPopup] = useState({ show: false, title: "", message: "", status: "" });

  useEffect(() => {
    if (user) {
      setFormData({ fullName: user.fullName, 
                    phoneNum: user.phoneNum, 
                    email: user.email, 
                    profileImage: user.profileImage });
    }
  }, [user]);

  useEffect(() => {
    if (selectedFile) {
      setFormData((prevProfile) => ({
        ...prevProfile,
        profileImage: selectedFile || "",
      }));
    }
  }, [selectedFile]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async () => {
    setPopup({ show: false, title: "", message: "", status: "" });

    const { fullName, phoneNum } = formData;
    const inputs = { fullName, phoneNum };
    console.log("Inputs:", inputs);

    const editResponse = user.isAdmin ? await adminEditProfile(inputs, selectedFile) : await clientEditProfile(inputs);
    if (editResponse.Status === "success") {
      setPopup({
        show: true,
        title: "Success",
        message: "Profile updated successfully!",
        status: "success"
      });
      setSelectedFile(null);
    } else {
      setFormData({
        fullName: user.fullName || "",
        phoneNum: user.phoneNum || "",
        email: user.email || ""
      });
      setPopup({
        show: true,
        title: "Error",
        message: `Error: ${editResponse.Message}`,
        status: "error"
      });
      setTimeout(() => {
        setPopup({ show: false, title: "", message: "", status: "" });
      }, 10000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault(); 

    if (newPassword !== confirmPassword) {
      setPasswordPopup({
        show: true,
        title: "Error",
        message: "New passwords do not match!",
        status: "error"
      });
      return;
    }

    const response = await useChangePassword(newPassword, user.email, currentPassword);

    setPasswordPopup({
      show: true,
      title: response.Title,
      message: response.Message,
      status: response.Status
    });

    if (response.Status === "success") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }

    setTimeout(() => {
      setPasswordPopup({ show: false, title: "", message: "", status: "" });
    }, 10000);
  };

  const closePopup = () => setPopup({ show: false, title: "", message: "", status: "" });

  const { fullName, phoneNum, email } = formData;

  return (
    <div className="info">
      {user.isAdmin && <div className="info-gradient-box"></div>}
      <div className="info-details">
        <div className="info-name-box">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              width="100"
              height="100"
              style={{ borderRadius: '50%' }}
            />
          ) : (
            <Icon icon="mdi:person-circle-outline" width="100" height="100" />
          )}
          <div className="info-name-column"> 
            <span className="info-info-name">{fullName}</span>
            <span className="info-info-email">{email}</span>
          </div>
        </div>
        
        <button className="info-save-profile-button" onClick={handleSave} disabled={isUpdating}>
          Save
        </button>
        
        <div className="info-info-row">
          <form className="info-info-form">
            <div className="info-form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="info-form-group">
              <label htmlFor="phoneNum">Phone Number</label>
              <input
                type="text"
                id="phoneNum"
                value={phoneNum}
                onChange={handleInputChange}
              />
            </div>
            <div className="info-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
              />
            </div>
        
            {user.isAdmin && (
              <div className="info-form-group">
                <label htmlFor="profileImage">Profile Image</label>
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            )}
          </form>
          
          <div className="info-info-column">
            <form className="info-change-password-form" onSubmit={handleChangePassword}>
              <div className="info-form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="info-form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="info-form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="info-change-password-button">
                Change Password
              </button>
            </form>
          </div>
        </div>
      </div>
          
      {popup.show && (
        <Popup
          title={popup.title}
          message={popup.message}
          status={popup.status}
          onClose={closePopup}
        />
      )}

      {passwordPopup.show && (
        <Popup
          title={passwordPopup.title}
          message={passwordPopup.message}
          status={passwordPopup.status}
          onClose={() => setPasswordPopup({ show: false, title: "", message: "", status: "" })}
        />
      )}
    </div>
  );
};

export default Info;
