import React, { useState, useEffect } from "react";
import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  Calendar,
  BarChart2,
  Users,
  LogOut,
  Bell,
  Settings,
  Search,
  ChevronLeft,
  ChevronRight,
  User,
  Heart,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { currentUser, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setMobileSidebar(false);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      path: "/",
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Events",
      path: "/events",
    },
    // {
    //   icon: <BarChart2 className="h-5 w-5" />,
    //   label: "Analytics",
    //   path: "/analytics",
    // },
    { icon: <Users className="h-5 w-5" />, label: "Users", path: "/users" },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "Favorites",
      path: "/favorites",
    },
    {
      icon: <User className="h-5 w-5" />,
      label: "Client Queries",
      path: "/client-queries",
    },
  ];

  const NavItem = ({ icon, label, path, function: onClick }) =>
    path ? (
      <NavLink
        to={path}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-[#ff6196] ${
            isActive
              ? "bg-[#19105b] text-white font-semibold"
              : "hover:bg-[#A9A1ED] hover:text-white text-gray-700"
          }`
        }
        onClick={() => setMobileSidebar(false)}
      >
        {icon}
        {sidebarOpen && <span>{label}</span>}
      </NavLink>
    ) : (
      <Button
        variant="primary"
        onClick={onClick}
        // className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100"
      >
        {icon}
        {sidebarOpen && <span>{label}</span>}
      </Button>
    );

  const Logo = () => (
    <div className="text-2xl font-extrabold tracking-tight flex items-center">
      <span className="text-[#ff6196]">J</span>
      {sidebarOpen && <span className="text-gray-900 ml-1">Bytes</span>}
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${
          mobileSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileSidebar(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:static flex flex-col
        ${
          mobileSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } 
        ${sidebarOpen ? "w-64" : "w-20"}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <Logo />
          <button
            className="p-1 rounded-md lg:hidden"
            onClick={() => setMobileSidebar(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between ">
          {/* Navigation with Collapse Button after first item */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {/* First navigation item */}
            <NavItem {...navItems[0]} />

            {/* Collapse/Expand Button - Moved here */}
            <div className="absolute top-16 right-[-30px] mt-4 mr-4">
              <Button
                variant="white"
                size={sidebarOpen ? "icon" : "md"} // Use "icon" for small size when sidebar is open, "md" otherwise
                className={`bg-purple-50 py-3 px-3 border-t border-l border-b border-blue-600 text-blue-800 hover:bg-blue-200 shadow-[inset_-1px_1px_1px_rgba(0,0,0,0.1)] p-2 border-none rounded-md`} // Set padding to 0
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? (
                  <ChevronLeft className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </div>
            {/* Remaining navigation items */}
            {navItems.slice(1).map((item, index) => (
              <NavItem key={item.path || index} {...item} />
            ))}
          </nav>

          {/* User Info and Logout */}
          <div className="p-4 border-t space-y-4">
            {!loading ? (
              currentUser && (
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-md">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-purple-100 text-sm font-bold uppercase text-purple-600">
                    {currentUser.name?.charAt(0) || "A"}
                  </div>
                  {sidebarOpen && (
                    <div className="flex-1">
                      <p className="font-medium text-sm truncate">
                        {currentUser.name || "Admin User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            )}

            {sidebarOpen ? (
              <Button
                variant="tab"
                className="w-full flex items-center justify-center"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            ) : (
              <button
                className="flex items-center justify-center w-full p-2 rounded-lg hover:bg-gray-100"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="h-16 flex items-center justify-between px-4">
            <div className="flex items-center">
              <button
                className="p-1 rounded-md lg:hidden"
                onClick={() => setMobileSidebar(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search */}

              {/* Notifications */}
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* Avatar */}
              <div>
                <Link to="/profile" className="flex items-center">
                  <button className="flex items-center p-2 rounded-full hover:bg-gray-100">
                    <div className="w-7 h-7 flex items-center justify-center rounded-full bg-purple-100 text-xs font-bold uppercase text-purple-600">
                      {currentUser?.name?.charAt(0) || "A"}
                    </div>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
