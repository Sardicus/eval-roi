import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEnums } from "../hooks/useEnums.js";

function AddListingPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { propertyTypes, heatingTypes, listingStatuses } = useEnums();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    propertyType: "APARTMENT",
    status: "ACTIVE",
    price: "",
    sizeM2: "",
    livingAreaM2: "",
    bedroomCount: "",
    bathroomCount: "",
    roomCount: "",
    floorNumber: "",
    totalFloors: "",
    buildYear: "",
    hasParking: false,
    hasElevator: false,
    hasBalcony: false,
    hasGarden: false,
    isFurnished: false,
    heatingType: "KOMBI",
    address: {
      street: "", city: "", district: "", neighborhood: "",
      zipCode: "", latitude: "", longitude: "",
      buildingNumber: "", floor: "", apartmentNumber: "",
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, address: { ...formData.address, [name]: value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/listing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          sizeM2: parseFloat(formData.sizeM2),
          livingAreaM2: formData.livingAreaM2 ? parseFloat(formData.livingAreaM2) : null,
          bedroomCount: formData.bedroomCount ? parseInt(formData.bedroomCount) : null,
          bathroomCount: formData.bathroomCount ? parseInt(formData.bathroomCount) : null,
          roomCount: formData.roomCount ? parseInt(formData.roomCount) : null,
          floorNumber: formData.floorNumber ? parseInt(formData.floorNumber) : null,
          totalFloors: formData.totalFloors ? parseInt(formData.totalFloors) : null,
          buildYear: formData.buildYear ? parseInt(formData.buildYear) : null,
          address: {
            ...formData.address,
            latitude: formData.address.latitude ? parseFloat(formData.address.latitude) : null,
            longitude: formData.address.longitude ? parseFloat(formData.address.longitude) : null,
          },
        }),
      });
      if (response.ok) {
        navigate("/listings");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create listing.");
      }
    } catch (err) {
      setError("Could not connect to server.");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] outline-none focus:border-amber-400 transition-colors";
  const labelClass = "block text-sm font-medium text-[#94a3b8] mb-1";
  const sectionClass = "bg-[#1e293b] border border-[#334155] rounded-2xl p-6 space-y-4";
  const sectionTitle = "text-white font-semibold text-lg mb-2";

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <button onClick={() => navigate("/listings")} className="mb-6 text-[#94a3b8] hover:text-amber-400 transition-colors text-sm">
          ← Back to Listings
        </button>
        <h1 className="text-2xl font-bold text-white mb-6">Add New Listing</h1>

        {error && <p className="text-red-400 mb-6 bg-red-400/10 rounded-xl px-4 py-3 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Basic Info</h2>
            <div>
              <label className={labelClass}>Title *</label>
              <input name="title" required className={inputClass} value={formData.title} onChange={handleChange} />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" rows={3} className={inputClass} value={formData.description} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Property Type *</label>
                <select name="propertyType" required className={inputClass} value={formData.propertyType} onChange={handleChange}>
                  {Object.entries(propertyTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select name="status" className={inputClass} value={formData.status} onChange={handleChange}>
                  {Object.entries(listingStatuses).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Details</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Price *", name: "price", required: true },
                { label: "Size (m²) *", name: "sizeM2", required: true },
                { label: "Living Area (m²)", name: "livingAreaM2" },
                { label: "Bedrooms", name: "bedroomCount" },
                { label: "Bathrooms", name: "bathroomCount" },
                { label: "Rooms", name: "roomCount" },
                { label: "Floor", name: "floorNumber" },
                { label: "Total Floors", name: "totalFloors" },
                { label: "Build Year", name: "buildYear" },
              ].map(({ label, name, required }) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input name={name} type="number" required={required} className={inputClass}
                    value={formData[name]} onChange={handleChange} />
                </div>
              ))}
              <div>
                <label className={labelClass}>Heating Type</label>
                <select name="heatingType" className={inputClass} value={formData.heatingType} onChange={handleChange}>
                  {Object.entries(heatingTypes).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-6">
            <h2 className={sectionTitle}>Features</h2>
            <div className="grid grid-cols-3 gap-4">
              {["hasParking", "hasElevator", "hasBalcony", "hasGarden", "isFurnished"].map((feature) => (
                <label key={feature} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    formData[feature] ? "bg-amber-400 border-amber-400" : "border-[#334155] bg-[#0f172a]"
                  }`}>
                    {formData[feature] && <span className="text-[#0f172a] text-xs font-bold">✓</span>}
                  </div>
                  <input type="checkbox" name={feature} checked={formData[feature]} onChange={handleChange} className="hidden" />
                  <span className="text-[#94a3b8] text-sm group-hover:text-white transition-colors">
                    {feature.replace(/([A-Z])/g, ' $1').replace('has ', 'Has ').replace('is ', 'Is ')}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Address</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "City", name: "city" },
                { label: "District", name: "district" },
                { label: "Neighborhood", name: "neighborhood" },
                { label: "Street", name: "street" },
                { label: "Building Number", name: "buildingNumber" },
                { label: "Floor", name: "floor" },
                { label: "Apartment Number", name: "apartmentNumber" },
                { label: "Zip Code", name: "zipCode" },
                { label: "Latitude", name: "latitude", type: "number" },
                { label: "Longitude", name: "longitude", type: "number" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label className={labelClass}>{label}</label>
                  <input name={name} type={type || "text"} className={inputClass}
                    value={formData.address[name]} onChange={handleAddressChange} />
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition-colors text-sm tracking-wide">
            Create Listing
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddListingPage;