import React from 'react';

interface MessageProps {
  message: string;
  color: string;
}

export const MessageDisplay: React.FC<MessageProps> = ({ message, color }) => {
  if (!message) return null;

  return (
    <div className="status-container" style={{ padding: '10px' }}>
      <p 
        className="message" 
        style={{ color, fontWeight: 'bold', textAlign: 'center' }}
        role="alert"
      >
        {message}
      </p>
    </div>
  );
};