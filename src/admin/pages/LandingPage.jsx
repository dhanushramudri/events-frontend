import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const slides = [
    {
      title: "Plan Events With Ease",
      description: "Streamline your event planning process with our intuitive tools",
      image: "conference.svg"
    },
    {
      title: "Track Attendees",
      description: "Manage registrations and attendance with powerful analytics",
      image: "attendees.svg"
    },
    {
      title: "Custom Ticketing",
      description: "Create and sell tickets with flexible pricing options",
      image: "tickets.svg"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 font-sans overflow-hidden relative">
      {/* Decorative Background SVGs */}
      <div className="absolute inset-0 overflow-hidden">
        <svg className="absolute top-0 right-0 w-64 h-64 text-purple-200 transform rotate-12 opacity-60" viewBox="0 0 200 200" fill="currentColor">
          <path d="M35.5,97.5c-22.2,35.8-0.3,74.5,29.3,99.1s68.5,35.2,98.7,18.6c30.2-16.6,49.7-50.9,41.5-81.5s-44-57.3-80.5-71.1C88,48.8,57.7,61.8,35.5,97.5z" />
        </svg>
        <svg className="absolute bottom-0 left-0 w-56 h-56 text-indigo-200 opacity-60" viewBox="0 0 200 200" fill="currentColor">
          <path d="M46.8,45.7c-15.4,17.8-19.5,45.1-7.5,64s39.1,29.4,65.3,24.8s47.6-22.4,58.7-48.3S171,29.1,150,13.9S87.6-3.9,64.5,6.8S62.2,28,46.8,45.7z" />
        </svg>
        <svg className="absolute top-1/4 left-1/4 w-32 h-32 text-purple-300 animate-pulse opacity-30" viewBox="0 0 200 200" fill="currentColor">
          <path d="M55.2,18.3c-17.1,11.1-25.6,36.4-21.6,59.6s21.3,44.5,42.8,53.2s46.3,6.6,63.4-8.3s25.6-40.5,13.3-60.9S119.6,23.5,97,17.5S72.3,7.3,55.2,18.3z" />
        </svg>
      </div>
      
      {/* Floating Animated Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute text-purple-400 opacity-20"
          style={{ top: "15%", left: "10%" }}
          animate={{
            y: [0, 15, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 5 }}
        >
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute text-indigo-400 opacity-20"
          style={{ top: "65%", right: "15%" }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 7, delay: 1 }}
        >
          <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        </motion.div>
        <motion.div
          className="absolute text-purple-300 opacity-20"
          style={{ bottom: "20%", left: "20%" }}
          animate={{
            y: [0, 10, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ repeat: Infinity, duration: 4, delay: 2 }}
        >
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-800 inline-flex items-center">
              <span className="text-purple-600 font-bold">Event</span>Flow
              <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded ml-2 uppercase font-semibold">pro</span>
            </h1>
          </div>
          <div className="hidden md:flex space-x-6">
            <button className="text-gray-600 hover:text-gray-900 font-medium">Features</button>
            <button className="text-gray-600 hover:text-gray-900 font-medium">Pricing</button>
            <button className="text-gray-600 hover:text-gray-900 font-medium">About</button>
            <button className="text-gray-600 hover:text-gray-900 font-medium">Contact</button>
          </div>
          <div className="flex space-x-4">
            <Button
              variant="outline"
              onClick={() => navigate("/login")}
              className="border-purple-500 text-purple-600 hover:bg-purple-50"
            >
              Log in
            </Button>
            <Button
              variant="gradient"
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
            >
              Sign up
            </Button>
          </div>
        </nav>
        
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center mb-24">
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              <span className="block">Simplify Your</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">Event Management</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Create, manage, and promote your events with our all-in-one platform. 
              Designed for organizers who want to make an impact.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="gradient"
                onClick={() => navigate("/demo")}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-3 text-lg"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/tour")}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg"
              >
                Take a Tour
              </Button>
            </div>
          </motion.div>
          
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-xl shadow-xl p-6 relative overflow-hidden border border-gray-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full z-0"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Tech Conference 2025</h3>
                  <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-medium">Live</span>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">April 25-27, 2025</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-600">San Francisco Convention Center</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-purple-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span className="text-gray-600">5,234 Registered Attendees</span>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Ticket Sales</p>
                      <p className="text-lg font-medium text-gray-800">84% Complete</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="text-lg font-medium text-gray-800">$419,520</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mt-2">
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2.5 rounded-full" style={{ width: "84%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Feature Carousel */}
        <motion.div 
          className="mb-24"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Why Choose EventFlow</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers everything you need to create successful events from start to finish
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out"
                 style={{ transform: `translateX(-${currentSlide * 100 / slides.length}%)`, width: `${slides.length * 100}%` }}>
              {slides.map((slide, index) => (
                <div key={index} className="w-full" style={{ flexBasis: `${100 / slides.length}%` }}>
                  <div className="bg-white rounded-xl shadow-md overflow-hidden mx-4 h-96">
                    <div className="p-8 text-center">
                      <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          {index === 0 && <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />}
                          {index === 1 && <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />}
                          {index === 2 && <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />}
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-gray-800 mb-4">{slide.title}</h4>
                      <p className="text-lg text-gray-600 mb-8">{slide.description}</p>
                      <div className="w-3/4 h-32 mx-auto relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-24 h-24 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            {index === 0 && <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />}
                            {index === 1 && <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />}
                            {index === 2 && <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />}
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-6 space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-purple-600' : 'bg-gray-300'}`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>
        
        {/* Stats Section */}
        <motion.div 
          className="mb-24 py-12 px-6 bg-white rounded-2xl shadow-lg relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-bl-full z-0"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-50 rounded-tr-full z-0"></div>
          
          <div className="relative z-10">
            <h3 className="text-3xl font-bold text-gray-800 text-center mb-12">Trusted by Event Organizers Worldwide</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">10,000+</div>
                <div className="text-xl text-gray-600">Events Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">2.5M+</div>
                <div className="text-xl text-gray-600">Attendees</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-xl text-gray-600">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div 
          className="text-center py-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
          <h3 className="text-4xl font-bold text-gray-800 mb-6">Ready to Transform Your Events?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of event organizers who trust EventFlow to create memorable experiences
          </p>
          <Button
            variant="gradient"
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-10 py-4 text-lg"
          >
            Start Your Free Trial
          </Button>
          <p className="mt-4 text-gray-500">No credit card required</p>
        </motion.div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <h1 className="text-2xl font-bold text-gray-800 inline-flex items-center mb-4">
                <span className="text-purple-600 font-bold">Event</span>Flow
                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded ml-2 uppercase font-semibold">pro</span>
              </h1>
              <p className="text-gray-600 max-w-sm">
                The all-in-one platform for creating and managing extraordinary events.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="text-gray-900 font-medium mb-4">Product</h4>
                <ul className="space-y-2">
                  <li><button className="text-gray-600 hover:text-purple-600">Features</button></li>
                  <li><button className="text-gray-600 hover:text-purple-600">Pricing</button></li>
                  <li><button className="text-gray-600 hover:text-purple-600">Integrations</button></li>
                  <li><button className="text-gray-600 hover:text-purple-600">What's New</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><button className="text-gray-600 hover:text-purple-600">About Us</button></li>
                  <li><button className="text-gray-600 hover:text-purple-600">Careers</button></li>
                  <li><button className="text-gray-600 hover:text-purple-600">Blog</button></li>
                  <li><button className="text-gray-600 hover:text-purple-600">Contact</button></li>
                </ul>
              </div>
              <div>
                <h4 className="text-gray-900 font-medium mb-4">Support</h4>
                <ul className="space-y-2">
                  <li><button className="text-gray-600 hover:text-purple-600">Help Center</button></li>
                  <li><button className="text-gray-600 hover:text-purple-600">Community</button></li>
                  <li><button className="text-gray-600 hover:text-purple-600">Documentation</button></li>
                  <li><button className="text-gray-600 hover:text-purple-600">Status</button></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 mb-4 md:mb-0">© 2025 EventFlow, Inc. All rights reserved.</p>
            <div className="flex space-x-6">
              <button className="text-gray-600 hover:text-purple-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-purple-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-13.99 0-.21 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-purple-600">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm1-13h2v6h-2zm-2 0h2v6h-2z" />
                </svg>
              </button>
                <button className="text-gray-600 hover:text-purple-600">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm1-13h2v6h-2zm-2 0h2v6h-2z" />
                    </svg>
                </button>
            </div>
            </div>
        </div>
        </footer>
    </div>
    );
}

export default LandingPage;