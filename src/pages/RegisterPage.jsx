// src/pages/RegisterPage.jsx

import React, { useState, useEffect } from "react";

export default function RegisterPage({ onLoginSuccess, onNavigateToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [timezone, setTimezone] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Corrected: Use import.meta.env for Vite projects
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
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white">
          Create a New Account
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <div>
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-300"
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
              className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-slate-300"
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
              className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-300"
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
              className="w-full px-3 py-2 mt-1 text-white bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <p className="text-sm text-slate-400">
            Your timezone will be set to: <strong>{timezone}</strong>
          </p>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
        <p className="text-center text-slate-400">
          Already have an account?{" "}
          <button
            onClick={onNavigateToLogin}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Login here
          </button>
        </p>
      </div>
    </div>
  );
}
