import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEnums } from "../hooks/useEnums.js";

function EditListingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
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
      street: "",
      city: "",
      district: "",
      neighborhood: "",
      zipCode: "",
      latitude: "",
      longitude: "",
      buildingNumber: "",
      floor: "",
      apartmentNumber: "",
    },
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `http://localhost:8080/listing/get/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();

          setFormData({
            ...formData,
            ...data,
            address: {
              ...formData.address,
              ...data.address,
            },
          });
        } else {
          setError("Failed to load listing.");
        }
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      address: {
        ...formData.address,
        [name]: value,
      },
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8080/listing/updateListing/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            price: parseFloat(formData.price),
            sizeM2: parseFloat(formData.sizeM2),
            livingAreaM2: formData.livingAreaM2
              ? parseFloat(formData.livingAreaM2)
              : null,
            bedroomCount: formData.bedroomCount
              ? parseInt(formData.bedroomCount)
              : null,
            bathroomCount: formData.bathroomCount
              ? parseInt(formData.bathroomCount)
              : null,
            roomCount: formData.roomCount
              ? parseInt(formData.roomCount)
              : null,
            floorNumber: formData.floorNumber
              ? parseInt(formData.floorNumber)
              : null,
            totalFloors: formData.totalFloors
              ? parseInt(formData.totalFloors)
              : null,
            buildYear: formData.buildYear
              ? parseInt(formData.buildYear)
              : null,
            address: {
              ...formData.address,
              latitude: formData.address.latitude
                ? parseFloat(formData.address.latitude)
                : null,
              longitude: formData.address.longitude
                ? parseFloat(formData.address.longitude)
                : null,
            },
          }),
        }
      );

      if (response.ok) {
        setMessage("Listing updated successfully!");
        navigate("/listings");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update listing.");
      }
    } catch {
      setError("Could not connect to server.");
    }
  };

  const handleImageUpload = async () => {
    if (selectedFiles.length === 0) {
      setError("Please select at least one image.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formDataObj = new FormData();

      selectedFiles.forEach((file) => formDataObj.append("files", file));

      const response = await fetch(
        `http://localhost:8080/listing/${id}/images`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formDataObj,
        }
      );

      if (response.ok) {
        setMessage("Images uploaded successfully!");
        setSelectedFiles([]);
      } else {
        setError("Failed to upload images.");
      }
    } catch {
      setError("Could not connect to server.");
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg bg-[#0f172a] border border-[#334155] text-white placeholder-[#64748b] outline-none focus:border-amber-400 transition-colors";

  const labelClass =
    "block text-sm font-medium text-[#94a3b8] mb-1";

  const sectionClass =
    "bg-[#1e293b] border border-[#334155] rounded-2xl p-6 space-y-4";

  const sectionTitle =
    "text-white font-semibold text-lg mb-2";

  const detailFields = [
    { label: "Price *", name: "price", required: true },
    { label: "Size (m²) *", name: "sizeM2", required: true },
    { label: "Living Area (m²)", name: "livingAreaM2" },
    { label: "Bedrooms", name: "bedroomCount" },
    { label: "Bathrooms", name: "bathroomCount" },
    { label: "Rooms", name: "roomCount" },
    { label: "Floor", name: "floorNumber" },
    { label: "Total Floors", name: "totalFloors" },
    { label: "Build Year", name: "buildYear" },
  ];

  const addressFields = [
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
  ];

  if (loading)
    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-8">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0f172a] p-8">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => navigate("/listings")}
          className="mb-6 text-[#94a3b8] hover:text-amber-400 text-sm"
        >
          ← Back to Listings
        </button>

        <h1 className="text-2xl font-bold text-white mb-6">
          Edit Listing
        </h1>

        {error && (
          <p className="text-red-400 mb-6 bg-red-400/10 rounded-xl px-4 py-3 text-sm">
            {error}
          </p>
        )}

        {message && (
          <p className="text-green-400 mb-6 bg-green-400/10 rounded-xl px-4 py-3 text-sm">
            {message}
          </p>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">

          {/* Basic Info */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Basic Info</h2>

            <div>
              <label className={labelClass}>Title *</label>
              <input name="title" required className={inputClass}
                value={formData.title}
                onChange={handleChange}/>
            </div>

            <div>
              <label className={labelClass}>Description</label>
              <textarea name="description" rows={3}
                className={inputClass}
                value={formData.description}
                onChange={handleChange}/>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className={labelClass}>Property Type *</label>
                <select name="propertyType" className={inputClass}
                  value={formData.propertyType}
                  onChange={handleChange}>
                  {Object.entries(propertyTypes).map(([k,v])=>(
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select name="status" className={inputClass}
                  value={formData.status}
                  onChange={handleChange}>
                  {Object.entries(listingStatuses).map(([k,v])=>(
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>

            </div>
          </div>

          {/* Details */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Details</h2>

            <div className="grid grid-cols-2 gap-4">
              {detailFields.map((field)=>(
                <div key={field.name}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    name={field.name}
                    type="number"
                    required={field.required}
                    className={inputClass}
                    value={formData[field.name]}
                    onChange={handleChange}
                  />
                </div>
              ))}

              <div>
                <label className={labelClass}>Heating Type</label>
                <select name="heatingType" className={inputClass}
                  value={formData.heatingType}
                  onChange={handleChange}>
                  {Object.entries(heatingTypes).map(([k,v])=>(
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Features</h2>

            <div className="grid grid-cols-3 gap-4">
              {["hasParking","hasElevator","hasBalcony","hasGarden","isFurnished"].map((feature)=>(
                <label key={feature} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox"
                    name={feature}
                    checked={formData[feature]}
                    onChange={handleChange}/>
                  <span className="text-[#94a3b8] text-sm">
                    {feature.replace(/([A-Z])/g," $1").replace("has ","Has ").replace("is ","Is ")}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Address */}
          <div className={sectionClass}>
            <h2 className={sectionTitle}>Address</h2>

            <div className="grid grid-cols-2 gap-4">
              {addressFields.map((field)=>(
                <div key={field.name}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    name={field.name}
                    type={field.type || "text"}
                    className={inputClass}
                    value={formData.address[field.name]}
                    onChange={handleAddressChange}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl transition"
          >
            Save Changes
          </button>

        </form>

        {/* Image Upload */}
        <div className={sectionClass + " mt-6"}>
          <h2 className={sectionTitle}>Upload Images</h2>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e)=>setSelectedFiles(Array.from(e.target.files))}
            className="mb-4 text-white"
          />

          {selectedFiles.length>0 && (
            <p className="text-[#94a3b8] text-sm mb-4">
              {selectedFiles.length} file(s) selected
            </p>
          )}

          <button
            onClick={handleImageUpload}
            className="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-[#0f172a] font-bold rounded-xl"
          >
            Upload Images
          </button>
        </div>

      </div>
    </div>
  );
}

export default EditListingPage;