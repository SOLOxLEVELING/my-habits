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
  const [route, setRoute] = useState("/");

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        // Keep them on the current route if it's not auth-related, 
        // but for this simple app, we usually just show the tracker if logged in.
      } else {
        // If no user, we might be at /, /login, or /register. 
        // Default to / if not set (which it is by default state).
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
    setRoute("/");
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
          route === "/login" ? (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToRegister={() => navigate("/register")}
            />
          ) : route === "/register" ? (
            <RegisterPage
              onLoginSuccess={handleLoginSuccess}
              onNavigateToLogin={() => navigate("/login")}
            />
          ) : (
            <LandingPage 
              onNavigateToLogin={() => navigate("/login")}
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
