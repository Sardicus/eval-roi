import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from '../hooks/useAuth.js';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isLoggedIn } = useAuth();

  const canAccess = (allowedRoles) => {
    return isLoggedIn && allowedRoles.includes(user?.userType);
  };

  const navLink = (path, label) => (
    <button
      onClick={() => navigate(path)}
      className={`text-sm font-medium transition-colors relative pb-0.5 ${location.pathname === path
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
        {navLink("/listings", "İlanlar")}

        {canAccess(["OWNER", "ADMIN"]) && navLink("/add-listing", "İlan Ekle")}

        {navLink("/fraud-check", "Analiz & Denetim")}

        {navLink("/profiles", "Profiller")}
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="px-4 py-2 bg-[#1a2540] border border-[#2a3a5c] text-[#8a9ab5] hover:text-white hover:border-amber-400/40 rounded-xl text-sm font-medium transition-all"
          >
            Çıkış Yap
          </button>
        ) : (
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-amber-400 text-[#060e1a] rounded-xl text-sm font-bold hover:bg-amber-300 transition-all"
          >
            Giriş Yap
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;