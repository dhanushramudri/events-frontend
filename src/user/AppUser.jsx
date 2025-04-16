import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import AuthForm from "../admin/pages/AuthForm";
import { AuthProvider, useAuth } from "../admin/contexts/AuthContext";
import Favorites from "../admin/pages/Favorites";
import UserMainLayout from "./layout/UserMainLayout";

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

function AppAdmin() {
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
              {role === "user"}
                <UserMainLayout /> 
            </ProtectedRoute>
          }
        >
          {/* Admin Routes (if role is admin) */}
          {role === "user" && (
            <>
              <Route path="/" element={<Events />} />
              <Route path="events/:eventId" element={<EventDetails />} />
              <Route path="favorites" element={<Favorites />} />
            </>
          )}
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default AppAdmin;