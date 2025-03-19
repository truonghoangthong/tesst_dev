import axios from 'axios'; // Import axios

export const getRelayStatus = (callback) => {
  const eventSource = new EventSource('http://8.215.20.85/sse/get-relay-status');

  eventSource.onopen = () => {
    console.log('EventSource connection for Relay status opened.');
  };

  eventSource.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      console.log('Received relay status:', parsedData);
      callback({ relayStatus: parsedData.status });
      
    } catch (e) {
      console.error('Failed to parse Relay status data:', e);
      callback({ relayStatus: null });
    }
  };

  eventSource.onerror = (error) => {
    console.error('Relay Status EventSource failed:', error);
    eventSource.close();
    callback({ relayStatus: null });
  };

  return () => {
    eventSource.close();
    console.log('Relay Status EventSource connection closed.');
  };
};

export const updateRelayStatus = async (status) => {
  try {
    console.log(`Preparing to update Relay status. Status parameter: "${status}"`);
    const response = await axios.get('http://8.215.20.85/api/v1/update-relay-status', {
      params: { status }, 
    });
    console.log('API response:', response.data); 
    return response.data;
  } catch (error) {
    console.error('Error updating Relay status:', error);
    throw error;
  }
};