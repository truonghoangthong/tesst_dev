import React, { useState, useEffect } from 'react';
import './clientcomplaint.css';
import useAuthStore from "../../../../../Backend/src/store/authStore";
import useFeedbackStore from '../../../../../Backend/src/store/feedbackStore';
import Popup from '../../popup/popup';

const ClientComplaint = () => {
  const user = useAuthStore((state) => state.user);
  const { addFeedback } = useFeedbackStore();

  const [formData, setFormData] = useState({
    uid: user.uid,
    fullName: user.fullName,
    complaintTitle: '',
    complaintContent: ''
  });

  const [showPopup, setShowPopup] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupMessage, setPopupMessage] = useState('');
  const [popupStatus, setPopupStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newFeedback = {
      client: {
        fullName: formData.fullName,
        uid: formData.uid,
      },
      complaint: {
        complaintTitle: formData.complaintTitle,
        complaintContent: formData.complaintContent,
      },
      createdAt: new Date(),
    };

    const result = await addFeedback(newFeedback);

    if (result.Status === 'success') {
      setPopupTitle('Success');
      setPopupMessage(result.Message);
      setPopupStatus('success');
      setShowPopup(true);

      setFormData({
        uid: user.uid,
        fullName: user.fullName,
        complaintTitle: '',
        complaintContent: ''
      });
    } else {
      setPopupTitle('Error');
      setPopupMessage(`Error: ${result.Message}`);
      setPopupStatus('error');
      setShowPopup(true);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="complaint-form">
      <form onSubmit={handleSubmit}>
        <div className="complaint-form-row">
          <div className="complaint-form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={user.fullName}
              placeholder={user.fullName}
              required
              readOnly
            />
          </div>
          <div className="complaint-form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              placeholder={user.email}
              required
              readOnly
            />
          </div>
        </div>

        <div className="complaint-form-row">
          <div className="complaint-form-group">
            <label htmlFor="room">Room</label>
            <input
              type="text"
              id="room"
              name="room"
              value={user.room}
              placeholder={user.room}
              required
              readOnly
            />
          </div>
          <div className="complaint-form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={user.phoneNum}
              placeholder={user.phoneNum}
              required
              readOnly
            />
          </div>
        </div>

        <div className="complaint-form-group">
          <label htmlFor="complaintTitle">Reason for Complaint</label>
          <input
            type="text"
            id="complaintTitle"
            name="complaintTitle"
            value={formData.complaintTitle}
            onChange={handleChange}
            placeholder="Reason"
            required
          />
        </div>

        <div className="complaint-form-group details">
          <label htmlFor="complaintContent">Please provide any details</label>
          <textarea
            id="complaintContent"
            name="complaintContent"
            value={formData.complaintContent}
            onChange={handleChange}
            rows="5"
            placeholder="Details"
            required
          />
        </div>

        <button type="submit" className="complaint-submit-button">
          Submit
        </button>
      </form>

      {showPopup && (
        <Popup
          title={popupTitle}
          message={popupMessage}
          status={popupStatus}
          onClose={closePopup}
        />
      )}
    </div>
  );
};

export default ClientComplaint;