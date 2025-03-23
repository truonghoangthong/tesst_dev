import React from "react";
import "./deleteConfirm.css";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, booking }) => {
  if (!isOpen || !booking) return null;

  return (
    <div className="delete-modal-overlay">
      <div className="delete-modal">
        <h3>Are you sure you want to delete this booking?</h3>
        <div className="booking-info">
          <p><strong>Booking ID:</strong> {booking.bookingId}</p>
          <p><strong>Guest:</strong> {booking.client.fullName}</p>
          <p><strong>Check-in:</strong> {new Date(booking.bookingPeriod.startFrom.toMillis()).toLocaleString()}</p>
          <p><strong>Check-out:</strong> {new Date(booking.bookingPeriod.endAt.toMillis()).toLocaleString()}</p>
        </div>
        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="confirm-button" onClick={onConfirm}>
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;