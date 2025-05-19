import React, { useEffect, useState } from 'react';
import { useDeviceData } from '../contexts/DeviceDataContext';
import './AdminConsole.css';

const AdminConsole = () => {
  const { addDeviceData, loading, error: contextError, allDevices } = useDeviceData();
  const [formData, setFormData] = useState({
    deviceId: '',
    temperature: '',
    humidity: ''
  });
  const [status, setStatus] = useState({ message: '', isError: false });
  const [lastSubmission, setLastSubmission] = useState(null);

  // Clear status message after 5 seconds
  useEffect(() => {
    if (status.message) {
      const timer = setTimeout(() => {
        setStatus({ message: '', isError: false });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status.message]);

  // Clear last submission after 5 seconds
  useEffect(() => {
    if (lastSubmission) {
      const timer = setTimeout(() => {
        setLastSubmission(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [lastSubmission]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear any error messages when user starts typing
    if (status.isError) {
      setStatus({ message: '', isError: false });
    }
  };

  const validateForm = () => {
    if (!formData.deviceId.trim()) {
      return 'Device ID is required';
    }
    const temp = parseFloat(formData.temperature);
    const humidity = parseFloat(formData.humidity);
    
    if (isNaN(temp)) {
      return 'Temperature must be a valid number';
    }
    if (isNaN(humidity)) {
      return 'Humidity must be a valid number';
    }
    if (humidity < 0 || humidity > 100) {
      return 'Humidity must be between 0 and 100';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setStatus({ message: validationError, isError: true });
      return;
    }

    try {
      setStatus({ message: 'Transmitting data...', isError: false });
      
      const result = await addDeviceData({
        ...formData,
        temperature: parseFloat(formData.temperature),
        humidity: parseFloat(formData.humidity)
      });

      if (result.success) {
        setStatus({ message: 'Data transmission successful', isError: false });
        setLastSubmission(result.data);
        setFormData({ deviceId: '', temperature: '', humidity: '' });
      } else {
        setStatus({ message: result.error, isError: true });
      }
    } catch (error) {
      setStatus({ 
        message: error.response?.data?.message || 'Data transmission failed', 
        isError: true 
      });
    }
  };

  const handleTestData = () => {
    const testData = {
      deviceId: `DEVICE-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      temperature: (20 + Math.random() * 10).toFixed(1),
      humidity: (40 + Math.random() * 30).toFixed(1)
    };
    setFormData(testData);
    setStatus({ message: '', isError: false });
  };

  return (
    <div className="admin-console">
      <div className="cyber-header">
        <h2>System Control Interface</h2>
        <div className="cyber-lines"></div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="deviceId">Device ID</label>
          <input
            type="text"
            id="deviceId"
            name="deviceId"
            value={formData.deviceId}
            onChange={handleChange}
            placeholder="Enter device identifier"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="temperature">Temperature (°C)</label>
          <input
            type="number"
            id="temperature"
            name="temperature"
            value={formData.temperature}
            onChange={handleChange}
            step="0.1"
            placeholder="Enter temperature value"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="humidity">Humidity (%)</label>
          <input
            type="number"
            id="humidity"
            name="humidity"
            value={formData.humidity}
            onChange={handleChange}
            step="0.1"
            min="0"
            max="100"
            placeholder="Enter humidity level"
            required
          />
        </div>

        <div className="button-group">
          <button type="submit" disabled={loading}>
            {loading ? 'Transmitting...' : 'Submit Data'}
          </button>
          <button type="button" onClick={handleTestData} className="test-button">
            Generate Test Data
          </button>
        </div>
      </form>
      
      {(status.message || contextError) && (
        <div className={`status-message ${status.isError || contextError ? 'error' : 'success'}`}>
          <span className="status-icon">{status.isError ? '!' : '✓'}</span>
          {status.message || contextError}
        </div>
      )}

      {lastSubmission && (
        <div className="last-submission">
          <h3>Last Transmission</h3>
          <div className="submission-details">
            <p><span className="label">Device ID:</span> {lastSubmission.deviceId}</p>
            <p><span className="label">Temperature:</span> {lastSubmission.temperature}°C</p>
            <p><span className="label">Humidity:</span> {lastSubmission.humidity}%</p>
            <p className="timestamp">
              <span className="label">Timestamp:</span> {new Date(lastSubmission.timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {allDevices.length > 0 && (
        <div className="recent-submissions">
          <h3>Recent Transmissions</h3>
          <div className="submissions-list">
            {allDevices.slice(-3).map((device, index) => (
              <div key={index} className="submission-item">
                <p><span className="label">Device:</span> {device.deviceId}</p>
                <p>
                  <span className="label">Temp:</span> {device.temperature}°C | 
                  <span className="label"> Humidity:</span> {device.humidity}%
                </p>
                <p className="timestamp">{new Date(device.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminConsole; 