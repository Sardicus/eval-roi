import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const navLink = (path, label) => (
    <button
      onClick={() => navigate(path)}
      className={`text-sm font-medium transition-colors relative pb-0.5 ${
        location.pathname === path
          ? "text-amber-400"
          : "text-[#8a9ab5] hover:text-white"
      }`}
    >
      {label}
      {location.pathname === path && (
        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-400 rounded-full" />
      )}
    </button>
  );

  return (
    <nav className="bg-[#0a1628] border-b border-[#1e3a6e] px-8 py-4 flex items-center justify-between">
      <h1
        className="text-xl font-bold text-white cursor-pointer tracking-tight"
        onClick={() => navigate("/listings")}
      >
        Eval<span className="text-amber-400">ROI</span>
      </h1>

      <div className="flex items-center gap-8">
        {navLink("/listings", "Listings")}
        {navLink("/add-listing", "Add Listing")}
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-[#1a2540] border border-[#2a3a5c] text-[#8a9ab5] hover:text-white hover:border-amber-400/40 rounded-xl text-sm font-medium transition-all"
      >
        Logout
      </button>
    </nav>
  );
}

export default Navbar;