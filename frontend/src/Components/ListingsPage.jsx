import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEnums } from "../hooks/useEnums";
import ListingFilter from "./ListingFilter";

function ListingsPage() {
  const [listingsPage, setListingsPage] = useState({ content: [] });
  const [error, setError] = useState("");
  const { propertyTypes } = useEnums();
  const [filters, setFilters] = useState({
    title: "",
    city: "",
    propertyType: "",
    status: "",
    minPrice: "",
    maxPrice: ""
  });
  const [page, setPage] = useState(0);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();

  const fetchListings = async (pageNumber = 0) => {
    try {
      const token = localStorage.getItem("token");
      const queryObj = { page: pageNumber, size: 10 };

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null) {
          let parsedValue;

          if (key === "minPrice" || key === "maxPrice") {
            parsedValue = String(value).replace(/\./g, "");
          } else if (key === "status" && value === "undefined") {
            // Don't send invalid enum
            return;
          } else if (key === "propertyType" && Array.isArray(value)) {
            // Join multiple property types if multi-select
            parsedValue = value.length ? value.join(",") : null;
            if (!parsedValue) return; // skip empty array
          } else {
            parsedValue = value;
          }

          queryObj[key] = parsedValue;
        }
      });

      const query = new URLSearchParams(queryObj).toString();

      const response = await fetch(`http://localhost:8080/listing/getAllListings?${query}`, {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setListingsPage(data);
        setPage(pageNumber);
      } else {
        setError("Failed to load listings.");
      }
    } catch (err) {
      console.error(err);
      setError("Could not connect to server.");
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this listing?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/listing/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setListingsPage((prev) => ({
          ...prev,
          content: prev.content.filter((l) => l.id !== id),
        }));
      } else {
        setError("Failed to delete listing.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  const handleStatusChange = async (e, id, newStatus) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:8080/listing/updateListingStatus/${id}?status=${newStatus}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.ok) {
        setListingsPage((prev) => ({
          ...prev,
          content: prev.content.map((l) => (l.id === id ? { ...l, status: newStatus } : l)),
        }));
      } else {
        setError("Failed to update status.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  const verdictColor = (verdict) => {
    if (verdict === "Excellent") return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
    if (verdict === "Good") return "text-cyan-400 bg-cyan-400/10 border-cyan-400/20";
    if (verdict === "Fair") return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    return "text-red-400 bg-red-400/10 border-red-400/20";
  };

  const barColor = (ratio) => {
    if (ratio >= 0.8) return "bg-emerald-400";
    if (ratio >= 0.6) return "bg-cyan-400";
    if (ratio >= 0.4) return "bg-amber-400";
    return "bg-red-400";
  };

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Listings</h1>
          <p className="text-[#64748b] text-sm mt-1">{listingsPage.totalElements || 0} properties found</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilter(prev => !prev)}
            className="px-4 py-2 bg-[#1e293b] text-white rounded-lg border border-[#334155]"
          >
            Filters
          </button>
          <button
            onClick={() => navigate("/add-listing")}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition-colors text-sm"
          >
            + Add Listing
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilter && (
        <ListingFilter
          filters={filters}
          setFilters={setFilters}
          onApply={() => fetchListings(0)}
        />
      )}

      {error && (
        <p className="text-red-400 mb-6 bg-red-400/10 rounded-xl px-4 py-3 text-sm">{error}</p>
      )}

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {listingsPage.content.map((listing) => (
          <div
            key={listing.id}
            onClick={() => navigate(`/listing/${listing.id}`)}
            className="bg-[#1e293b] border border-[#334155] rounded-2xl overflow-hidden cursor-pointer hover:border-amber-400/40 transition-all hover:shadow-lg hover:shadow-amber-400/5 group"
          >
            {/* Image */}
            <div className="relative h-48 bg-[#0f172a] flex items-center justify-center overflow-hidden">
              {listing.primaryImageUrl ? (
                <>
                  <img
                    src={`http://localhost:8080${listing.primaryImageUrl}`}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b] via-transparent to-transparent opacity-60" />
                </>
              ) : (
                <span className="text-[#334155] text-sm">No Image</span>
              )}
              <span
                className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full border backdrop-blur-sm ${listing.status === "ACTIVE"
                  ? "bg-emerald-900/80 text-emerald-400 border-emerald-400/20"
                  : listing.status === "SOLD"
                    ? "bg-gray-900/80 text-gray-400 border-gray-400/20"
                    : "bg-amber-900/80 text-amber-400 border-amber-400/20"
                  }`}
              >
                {listing.status}
              </span>
            </div>

            {/* Content */}
            <div className="p-5">
              <h2 className="text-white font-semibold text-lg mb-1 truncate">{listing.title}</h2>
              <p className="text-[#94a3b8] text-sm mb-1">{listing.address.district}, {listing.address.city}</p>
              <p className="text-[#94a3b8] text-sm mb-3">
                {propertyTypes[listing.propertyType] || listing.propertyType} · {listing.sizeM2}m²{" "}
                {listing.bedroomCount ? `· ${listing.bedroomCount} bd` : ""}
              </p>
              <p className="text-amber-400 font-bold text-xl mb-4">
                ₺{listing.price.toLocaleString()}
              </p>

              {/* Evaluation */}
              {listing.simpleEvaluationSummary && (
                <div className="pt-4 border-t border-[#334155]">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold uppercase tracking-widest text-[#64748b]">
                      Eval Score
                    </span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full border ${verdictColor(
                          listing.simpleEvaluationSummary.verdict
                        )}`}
                      >
                        {listing.simpleEvaluationSummary.verdict}
                      </span>
                      <span className="text-sm font-bold text-white">
                        {listing.simpleEvaluationSummary.totalScore}/
                        {listing.simpleEvaluationSummary.maxTotalScore}
                      </span>
                    </div>
                  </div>
                  {listing.simpleEvaluationSummary.categoryScores.map((cat) => (
                    <div key={cat.categoryName} className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#94a3b8]">{cat.categoryName}</span>
                        <span className="text-white font-medium">
                          {cat.score}/{cat.maxScore}
                        </span>
                      </div>
                      <div className="h-1.5 bg-[#334155] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${barColor(
                            cat.score / cat.maxScore
                          )}`}
                          style={{ width: `${(cat.score / cat.maxScore) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#334155]">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit-listing/${listing.id}`);
                  }}
                  className="px-3 py-1.5 bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:text-white hover:border-amber-400/40 rounded-lg text-xs font-medium transition-all"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => handleStatusChange(e, listing.id, listing.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${listing.status === "ACTIVE"
                    ? "bg-amber-400/10 border-amber-400/20 text-amber-400 hover:bg-amber-400/20"
                    : "bg-emerald-400/10 border-emerald-400/20 text-emerald-400 hover:bg-emerald-400/20"
                    }`}
                >
                  {listing.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
                {listing.status !== "SOLD" && (
                  <button
                    onClick={(e) => handleStatusChange(e, listing.id, "SOLD")}
                    className="px-3 py-1.5 bg-[#0f172a] border border-[#334155] text-[#94a3b8] hover:text-white rounded-lg text-xs font-medium transition-all"
                  >
                    Mark Sold
                  </button>
                )}
                <button
                  onClick={(e) => handleDelete(e, listing.id)}
                  className="px-3 py-1.5 bg-red-400/10 border border-red-400/20 text-red-400 hover:bg-red-400/20 rounded-lg text-xs font-medium transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {listingsPage.totalPages > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {Array.from({ length: listingsPage.totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => fetchListings(i)}
              className="px-3 py-1.5 bg-[#1e293b] text-white rounded-lg border border-[#334155] hover:border-amber-400/40"
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListingsPage;