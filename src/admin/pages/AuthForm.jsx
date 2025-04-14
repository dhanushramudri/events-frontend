import { useState } from "react";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
const AuthForm = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {showLogin ? (
        <Login onSwitch={() => setShowLogin(false)} />
      ) : (
        <SignUp onSwitch={() => setShowLogin(true)} />
      )}
    </div>
  );
};

export default AuthForm;
