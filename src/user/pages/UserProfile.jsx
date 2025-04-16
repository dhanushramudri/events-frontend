import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../admin/config/constants";
import { Button } from "../components/ui/button"; // Import the custom Button component

const UserProfile = () => {
  const [user, setUser ] = useState({ name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser Data = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        setUser (response.data.user);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser Data();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser ((prevUser ) => ({ ...prevUser , [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/profile`, user, { withCredentials: true });
      alert("Profile updated successfully!");
      setIsEditing(false); // Exit edit mode after successful update
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-[#19105b] rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">User  Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-[#ff6196] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#ff6196]"
              required
            />
          ) : (
            <p className="mt-1 block text-gray-200">{user.name}</p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200">Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="mt-1 block w-full border border-[#ff6196] rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#ff6196]"
              required
            />
          ) : (
            <p className="mt-1 block text-gray-200">{user.email}</p>
          )}
        </div>
        <div className="flex justify-between">
          {isEditing ? (
            <Button type="submit" variant="primary" className="w-full">
              Update Profile
            </Button>
          ) : (
            <Button type="button" onClick={() => setIsEditing(true)} variant="secondary" className="w-full">
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default UserProfile;