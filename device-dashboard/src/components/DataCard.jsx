import React from 'react';
import './DataCard.css';

const DataCard = ({ title, value, unit }) => {
  return (
    <div className="data-card">
      <h3 className="data-card-title">{title}</h3>
      <div className="data-card-value">
        {value}
        <span className="data-card-unit">{unit}</span>
      </div>
    </div>
  );
};

export default DataCard; 