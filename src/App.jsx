// src/App.jsx

import React, { useState, useEffect } from "react";
import HabitTracker from "./HabitTracker";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [route, setRoute] = useState(user ? "/" : "/login");

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setRoute("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setRoute("/login");
  };

  const navigate = (path) => {
    setRoute(path);
  };

  if (!user) {
    if (route === "/register") {
      return (
        <RegisterPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToLogin={() => navigate("/login")}
        />
      );
    }
    return (
      <LoginPage
        onLoginSuccess={handleLoginSuccess}
        onNavigateToRegister={() => navigate("/register")}
      />
    );
  }

  return <HabitTracker user={user} onLogout={handleLogout} />;
}
