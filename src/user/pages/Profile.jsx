import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../admin/config/constants";
import { Button } from "../components/ui/button";

import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils/toast";

const Profile = () => {
  const [user, setUser] = useState({
    name: "",
    email: ""
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, {
          withCredentials: true
        });
        setUser(response.data.user);
      } catch (err) {
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // This prevents the form from submitting automatically

    try {
      await axios.put(`${API_URL}/users/profile`, user, {
        withCredentials: true
      });
      // alert("Profile updated successfully!");
      handleSuccess("Profile updated successfully!");
      window.location.reload(); // Reload the page to reflect changes
      setIsEditing(false);
    } catch (err) {
      // setError("Failed to update profile.");
      handleError("Failed to update profile.");
    }
  };

  // Button to toggle edit mode without form submission
  const toggleEditMode = (e) => {
    e.preventDefault(); // Prevent any default button behavior
    setIsEditing(true);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <ToastContainer />
      <h2 className="text-xl font-bold mb-4">User Profile</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          ) : (
            <p className="mt-1">{user.name}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={user.email || ""}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          ) : (
            <p className="mt-1">{user.email}</p>
          )}
        </div>

        <div className="flex justify-between">
          {isEditing ? (
            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          ) : (
            <Button type="button" onClick={toggleEditMode} className="w-full">
              Edit Profile
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
 
 