import React, { useState, useMemo } from "react";
import { Icon } from "@iconify/react";
import "./rooms/rooms.css";
import "./../variables.css";
import { complaintsStore } from "../../state/complaintStore.js"; 
import { userStore } from "../../state/user.js";
import CardModal from "../card/cardModel.jsx";

const Complaints = () => {
  const users = userStore((state) => state.users);
  const { complaints, setComplaints } = complaintsStore(); 

  const statusOptions = ["Resolved", "Pending", "Cleaning"];
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const updateStatus = (index, newStatus) => {
    const updatedComplaints = complaints.map((complaint, i) =>
      i === index ? { ...complaint, status: newStatus } : complaint
    );
    setComplaints(updatedComplaints);
    setDropdownOpen(null);
  };

  const complaintsWithGuests = useMemo(() => {
    return complaints.map((complaint) => {
      const guest = users.find((user) => user.id === complaint.guestId);
      return { ...complaint, guest };
    });
  }, [complaints, users]);

  const handleGuestClick = (guest) => {
    setModalContent(
      <table className="info-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{guest.name}</td>
          </tr>
          <tr>
            <th>Email</th>
            <td>{guest.email}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{guest.phone}</td>
          </tr>
        </tbody>
      </table>
    );
    setModalOpen(true);
  };

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
            <th>Status</th>
            <th>Actions</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {complaintsWithGuests.map((complaint, index) => (
            <tr key={complaint.id}>
              <td>{complaint.id}</td>
              <td>
                <span variant="link" onClick={() => handleGuestClick(complaint.guest)}>
                  {complaint.guest ? complaint.guest.name : "No Guest"}
                </span>
              </td>
              <td>{complaint.dateSubmitted}</td>
              <td>
                <span variant="link" onClick={() => handleDetailsClick(complaint.details)}>
                  {complaint.details}
                </span>
              </td>
              <td>
                <div className="dropdown-container">
                  <div
                    className={`status ${complaint.status.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => toggleDropdown(index)}
                  >
                    {complaint.status}
                    <Icon icon="material-symbols:arrow-drop-down" />
                  </div>
                  {dropdownOpen === index && (
                    <div className="dropdown">
                      {statusOptions.map((statusOption) => (
                        <div
                          key={statusOption}
                          className="dropdown-item"
                          onClick={() => updateStatus(index, statusOption)}
                        >
                          {statusOption}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </td>
              <td>
                <span variant="link" onClick={() => handleActionClick(complaint.action)}>
                  {complaint.action}
                </span>
              </td>
              <td>
                <span variant="link" onClick={() => handleNoteClick(complaint.note)}>
                  {complaint.note}
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
