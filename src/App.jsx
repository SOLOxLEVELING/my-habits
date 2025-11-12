// src/App.jsx

import React, { useState, useEffect } from "react";
import HabitTracker from "./HabitTracker";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle } from "lucide-react";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [route, setRoute] = useState("/login");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setRoute("/");
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

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

  const navigate = (path) => setRoute(path);

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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={route}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {!user ? (
          route === "/register" ? (
            <RegisterPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToLogin={() => navigate("/login")}
            />
          ) : (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => navigate("/register")}
            />
          )
        ) : (
          <HabitTracker user={user} onLogout={handleLogout} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}
