import React from 'react';

interface VoiceIndicatorProps {
  isListening: boolean;
  onVoiceCommand: () => void;
}

const VoiceIndicator: React.FC<VoiceIndicatorProps> = ({ isListening, onVoiceCommand }) => {
  return (
    <div className="voice-indicator">
      <button
        onClick={onVoiceCommand}
        className={`voice-button ${isListening ? 'listening' : ''}`}
        disabled={isListening}
        title={isListening ? 'Listening...' : 'Click for voice command (Cmd+Shift+Space)'}
      >
        {isListening ? '🔴' : '🎤'}
      </button>
      
      {isListening && (
        <div className="listening-indicator">
          <div className="listening-text">Listening...</div>
        </div>
      )}
    </div>
  );
};

export default VoiceIndicator; 