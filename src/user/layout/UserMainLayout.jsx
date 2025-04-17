import React, { useState } from "react";
import { NavLink, useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { LogOut, Calendar, ClipboardList, Settings, User, Menu } from "lucide-react"; // Import Menu icon
import { useAuth } from "../../admin/contexts/AuthContext";
import { Button } from "../components/ui/button";

const navItems = [
  {
    label: "Events",
    path: "/events",
    icon: <Calendar className="h-4 w-4 mr-2" />,
  },
  {
    label: "Registered",
    path: "/registeredEvents",
    icon: <ClipboardList className="h-4 w-4 mr-2" />,
  },
  {
    label: "Favorites",
    path: "/favorites",
    icon: <Settings className="h-4 w-4 mr-2" />,
  },
  {
    label: "Contact Admin",
    path: "/contact-admin",
    icon: <User className="h-4 w-4 mr-2" />,
  },
];

const UserMainLayout = () => {
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for mobile menu

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold tracking-tight flex items-center text-[#19105b]">
              <span className="text-purple-600">J</span>
              <span className="ml-1">Bytes</span>
            </Link>

            {/* Hamburger Menu for Mobile */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* Navigation Links */}
            <nav className={`md:flex space-x-6 ${isMenuOpen ? "block" : "hidden"} md:block`}>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-all ${isActive || (item.path === "/events" && location.pathname === "/")
                      ? "bg-[#19105b] text-white shadow"
                      : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)} // Close menu on link click
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              ))}
            </nav>

            {/* Profile & Logout */}
            <div className="flex items-center gap-3">
              {loading ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
              ) : (
                <Link to="/profile">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-xs font-bold uppercase text-purple-600">
                    {currentUser?.name?.charAt(0) || "A"}
                  </div>
                </Link>
              )}

              <Button
                onClick={handleLogout}
                variant="ghost"
                className="flex items-center px-3 py-2 border-2 border-[#19105b] text-[#19105b] hover:bg-[#19105b] hover:text-white transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4 mr-2 " />
                <span className="text-sm">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default UserMainLayout;