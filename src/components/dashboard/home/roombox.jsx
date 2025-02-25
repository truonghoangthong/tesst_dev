import React from 'react';
import { Icon } from "@iconify/react";
import './roombox.css';  // You can create a new file for styles or reuse the existing ones

const DashboardBox = ({ status, humid, temp, guest, additionalStyles = {} }) => {
  const statusStyles = {
    available: 'status-available',
    occupied: 'status-occupied',
    cleaning: 'status-cleaning',
    booked: 'status-booked',
  };

  return (
    <div className="db-box" style={additionalStyles}>
      <div className="db-box-left">
        <span>A</span>
      </div>
      <div className="db-box-right">
        <div className="db-box-row">
          <span>Status:</span>
          <span className={statusStyles[status] || 'status-default'}>{status}</span>
        </div>
        <div className="db-box-row">
          <Icon icon="material-symbols:humidity-percentage-rounded" className="db-box-icon" />
          <span>{humid !== null ? `${humid}%` : "--"}</span>
          <Icon icon="material-symbols:thermometer" className="db-box-icon" />
          <span>{temp !== null ? `${temp}°C` : "--"}</span>
        </div>
        <span>Guest: {guest || '--'}</span>
      </div>
    </div>
  );
};

export default DashboardBox;
