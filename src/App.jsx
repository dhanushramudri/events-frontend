import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppAdmin from "./admin/AppAdmin";
import AppUser from "./user/AppUser";
import AuthForm from "./admin/pages/AuthForm";
import { AuthProvider, useAuth } from "./admin/contexts/AuthContext"; // Import useAuth if needed
import LandingPage from "./admin/pages/LandingPage";

const App = () => {
  const role = localStorage.getItem("role");
  console.log("User role is", role);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<AuthForm />} />
        {role === "admin" ? (
          <Route path="/*" element={<AppAdmin />} />
        ) : role === "user" ? (
          <Route path="/*" element={<AppUser />} />
        ) : (
          <Route path="/*" element={<Navigate to="/landing" replace />} />
        )}
      </Routes>
    </AuthProvider>
  );
};

export default App;