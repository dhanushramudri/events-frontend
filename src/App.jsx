import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AppAdmin from "./admin/AppAdmin";
import AppUser from "./user/AppUser";
import AuthForm from "./admin/pages/AuthForm";

const App = () => {
  const role = localStorage.getItem("role");
  console.log("role is ", role);

  return (
    <Routes>
      <Route path="/login" element={<AuthForm />} />
      {role === "admin" ? (
        <Route path="/*" element={<AppAdmin />} />
      ) : role === "user" ? (
        <Route path="/*" element={<AppUser />} />
      ) : (
        <Route path="*" element={<Navigate to="/login" replace />} />
      )}
    </Routes>
  );
};

export default App;
