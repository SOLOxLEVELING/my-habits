// src/pages/LoginPage.jsx

import React, { useState } from "react";
import { Goal, LoaderCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage({ onLoginSuccess, onNavigateToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to log in.");
      } else {
        onLoginSuccess(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm p-8 space-y-6 bg-slate-900 rounded-2xl shadow-2xl border border-slate-800"
      >
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-blue-600/20 rounded-full mb-4">
            <Goal className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
          <p className="text-slate-400 text-sm mt-1">
            Sign in to continue your progress.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-300 text-center text-sm p-3 bg-red-900/50 border border-red-700 rounded-lg">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-400"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-white bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-400"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 text-white bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-4 py-2.5 mt-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 disabled:opacity-60 transition-colors"
            >
              {isLoading ? (
                <LoaderCircle className="w-5 h-5 animate-spin" />
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <button
            onClick={onNavigateToRegister}
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Register here
          </button>
        </p>
      </motion.div>
    </div>
  );
}
