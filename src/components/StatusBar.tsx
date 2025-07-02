import React from 'react';

interface StatusBarProps {
  isConnected: boolean;
  model?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ isConnected, model }) => {
  return (
    <div className="status-bar">
      <div className="status-left">
        <div className="status-item">
          <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}></div>
          <span>{isConnected ? 'AI Connected' : 'AI Disconnected'}</span>
        </div>
        
        {model && (
          <div className="status-item">
            <span>Model: {model}</span>
          </div>
        )}
      </div>
      
      <div className="status-right">
        <div className="status-item">
          <span>DeskMate AI v1.0.0</span>
        </div>
      </div>
    </div>
  );
};

export default StatusBar; 