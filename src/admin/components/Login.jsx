import React, { useContext, useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { API_URL } from "../config/constants";
import { useAuth } from "../contexts/AuthContext";

const Login = ({ onSwitch }) => {
  const {currentUser , setCurrentUser } = useAuth(); 
  // console.log("current user is", currentUser);
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
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
  
    const token = localStorage.getItem("token"); // Retrieve token
  
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // Include token if it exists
        },
        body: JSON.stringify(formData), // Send formData as JSON
      });
  
      const result = await response.json();
      if (response.ok) {
        navigate('/')

        if (result.token) {
          localStorage.setItem("token", result.token);
        }
  
        if (result.user && result.user.role) {
          localStorage.setItem("role", result.user.role);
        }
  
        setCurrentUser (result.user);
        console.log("User data set in context:", currentUser);
        window.location.href = "/"; // Redirect to the home page or dashboard
      } else {
        // Handle login failure
        console.error("Login failed:", result.message || "Unknown error");
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
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
            Don't have an account? Sign up
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mt-6 mb-6">
            Welcome back
          </h2>

          <form onSubmit={handleSubmit} className="mt-2">
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

            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:border-purple-500 focus:bg-white focus:outline-none transition duration-150"
                required
              />
            </div>

            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <Button variant="gradient" width="full" type="submit">
              Log in
            </Button>
          </form>
        </div>
      </div>

      {/* Right side - Branding */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-purple-50 to-indigo-100 items-center justify-center p-12 relative overflow-hidden">
        {/* Background Decorative SVGs */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute top-0 right-0 w-40 h-40 text-purple-500 transform rotate-45"
            viewBox="0 0 200 200"
            fill="currentColor"
          >
            <path d="M35.5,97.5c-22.2,35.8-0.3,74.5,29.3,99.1s68.5,35.2,98.7,18.6c30.2-16.6,49.7-50.9,41.5-81.5 s-44-57.3-80.5-71.1C88,48.8,57.7,61.8,35.5,97.5z" />
          </svg>
          <svg
            className="absolute bottom-0 left-0 w-32 h-32 text-indigo-500"
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
            Welcome Back!
          </h2>
          <h3 className="text-3xl font-bold text-purple-800 mt-2">
            Your Events Await 🎉
          </h3>

          <div className="mt-8 bg-white p-5 rounded-lg shadow-md text-left">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Upcoming Event</h4>
                <p className="text-sm text-gray-500">Tech Conference 2025</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>April 25-27, 2025</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>San Francisco Convention Center</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4"
                  />
                </svg>
                <span>Join over 5,000+ attendees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
