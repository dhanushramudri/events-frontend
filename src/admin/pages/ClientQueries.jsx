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
      <div className="flex flex-col items-center justify-center mt-16 p-8 bg-white rounded-lg shadow-md">
        <Mail className="w-16 h-16 text-blue-500 mb-4" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          No Messages Yet
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          You don't have any client messages at the moment. They'll appear here
          when clients reach out to you.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-blue-700 flex items-center gap-2">
          <Mail className="w-6 h-6" />
          Client Messages
          <span className="text-sm bg-blue-100 text-blue-700 font-medium ml-2 px-2.5 py-0.5 rounded">
            {clientMessages.length}
          </span>
        </h2>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search messages..."
            className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={toggleSortOrder}
          className="flex items-center gap-2 px-4 py-2 bg-[#19105b]  text-white rounded-lg transition hover:bg-[#19105b] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
        <div className="divide-y divide-gray-200">
          {sortedMessages.map((message) => (
            <div
              key={message._id}
              className="py-4 px-6 bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-blue-800">
                  {message.subject || "No Subject"}
                </h3>
                <span className="inline-flex items-center bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {new Date(message.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 mb-3 whitespace-pre-line">
                {message.content}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-gray-600 gap-2">
                  <User className="w-4 h-4" />
                  <span>
                    {message.name ? message.name : "Unknown Sender"} 
                    {/* (ID:{" "}
                    {message.sender ? message.sender.substring(0, 8) + "..." : "N/A"}
                    ) */}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Date(message.createdAt).toLocaleTimeString()}
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
