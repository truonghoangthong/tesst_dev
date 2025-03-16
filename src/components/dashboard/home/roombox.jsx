import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import './roombox.css';

const DashboardBox = ({ humid, temp, additionalStyles = {} }) => {
  const [ledOn, setLedOn] = useState(false);

  const toggleLed = (isOn) => {
    setLedOn(isOn);
  };

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
          <Icon icon="material-symbols:humidity-percentage-rounded" className="db-box-icon" />
          <span>{humid !== null ? `${humid}%` : "--"}</span>
          <Icon icon="material-symbols:thermometer" className="db-box-icon" />
          <span>{temp !== null ? `${temp}°C` : "--"}</span>
        </div>

        <div className="led-control">
          <div className="tab-switch">
            <button
              className={ledOn ? '' : 'active'}
              onClick={() => toggleLed(false)}
            >
              OFF
            </button>
            <button
              className={ledOn ? 'active' : ''}
              onClick={() => toggleLed(true)}
            >
              ON
            </button>
          </div>
          <span className="led-status">{ledOn ? 'LED ON' : 'LED OFF'}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardBox;