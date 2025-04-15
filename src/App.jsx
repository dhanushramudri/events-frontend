import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppAdmin from "./admin/AppAdmin";
import AppUser from "./user/AppUser";
import AuthForm from "./admin/pages/AuthForm";
import { AuthProvider, useAuth } from "./admin/contexts/AuthContext";
import LandingPage from "./admin/pages/LandingPage";

const App = () => {
  const role = localStorage.getItem("role");
  // const { isAuthenticated, loading } = useAuth();
  // console.log("isAuthenticated is ", isAuthenticated);
  setTimeout(() => {
    const role = localStorage.getItem("role");

    console.log("role is ", role);
  }, 5000);
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<AuthForm />} />
        <Route path="/landing" element={<LandingPage />} />
        {role === "admin" ? (
          <Route path="/*" element={<AppAdmin />} />
        ) : role === "user" ? (
          <Route path="/*" element={<AppUser />} />
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </AuthProvider>
  );
};

export default App;
