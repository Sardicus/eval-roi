import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEnums } from "../hooks/useEnums.js";
import AIAnalysisCard from "./AIAnalysisCard";

function ListingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing]   = useState(null);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(true);
  const [profiles, setProfiles] = useState([]);
  const { propertyTypes, heatingTypes, listingStatuses } = useEnums();

  const token   = localStorage.getItem("token");
  const headers = { "Authorization": `Bearer ${token}` };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`http://localhost:8080/listing/get/${id}`, { headers });
        if (response.ok) setListing(await response.json());
        else setError("Failed to load listing.");
      } catch { setError("Could not connect to server."); }
      finally { setLoading(false); }
    };

    const fetchProfiles = async () => {
      try {
        const response = await fetch("http://localhost:8080/buyer-profile/getAll", { headers });
        if (response.ok) setProfiles(await response.json());
      } catch { console.error("Failed to fetch profiles"); }
    };

    fetchListing();
    fetchProfiles();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0f172a] p-8 text-[#94a3b8]">Loading...</div>;
  if (error)   return <div className="min-h-screen bg-[#0f172a] p-8 text-red-400">{error}</div>;
  if (!listing) return null;

  const cardClass  = "bg-[#1e293b] border border-[#334155] rounded-2xl p-6";
  const labelClass = "text-[#64748b]";
  const valueClass = "text-white font-medium";

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/listings")}
          className="mb-6 text-[#94a3b8] hover:text-amber-400 transition-colors text-sm flex items-center gap-2"
        >
          ← Back to Listings
        </button>

        {/* Image */}
        <div className="relative h-80 bg-[#0f172a] rounded-2xl mb-6 overflow-hidden flex items-center justify-center border border-[#334155]">
          {listing.primaryImageUrl
            ? <>
                <img src={`http://localhost:8080${listing.primaryImageUrl}`} alt={listing.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-60" />
              </>
            : <span className="text-[#334155]">No Image</span>
          }
          <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm ${
            listing.status === "ACTIVE" ? "bg-emerald-900/80 text-emerald-400 border-emerald-400/20" :
            listing.status === "SOLD"   ? "bg-gray-900/80 text-gray-400 border-gray-400/20" :
                                          "bg-amber-900/80 text-amber-400 border-amber-400/20"
          }`}>
            {listingStatuses[listing.status] || listing.status}
          </span>
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">{listing.title}</h1>
            <p className="text-[#94a3b8]">{listing.address.district}, {listing.address.city}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-amber-400">₺{listing.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Key Info Bar */}
        <div className="grid grid-cols-5 gap-4 bg-[#1e293b] border border-[#334155] rounded-2xl p-4 mb-6 text-center">
          {[
            { value: listing.sizeM2,                                      label: "m²" },
            { value: listing.bedroomCount  ?? "-",                        label: "Bedrooms" },
            { value: listing.bathroomCount ?? "-",                        label: "Bathrooms" },
            { value: listing.roomCount     ?? "-",                        label: "Rooms" },
            { value: `${listing.floorNumber ?? "-"}/${listing.totalFloors ?? "-"}`, label: "Floor" },
          ].map(({ value, label }) => (
            <div key={label} className="border-r border-[#334155] last:border-0">
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-[#94a3b8] text-sm">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">

          {/* Property Info */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Property Info</h2>
            <div className="space-y-3">
              {[
                { label: "Type",        value: propertyTypes[listing.propertyType] || listing.propertyType },
                { label: "Build Year",  value: listing.buildYear    ?? "-" },
                { label: "Living Area", value: listing.livingAreaM2 ? `${listing.livingAreaM2} m²` : "-" },
                { label: "Heating",     value: heatingTypes[listing.heatingType] || listing.heatingType },
                { label: "Total Floors",value: listing.totalFloors  ?? "-" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-[#334155] pb-2 last:border-0 last:pb-0">
                  <span className={labelClass}>{label}</span>
                  <span className={valueClass}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Features</h2>
            <div className="space-y-3">
              {[
                { label: "Parking",   value: listing.hasParking },
                { label: "Elevator",  value: listing.hasElevator },
                { label: "Balcony",   value: listing.hasBalcony },
                { label: "Garden",    value: listing.hasGarden },
                { label: "Furnished", value: listing.isFurnished },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-[#334155] pb-2 last:border-0 last:pb-0">
                  <span className={labelClass}>{label}</span>
                  <span className={value ? "text-emerald-400 font-medium" : "text-red-400"}>
                    {value ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Address</h2>
            <div className="space-y-3">
              {[
                { label: "Street",       value: listing.address.street },
                { label: "Neighborhood", value: listing.address.neighborhood },
                { label: "District",     value: listing.address.district },
                { label: "City",         value: listing.address.city },
                { label: "Zip Code",     value: listing.address.zipCode },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-[#334155] pb-2 last:border-0 last:pb-0">
                  <span className={labelClass}>{label}</span>
                  <span className={valueClass}>{value || "-"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={cardClass}>
            <h2 className="text-white font-semibold text-lg mb-4">Description</h2>
            <p className="text-[#94a3b8] leading-relaxed">{listing.description || "No description provided."}</p>
          </div>

        </div>

        {/* AI Analysis Card */}
        <div className="mt-6">
          <AIAnalysisCard
            listingId={id}
            listing={listing}
            profiles={profiles}
            headers={headers}
          />
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => navigate(`/edit-listing/${listing.id}`)}
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition-colors text-sm"
          >
            Edit Listing
          </button>
        </div>

      </div>
    </div>
  );
}

export default ListingDetailPage;