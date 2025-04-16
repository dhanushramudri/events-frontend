import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Mail, Clock, User, Search, ArrowUpDown } from "lucide-react";

const ClientQueries = () => {
  const { currentUser } = useAuth();
  const [clientMessages, setClientMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    if (currentUser && currentUser.clientMessages) {
      setClientMessages(currentUser.clientMessages);
    }
  }, [currentUser]);

  // Filter messages based on search term
  const filteredMessages = clientMessages.filter(
    (message) =>
      message.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort messages based on sort order
  const sortedMessages = [...filteredMessages].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "newest" ? "oldest" : "newest");
  };

  // Empty state
  if (!clientMessages.length) {
    return (
      <div className="flex flex-col items-center justify-center mt-16 p-8 bg-white rounded-lg shadow">
        <Mail className="w-16 h-16 text-blue-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Messages Yet
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          You don't have any client messages at the moment. They'll appear here
          when clients reach out to you.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <Mail className="w-6 h-6" />
          Client Messages
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {clientMessages.length}
          </span>
        </h2>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search messages..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
        >
          <ArrowUpDown className="w-4 h-4" />
          {sortOrder === "newest" ? "Newest First" : "Oldest First"}
        </button>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No messages match your search.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMessages.map((message) => (
            <div
              key={message._id}
              className="bg-white shadow rounded-lg p-6 border-l-4 border-l-blue-500 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-blue-800">
                  {message.subject || "No Subject"}
                </h3>
                <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-700 mb-4 whitespace-pre-line">
                {message.content}
              </p>

              <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-3 mt-2">
                <div className="flex items-center text-gray-500 gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    {message.sender
                      ? `ID: ${message.sender.substring(0, 8)}...`
                      : "Unknown Sender"}
                  </span>
                </div>

                <div className="flex items-center text-gray-500 gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(message.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientQueries;
