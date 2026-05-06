import React, { useState } from "react";
import { LoginScreen } from "./components/auth/LoginScreen.jsx";
import { RegisterScreen } from "./components/auth/RegisterScreen.jsx";
import Dashboard from "./pages/Dashboard.jsx";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("crm_access") || "");
  const [showRegister, setShowRegister] = useState(false);

  function logout() {
    localStorage.removeItem("crm_access");
    localStorage.removeItem("crm_refresh");
    setToken("");
    setShowRegister(false);
  }

  if (!token) {
    return showRegister ?
      <RegisterScreen onLogin={setToken} onShowLogin={() => setShowRegister(false)} /> :
      <LoginScreen onLogin={setToken} onShowRegister={() => setShowRegister(true)} />;
  }

  return <Dashboard token={token} onLogout={logout} />;
}
