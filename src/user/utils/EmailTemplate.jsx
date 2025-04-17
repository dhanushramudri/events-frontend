// EmailTemplate.jsx
import React from 'react';

const EmailTemplate = ({ toName, eventName }) => {
  return (
    <div className="font-sans p-5 bg-gray-100">
      <h2 className="text-gray-800 text-center text-2xl">Registration Confirmation</h2>
      <p className="text-gray-600 text-base">
        Dear {toName},
      </p>
      <p className="text-gray-600 text-base">
        You have successfully registered for the event: <strong>{eventName}</strong>.
      </p>
      <p className="text-gray-600 text-base">
        We look forward to seeing you there!
      </p>
      <p className="text-gray-500 text-sm mt-8">
        Best regards,<br />
        The Event Team
      </p>
    </div>
  );
};

export default EmailTemplate;