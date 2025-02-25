import React from 'react';
import './clientcomplaint.css';

const ClientComplaint = () => {
  return (
    <div className="complaint-form">
      <form>
        <div className="complaint-form-group">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" placeholder="Full Name" required />
        </div>
        <div className="complaint-form-group">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder="Email Address" required />
        </div>
        <div className="complaint-form-group">
          <label htmlFor="room">Room</label>
          <input type="text" id="room" name="room" placeholder="Room" required />
        </div>
        <div className="complaint-form-group">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" placeholder="Phone Number" required />
        </div>
        <div className="complaint-form-group reason">
          <label htmlFor="reason">Reason for Complaint</label>
          <input type="text" id="reason" name="reason" placeholder="Reason" required />
        </div>
        <div className="complaint-form-group details">
          <label htmlFor="details">Please provide any details</label>
          <textarea id="details" name="details" rows="5" placeholder="Details"></textarea>
        </div>
        <button type="submit" className="complaint-submit-button">Submit</button>
      </form>
    </div>
  );
};

export default ClientComplaint;
