import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import EventDetails from "./components/EventDetails";
import Analytics from "./components/Analytics";
import CreateEvent from "./pages/CreateEvent";
import Participants from "./pages/Participants";
import Users from "./pages/Users";
import AuthForm from "./pages/AuthForm";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Favorites from "./pages/Favorites";
import AppUser from "../user/AppUser";
import UserMainLayout from "../user/UserMainLayout";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

// Public route component (handles login route redirection for authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  // console.log("current user is", currentUser);

  const role = localStorage.getItem("role");

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Check if the user is authenticated or has a role (admin/user)
  if (isAuthenticated || role === "admin" || role === "user") {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const role = localStorage.getItem("role"); // Check the role from localStorage

  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthForm />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              {role === "admin" ? (
                <MainLayout /> // Admin route - full access
              ) : (
                <UserMainLayout /> // User route - restricted access
              )}
            </ProtectedRoute>
          }
        >
          {/* Admin Routes (if role is admin) */}
          {role === "admin" && (
            <>
              <Route index element={<Dashboard />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:eventId" element={<EventDetails />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="users" element={<Users />} />
              <Route path="events/new" element={<CreateEvent />} />
              <Route path="favorites" element={<Favorites />} />
              <Route
                path="events/:eventId/participants"
                element={<Participants />}
              />
            </>
          )}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
