import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Clock } from 'lucide-react';

const ClientQueries = () => {
  const { currentUser } = useAuth();
  const [clientMessages, setClientMessages] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.clientMessages) {
      setClientMessages(currentUser.clientMessages);
    }
  }, [currentUser]);

  if (!clientMessages.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-16">
        <Mail className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-lg text-gray-500">No client messages available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-8 flex items-center justify-center gap-2 text-blue-700">
        <Mail className="w-8 h-8" />
        Client Messages
      </h2>
      <div className="space-y-6">
        {clientMessages.map((message) => (
          <div
            key={message._id}
            className="bg-white shadow rounded-lg p-6 border border-blue-100 hover:shadow-lg transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-blue-700 truncate">
                {message.subject || 'No Subject'}
              </h3>
            </div>
            <p className="text-gray-700 mb-4">{message.content}</p>
            <div className="flex items-center text-sm text-gray-400 gap-2">
              <Clock className="w-4 h-4" />
              <span>
                {new Date(message.createdAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientQueries;
