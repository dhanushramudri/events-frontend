// EmailTemplate.jsx
import React from 'react';

const EmailTemplate = ({ toName, eventName }) => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', backgroundColor: '#f4f4f4' }}>
      <h2 style={{ color: '#333', textAlign: 'center' }}>Registration Confirmation</h2>
      <p style={{ fontSize: '16px', color: '#555' }}>
        Dear {toName},
      </p>
      <p style={{ fontSize: '16px', color: '#555' }}>
        You have successfully registered for the event: <strong>{eventName}</strong>.
      </p>
      <p style={{ fontSize: '16px', color: '#555' }}>
        We look forward to seeing you there!
      </p>
      <p style={{ fontSize: '14px', color: '#777', marginTop: '30px' }}>
        Best regards,<br />
        The Event Team
      </p>
    </div>
  );
};

export default EmailTemplate;

