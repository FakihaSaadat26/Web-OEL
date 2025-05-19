const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for device data
let deviceData = [];

// POST endpoint to receive device data
app.post('/api/data', (req, res) => {
  try {
    const { deviceId, temperature, humidity, timestamp } = req.body;
    
    // Validate required fields
    if (!deviceId || temperature === undefined || humidity === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Validate data types and ranges
    if (typeof temperature !== 'number' || typeof humidity !== 'number') {
      return res.status(400).json({ message: 'Temperature and humidity must be numbers' });
    }

    if (humidity < 0 || humidity > 100) {
      return res.status(400).json({ message: 'Humidity must be between 0 and 100' });
    }

    const newData = {
      deviceId,
      temperature,
      humidity,
      timestamp: timestamp || new Date().toISOString()
    };

    deviceData.push(newData);

    // Keep only the last 100 readings
    if (deviceData.length > 100) {
      deviceData = deviceData.slice(-100);
    }

    res.status(201).json(newData);
  } catch (error) {
    console.error('Error processing device data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET endpoint to retrieve latest device data
app.get('/api/data/latest', (req, res) => {
  try {
    const latestData = deviceData[deviceData.length - 1];
    if (!latestData) {
      return res.status(404).json({ message: 'No data available' });
    }
    res.json(latestData);
  } catch (error) {
    console.error('Error retrieving device data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET endpoint to retrieve all device data
app.get('/api/data', (req, res) => {
  try {
    res.json(deviceData);
  } catch (error) {
    console.error('Error retrieving device data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Device Dashboard API is running' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
}); 