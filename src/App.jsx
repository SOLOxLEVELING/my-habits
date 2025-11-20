// src/App.jsx

import React, { useState, useEffect } from "react";
import HabitTracker from "./HabitTracker";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import LandingPage from "./pages/LandingPage";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // FIX 1: Initialize route based on the actual browser URL
  // This fixes the "Reload" issue.
  const [route, setRoute] = useState(window.location.pathname);

  useEffect(() => {
    // FIX 2: Listen for the Browser "Back" button
    const onPopState = () => {
      setRoute(window.location.pathname);
    };

    window.addEventListener("popstate", onPopState);

    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // FIX 3: Update the Browser URL when navigating
  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setRoute(path);
  };

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    // FIX 4: Use replaceState for Login
    // This overwrites the history so hitting "Back" doesn't take you 
    // back to the Login page (which would cause a loop).
    window.history.replaceState({}, "", "/");
    setRoute("/");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); 
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-950">
        <LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Helper to determine what component to show
  const getComponent = () => {
    // If user is logged in, ALWAYS show Tracker (unless you want a specific profile route)
    if (user) {
      return <HabitTracker user={user} onLogout={handleLogout} />;
    }

    // If not logged in, route based on path
    switch (route) {
      case "/login":
        return (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToRegister={() => navigate("/register")}
          />
        );
      case "/register":
        return (
          <RegisterPage
            onLoginSuccess={handleLoginSuccess}
            onNavigateToLogin={() => navigate("/login")}
          />
        );
      default:
        return (
          <LandingPage
            onNavigateToLogin={() => navigate("/login")}
            onNavigateToRegister={() => navigate("/register")}
          />
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={user ? "dashboard" : route} // Key change ensures animation triggers correctly
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {getComponent()}
      </motion.div>
    </AnimatePresence>
  );
}