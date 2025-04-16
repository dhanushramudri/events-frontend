import React, { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { API_URL } from "../config/constants";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";

const SignUp = ({ onSwitch }) => {
  const { setCurrentUser  } = useAuth(); // Get setCurrentUser  from context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup data:", formData);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Save the token to local storage
        localStorage.setItem("token", result.token);
        
        // Set the current user in context
        setCurrentUser (result.user);
        
        // Redirect to the home page or dashboard
        toast.success("Registration successful!");
        navigate('/login');
      } else {
        // Handle registration failure
        console.error("Registration failed:", result.message || "Unknown error");
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      <ToastContainer/>
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <button
            onClick={onSwitch}
            className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Already have an account?
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mt-6 mb-6">
            Create an account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:outline-none transition duration-150"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:outline-none transition duration-150"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password "
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:outline-none transition duration-150"
                required
                minLength="6"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            <Button variant="gradient" width="full" type="submit">
              Create account
            </Button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-50 to-indigo-100 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute top-0 left-0 w-40 h-40 text-purple-500"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            <path d="M35.5,97.5c-22.2,35.8-0.3,74.5,29.3,99.1s68.5,35.2,98.7,18.6c30.2-16.6,49.7-50.9,41.5-81.5 s-44-57.3-80.5-71.1C88,48.8,57.7,61.8,35.5,97.5z" />
          </svg>
          <svg
            className="absolute bottom-0 right-0 w-32 h-32 text-indigo-500"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            <path d="M46.8,45.7c-15.4,17.8-19.5,45.1-7.5,64s39.1,29.4,65.3,24.8s47.6-22.4,58.7-48.3S171,29.1,150,13.9 S87.6-3.9,64.5,6.8S62.2,28,46.8,45.7z" />
          </svg>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm"></div>
        </div>

        <div className="text-center max-w-md relative z-10">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 inline-flex items-center">
              <span className="text-purple-600 font-bold">Event</span>Flow
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded ml-2 uppercase font-semibold">
                pro
              </span>
            </h1>
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mt-6">
            Seamless Event Management
          </h2>
          <h3 className="text-3xl font-bold text-purple-800 mt-2">
            Plan, Manage, Execute
          </h3>

          <p className="text-gray-600 mt-6 leading-relaxed">
            Create and manage stunning events with powerful tools designed for
            event professionals. From conferences to weddings, we've got you
            covered.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;