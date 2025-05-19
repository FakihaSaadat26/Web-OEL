import React, { useState } from 'react';
import './App.css';
import AdminConsole from './components/AdminConsole';
import Dashboard from './components/Dashboard';
import { DeviceDataProvider } from './contexts/DeviceDataContext';

function App() {
  const [view, setView] = useState('admin'); // Start with admin view for testing

  return (
    <DeviceDataProvider>
      <div className="App">
        <nav className="app-nav">
          <button 
            className={view === 'dashboard' ? 'active' : ''} 
            onClick={() => setView('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={view === 'admin' ? 'active' : ''} 
            onClick={() => setView('admin')}
          >
            Admin Console
          </button>
        </nav>
        {view === 'dashboard' ? <Dashboard /> : <AdminConsole />}
      </div>
    </DeviceDataProvider>
  );
}

export default App; 