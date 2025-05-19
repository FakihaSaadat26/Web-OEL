import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:5000';

const DeviceDataContext = createContext(null);

export const useDeviceData = () => {
  const context = useContext(DeviceDataContext);
  if (!context) {
    throw new Error('useDeviceData must be used within a DeviceDataProvider');
  }
  return context;
};

export const DeviceDataProvider = ({ children }) => {
  const [deviceData, setDeviceData] = useState(null);
  const [allDevices, setAllDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch latest data
      const latestResponse = await axios.get(`${API_BASE_URL}/api/data/latest`);
      setDeviceData(latestResponse.data);
      
      // Fetch all devices data
      const allDataResponse = await axios.get(`${API_BASE_URL}/api/data`);
      setAllDevices(allDataResponse.data);
    } catch (err) {
      console.error('Error fetching device data:', err);
      setError(err.response?.data?.message || 'Failed to fetch device data');
    } finally {
      setLoading(false);
    }
  };

  const addDeviceData = async (newData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${API_BASE_URL}/api/data`, {
        ...newData,
        timestamp: new Date().toISOString()
      });
      
      // Update both latest data and all devices
      setDeviceData(response.data);
      setAllDevices(prev => [...prev, response.data]);
      
      return { success: true, data: response.data };
    } catch (err) {
      console.error('Error adding device data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to add device data';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const value = {
    deviceData,
    allDevices,
    loading,
    error,
    refreshData: fetchData,
    addDeviceData
  };

  return (
    <DeviceDataContext.Provider value={value}>
      {children}
    </DeviceDataContext.Provider>
  );
}; 