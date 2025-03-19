import axios from 'axios'; 

export const getLedStatus = (callback) => {
  const eventSource = new EventSource('http://8.215.20.85/sse/get-led-status');

  eventSource.onopen = () => {
    console.log('EventSource connection for LED status opened.');
  };

  eventSource.onmessage = (event) => {
    try {
      const parsedData = JSON.parse(event.data);
      console.log('Received LED status:', parsedData);
      callback({ ledStatus: parsedData.status });
      
    } catch (e) {
      console.error('Failed to parse LED status data:', e);
      callback({ ledStatus: null });
    }
  };

  eventSource.onerror = (error) => {
    console.error('LED Status EventSource failed:', error);
    eventSource.close();
    callback({ ledStatus: null });
  };

  return () => {
    eventSource.close();
    console.log('LED Status EventSource connection closed.');
  };
};

export const updateLedStatus = async (status) => {
  try {
    console.log('Updating LED status to:', status);
    const response = await fetch(`http://8.215.20.85/api/v1/update-led-status?status=${status}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.text(); 
    console.log('API response:', data); 
    return data;
  } catch (error) {
    console.error('Error updating LED status:', error);
    throw error;
  }
};