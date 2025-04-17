import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { API_URL } from '../../admin/config/constants';

import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils/toast';

const ContactAdmin = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_URL}/users/contact-admin`, {
        subject,
        message,
      }, { withCredentials: true });

      setSuccess(response.data.message);
      handleSuccess("Message sent successfully!");
      setSubject('');
      setMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
      handleError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow-md">
      <ToastContainer />
      <h2 className="text-lg font-semibold mb-4">Contact Admin</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="subject">Subject</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="message">Message</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full border border-gray-300 rounded p-2"
            rows="4"
            required
          />
        </div>
        <Button type="submit" variant="primary">Send Message</Button>
      </form>
    </div>
  );
};

export default ContactAdmin;