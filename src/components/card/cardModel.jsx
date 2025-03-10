import React, { useState, useEffect } from 'react';
import useAuthStore from '../../../../Backend/src/store/authStore'; 
import './cardmodel.css'; 

const Card = ({ children }) => {
  return <div className="custom-card">{children}</div>;
};

const CardModal = ({ isOpen, onClose, content, setModalContent, guest }) => {
  const [editableText, setEditableText] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const { users, setUsers } = useAuthStore(); 

  useEffect(() => {
    setEditableText(content);
  }, [content, isOpen]); 

  if (!isOpen) return null;

  const resetEditableText = () => {
    setEditableText(content); 
  };

  const handleSave = () => {
    if (isEditing) {
      if (guest) {
        const updatedUsers = users.map((user) =>
          user.id === guest.id ? { ...user, name: editableText } : user
        );
        setUsers(updatedUsers); 
      } else {
        setModalContent(editableText); 
      }
    }
    setIsEditing(false); 
    onClose(); 
  };

  const handleClose = () => {
    resetEditableText(); 
    setIsEditing(false); 
    onClose(); 
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  return (
    <div className="custom-modal-overlay">
      <Card>
        <div className="custom-card-content">
          <div className="custom-editable-section">
            {isEditing ? (
              <input
                type="text"
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                className="custom-input"
              />
            ) : (
              <p onClick={handleEditClick} className="custom-editable-text">
                {editableText}
              </p>
            )}
          </div>
          <div className="custom-button-container">
            <button className="custom-button close-button" onClick={handleClose}>
              Close
            </button>
            <button className="custom-button save-button" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CardModal;
