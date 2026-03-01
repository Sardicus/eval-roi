import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="bg-white shadow px-8 py-4 flex items-center justify-between">
      <h1 className="text-xl font-bold text-cyan-600 cursor-pointer" onClick={() => navigate("/listings")}>
        EvalROI
      </h1>

      <div className="flex items-center gap-6">
        <button
          onClick={() => navigate("/listings")}
          className={`text-sm font-medium ${location.pathname === "/listings" ? "text-cyan-600" : "text-gray-600 hover:text-cyan-600"}`}
        >
          Listings
        </button>
        <button
          onClick={() => navigate("/add-listing")}
          className={`text-sm font-medium ${location.pathname === "/add-listing" ? "text-cyan-600" : "text-gray-600 hover:text-cyan-600"}`}
        >
          Add Listing
        </button>
        <button onClick={handleLogout} className="px-4 py-2 bg-cyan-500 text-white rounded-full text-sm hover:opacity-90">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;