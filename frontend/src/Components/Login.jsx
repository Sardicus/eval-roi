import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'

function LoginForm() {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [registerData, setRegisterData] = useState({
    email: "", username: "", password: "", confirmPassword: "", role: "USER",
  });

  const [loginData, setLoginData] = useState({
    loginWith: "0", username: "", email: "", password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
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
    setMessage(""); setError("");
    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.accessToken);
        navigate("/listings");
      } else {
        const data = await response.json();
        setError(data.message || "Login failed.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-lg bg-[#1a2540] border border-[#2a3a5c] text-white placeholder-[#4a5a7c] outline-none focus:border-amber-400 transition-colors`;
  const radioClass = `w-4 h-4 accent-amber-400 cursor-pointer`;

  const features = [
    { icon: "🏛️", title: "Building Safety Score", desc: "Earthquake risk, build year, structural analysis" },
    { icon: "📊", title: "Price Intelligence", desc: "Compare against district & city averages" },
    { icon: "🌡️", title: "Climate Comfort", desc: "Heating efficiency scored by location" },
    { icon: "📍", title: "Location Analysis", desc: "District risk zones and amenity scoring" },
  ];

  return (
    <div className="min-h-screen bg-[#060e1a] flex">

      {/* Left Side */}
      <div className="hidden lg:flex flex-col justify-between w-[60%] p-16 relative overflow-hidden">

        {/* Background effects */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-amber-400 opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-600 opacity-5 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl pointer-events-none" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Logo */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Eval<span className="text-amber-400">ROI</span>
          </h1>
          <p className="text-[#4a5a7c] text-xs mt-1 tracking-widest uppercase">Property Intelligence Platform</p>
        </div>

        {/* Hero text */}
        <div>
          <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">Smart Property Evaluation</p>
          <h2 className="text-5xl font-bold text-white leading-tight mb-6">
            Know the True<br />
            Value of Every<br />
            <span className="text-amber-400">Property.</span>
          </h2>
          <p className="text-[#8a9ab5] text-lg leading-relaxed max-w-md">
            AI-powered analysis across safety, price, location and comfort metrics — so you never overpay or overlook a risk.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-2 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-[#0f1f38] border border-[#1e3a6e] rounded-xl p-4">
              <span className="text-2xl mb-2 block">{f.icon}</span>
              <p className="text-white text-sm font-semibold mb-1">{f.title}</p>
              <p className="text-[#4a5a7c] text-xs">{f.desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Right Side - Auth Card */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-[#0a1628] border-l border-[#1e3a6e]" />

        <div className="relative w-full max-w-md">

          {/* Mobile logo */}
          <div className="text-center mb-8 lg:hidden">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Eval<span className="text-amber-400">ROI</span>
            </h1>
            <p className="text-[#4a5a7c] text-sm mt-1 tracking-widest uppercase">Property Intelligence</p>
          </div>

          <div className="bg-[#0f1f38] border border-[#1e3a6e] rounded-2xl p-8 shadow-2xl">

            <h3 className="text-white text-xl font-bold mb-1">
              {isLoginMode ? "Welcome back" : "Create account"}
            </h3>
            <p className="text-[#4a5a7c] text-sm mb-6">
              {isLoginMode ? "Sign in to your account" : "Start evaluating properties"}
            </p>

            {/* Tab Controls */}
            <div className="relative flex h-11 mb-6 bg-[#0a1628] rounded-xl overflow-hidden border border-[#1e3a6e]">
              <button
                className={`w-1/2 text-sm font-semibold transition-all z-10 ${isLoginMode ? "text-[#060e1a]" : "text-[#4a5a7c] hover:text-white"}`}
                onClick={() => { setIsLoginMode(true); setMessage(""); setError(""); }}
              >
                Login
              </button>
              <button
                className={`w-1/2 text-sm font-semibold transition-all z-10 ${!isLoginMode ? "text-[#060e1a]" : "text-[#4a5a7c] hover:text-white"}`}
                onClick={() => { setIsLoginMode(false); setMessage(""); setError(""); }}
              >
                Sign Up
              </button>
              <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-lg bg-amber-400 transition-all duration-300 ${isLoginMode ? "left-1" : "left-[calc(50%+3px)]"}`} />
            </div>

            {/* Messages */}
            {message && <p className="text-emerald-400 text-sm text-center mb-4 bg-emerald-400/10 rounded-lg py-2">{message}</p>}
            {error && <p className="text-red-400 text-sm text-center mb-4 bg-red-400/10 rounded-lg py-2">{error}</p>}

            {/* Login Form */}
            {isLoginMode && (
              <form className="space-y-4" onSubmit={handleLogin}>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-[#8a9ab5] text-sm">
                    <input type="radio" className={radioClass} name="loginWith" checked={loginData.loginWith === "0"}
                      onChange={() => setLoginData({ ...loginData, loginWith: "0", email: "" })} />
                    Username
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#8a9ab5] text-sm">
                    <input type="radio" className={radioClass} name="loginWith" checked={loginData.loginWith === "1"}
                      onChange={() => setLoginData({ ...loginData, loginWith: "1", username: "" })} />
                    Email
                  </label>
                </div>

                {loginData.loginWith === "0" ? (
                  <input type="text" placeholder="Username" required className={inputClass}
                    value={loginData.username}
                    onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} />
                ) : (
                  <input type="email" placeholder="Email Address" required className={inputClass}
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
                )}

                <input type="password" placeholder="Password" required className={inputClass}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />

                <div className="text-right">
                  <a href="#" className="text-amber-400 text-sm hover:text-amber-300 transition-colors">Forgot password?</a>
                </div>

                <button type="submit" className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-[#060e1a] font-bold rounded-xl transition-colors text-sm tracking-wide">
                  Login
                </button>

                <p className="text-center text-[#4a5a7c] text-sm">
                  Don't have an account?{" "}
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginMode(false); }} className="text-amber-400 hover:text-amber-300 transition-colors">
                    Sign up
                  </a>
                </p>
              </form>
            )}

            {/* Register Form */}
            {!isLoginMode && (
              <form className="space-y-4" onSubmit={handleRegister}>
                <input type="text" placeholder="Username" required className={inputClass}
                  value={registerData.username}
                  onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })} />

                <input type="email" placeholder="Email Address" required className={inputClass}
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />

                <input type="password" placeholder="Password" required className={inputClass}
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />

                <input type="password" placeholder="Confirm Password" required className={inputClass}
                  value={registerData.confirmPassword}
                  onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })} />

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer text-[#8a9ab5] text-sm">
                    <input type="radio" className={radioClass} name="role" checked={registerData.role === "USER"}
                      onChange={() => setRegisterData({ ...registerData, role: "USER" })} />
                    User
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-[#8a9ab5] text-sm">
                    <input type="radio" className={radioClass} name="role" checked={registerData.role === "OWNER"}
                      onChange={() => setRegisterData({ ...registerData, role: "OWNER" })} />
                    Property Owner
                  </label>
                </div>

                <button type="submit" className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-[#060e1a] font-bold rounded-xl transition-colors text-sm tracking-wide">
                  Create Account
                </button>

                <p className="text-center text-[#4a5a7c] text-sm">
                  Already have an account?{" "}
                  <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginMode(true); }} className="text-amber-400 hover:text-amber-300 transition-colors">
                    Login
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;