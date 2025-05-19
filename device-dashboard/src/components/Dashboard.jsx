import React from 'react';
import { useDeviceData } from '../contexts/DeviceDataContext';
import './Dashboard.css';
import DataCard from './DataCard';

const Dashboard = () => {
  const { deviceData, loading, error } = useDeviceData();

  if (loading) {
    return <div className="dashboard-message">Loading...</div>;
  }

  if (error) {
    return <div className="dashboard-message error">{error}</div>;
  }

  if (!deviceData) {
    return <div className="dashboard-message">No data available</div>;
  }

  return (
    <div className="dashboard">
      <h1>Device Dashboard</h1>
      <div className="dashboard-grid">
        <DataCard
          title="Temperature"
          value={deviceData.temperature.toFixed(1)}
          unit="°C"
        />
        <DataCard
          title="Humidity"
          value={deviceData.humidity.toFixed(1)}
          unit="%"
        />
      </div>
      <div className="dashboard-timestamp">
        Last updated: {new Date(deviceData.timestamp).toLocaleString()}
      </div>
    </div>
  );
};

export default Dashboard; 