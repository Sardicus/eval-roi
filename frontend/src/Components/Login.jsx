import React, { useState } from "react";

function LoginForm() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Register form state
  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Login form state
  const [loginData, setLoginData] = useState({
    loginWith: "0", // "0" = username, "1" = email
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      if (response.ok) {
        setMessage("Registration successful! You can now login.");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.accessToken);
        setMessage("Login successful! Token saved.");
      } else {
        const data = await response.json();
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  return (
    <div className="w-[430px] bg-white p-8 rounded-2xl shadow-lg">
      {/* Header Titles */}
      <div className="flex justify-center mb-4">
        <h2 className="text-3xl font-semibold text-center">
          {isLoginMode ? "Login" : "Sign Up"}
        </h2>
      </div>

      {/* Tab Controls */}
      <div className="relative flex h-12 mb-6 border border-gray-300 rounded-full overflow-hidden">
        <button
          className={`w-1/2 text-lg font-medium transition-all z-10 ${isLoginMode ? "text-white" : "text-black"}`}
          onClick={() => { setIsLoginMode(true); setMessage(""); setError(""); }}
        >
          Login
        </button>
        <button
          className={`w-1/2 text-lg font-medium transition-all z-10 ${!isLoginMode ? "text-white" : "text-black"}`}
          onClick={() => { setIsLoginMode(false); setMessage(""); setError(""); }}
        >
          Signup
        </button>
        <div
          className={`absolute top-0 h-full w-1/2 rounded-full bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 transition-all ${isLoginMode ? "left-0" : "left-1/2"}`}
        ></div>
      </div>

      {/* Success / Error Messages */}
      {message && <p className="text-green-600 text-center mb-4">{message}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {/* Login Form */}
      {isLoginMode && (
        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Toggle username/email */}
          <div className="flex gap-4 mb-2">
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="loginWith" checked={loginData.loginWith === "0"}
                onChange={() => setLoginData({ ...loginData, loginWith: "0", email: "" })} />
              Username
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <input type="radio" name="loginWith" checked={loginData.loginWith === "1"}
                onChange={() => setLoginData({ ...loginData, loginWith: "1", username: "" })} />
              Email
            </label>
          </div>

          {loginData.loginWith === "0" ? (
            <input type="text" placeholder="Username" required
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} />
          ) : (
            <input type="email" placeholder="Email Address" required
              className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
          )}

          <input type="password" placeholder="Password" required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />

          <div className="text-right">
            <a href="#" className="text-cyan-600 hover:underline">Forgot password?</a>
          </div>

          <button type="submit" className="w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition">
            Login
          </button>

          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginMode(false); }} className="text-cyan-600 hover:underline">
              Signup now
            </a>
          </p>
        </form>
      )}

      {/* Register Form */}
      {!isLoginMode && (
        <form className="space-y-4" onSubmit={handleRegister}>
          <input type="text" placeholder="Username" required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} />

          <input type="email" placeholder="Email Address" required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
            value={registerData.email}
            onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />

          <input type="password" placeholder="Password" required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />

          <input type="password" placeholder="Confirm Password" required
            className="w-full p-3 border-b-2 border-gray-300 outline-none focus:border-cyan-500 placeholder-gray-400"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} />

          <button type="submit" className="w-full p-3 bg-gradient-to-r from-blue-700 via-cyan-600 to-cyan-200 text-white rounded-full text-lg font-medium hover:opacity-90 transition">
            Sign Up
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginMode(true); }} className="text-cyan-600 hover:underline">
              Login
            </a>
          </p>
        </form>
      )}
    </div>
  );
}

export default LoginForm;