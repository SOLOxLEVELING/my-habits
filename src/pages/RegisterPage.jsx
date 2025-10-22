// src/pages/RegisterPage.jsx

import React, { useState, useEffect } from "react";
import { Goal } from "lucide-react"; // Added an icon for branding

export default function RegisterPage({ onLoginSuccess, onNavigateToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [timezone, setTimezone] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5001";

  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, timezone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register.");
      }

      onLoginSuccess(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-800 rounded-xl shadow-2xl border border-slate-700">
        <div className="flex flex-col items-center">
          <div className="p-3 bg-blue-600/20 rounded-full mb-4">
            <Goal className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-center text-white">
            Create Your Account
          </h2>
          <p className="text-center text-slate-400 text-sm mt-1">
            Start tracking your habits today.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <p className="text-red-300 text-center text-sm p-3 bg-red-900/50 border border-red-700 rounded-lg">
              {error}
            </p>
          )}
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-400"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-2 text-white bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
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
              className="w-full px-3 py-2 mt-2 text-white bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
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
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-2 text-white bg-slate-900 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="text-sm text-slate-500 p-3 bg-slate-900/50 rounded-md border border-slate-700">
            Your timezone will be automatically set to:{" "}
            <strong className="text-slate-300">{timezone}</strong>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2.5 mt-2 font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-slate-400">
          Already have an account?{" "}
          <button
            onClick={onNavigateToLogin}
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
