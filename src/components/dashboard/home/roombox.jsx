import React, { useState } from 'react';
import { Icon } from "@iconify/react";
import './roombox.css';

const DashboardBox = ({ room, humid, temp, additionalStyles = {} }) => {
  const [ledOn, setLedOn] = useState(false);
  const [relayOn, setRelayOn] = useState(false);

  const toggleLed = (isOn) => {
    setLedOn(isOn);
  };

  const toggleRelay = (isOn) => {
    setRelayOn(isOn);
  };

  return (
    <div className="db-box" style={additionalStyles}>
      <div className="db-box-left">
        <span>{room}</span>
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

        <div className="relay-control">
          <div className="tab-switch">
            <button
              className={relayOn ? '' : 'active'}
              onClick={() => toggleRelay(false)}
            >
              OFF
            </button>
            <button
              className={relayOn ? 'active' : ''}
              onClick={() => toggleRelay(true)}
            >
              ON
            </button>
          </div>
          <span className="relay-status">{relayOn ? 'RELAY ON' : 'RELAY OFF'}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardBox;