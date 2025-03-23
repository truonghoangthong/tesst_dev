import React, { useState, useMemo, useEffect } from "react";
import { Icon } from "@iconify/react";
import "./rooms/rooms.css";
import "./../variables.css";
import useFeedbackStore from "../../../../Backend/src/store/feedbackStore.js";
import CardModal from "../card/cardModel.jsx";

const Complaints = () => {
  const { feedbacks, fetchFeedbacks } = useFeedbackStore(); 
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleDetailsClick = (details) => {
    setModalContent(`Details: ${details}`);
    setModalOpen(true);
  };

  const handleActionClick = (action) => {
    setModalContent(`Edit Action: ${action}`);
    setModalOpen(true);
  };

  const handleNoteClick = (note) => {
    setModalContent(`Edit Note: ${note}`);
    setModalOpen(true);
  };

  return (
    <div className="rooms">
      <div className="dir">
        <span>Dashboard</span>
        <Icon icon="material-symbols:chevron-right-rounded" width="24" height="24" />
        <span>Complaints</span>
      </div>
      <table className="booking-table">
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Guest</th>
            <th>Date Submitted</th>
            <th>Details</th>
            <th>Actions</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback, index) => (
            <tr key={feedback.feedbackId}>
              <td>{feedback.feedbackId}</td>
              <td>
                <span variant="link">
                  {feedback.client?.fullName || "No Guest"}
                </span>
              </td>
              <td>{feedback.createdAt?.toDate().toLocaleString()}</td>
              <td>
                <span variant="link" onClick={() => handleDetailsClick(feedback.complaint.complaintContent)}>
                  {feedback.complaint.complaintContent}
                </span>
              </td>
              <td>
                <span variant="link" onClick={() => handleActionClick(feedback.action)}>
                  {feedback.action || "No Action"}
                </span>
              </td>
              <td>
                <span variant="link" onClick={() => handleNoteClick(feedback.note)}>
                  {feedback.note || "No Note"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <CardModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        content={modalContent}
        setModalContent={setModalContent}
      />
    </div>
  );
};

export default Complaints;