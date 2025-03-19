import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react";
import './roombox.css';
import { updateLedStatus } from '../../../services/led.js';
import { updateRelayStatus } from '../../../services/relay.js'; 
import useDataStore from '../../../services/data.js';

const DashboardBox = ({ room, humid, temp, additionalStyles = {} }) => {
  const { data, fetchLedStatus, fetchRelayStatus } = useDataStore();

  const [ledOn, setLedOn] = useState(data.ledStatus === 'on');
  const [relayOn, setRelayOn] = useState(data.relayStatus === 'on');

  useEffect(() => {
    setLedOn(data.ledStatus === 'on');
    setRelayOn(data.relayStatus === 'on');
  }, [data.ledStatus, data.relayStatus]);

  const toggleLed = async (isOn) => {
    try {
      const status = isOn ? 'on' : 'off';
      console.log('Updating LED status to:', status); 
      const response = await updateLedStatus(status);
      console.log('API response:', response);
      setLedOn(isOn);
      fetchLedStatus(); 
    } catch (error) {
      console.error('Error toggling LED:', error);
    }
  };

  const toggleRelay = async (isOn) => {
    try {
      const status = isOn ? 'on' : 'off';
      await updateRelayStatus(status);
      setRelayOn(isOn);
      fetchRelayStatus(); 
    } catch (error) {
      console.error('Error toggling Relay:', error);
    }
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