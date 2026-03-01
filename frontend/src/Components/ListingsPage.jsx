import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

function ListingsPage() {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchListings = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:8080/listing/getAllListings", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setListings(data);
                } else {
                    setError("Failed to load listings.");
                }
            } catch (err) {
                setError("Could not connect to server.");
            }
        };

        fetchListings();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/listing/delete/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (response.ok) {
                setListings(listings.filter(l => l.id !== id));
            } else {
                setError("Failed to delete listing.");
            }
        } catch (err) {
            setError("Could not connect to server.");
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`http://localhost:8080/listing/updateListingStatus/${id}?status=${newStatus}`, {
                method: "PUT",
                headers: { "Authorization": `Bearer ${token}` },
            });
            if (response.ok) {
                setListings(listings.map(l => l.id === id ? { ...l, status: newStatus } : l));
            } else {
                setError("Failed to update status.");
            }
        } catch (err) {
            setError("Could not connect to server.");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold mb-6">Listings</h1>


            <button onClick={() => navigate("/add-listing")} className="mb-6 px-6 py-2 bg-cyan-500 text-white rounded-full hover:opacity-90">
                + Add Listing
            </button>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-3 gap-6">
                {listings.map((listing) => (
                    <div key={listing.id} className="bg-white rounded-xl shadow p-4">
                        {/* Image */}
                        <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                            {listing.primaryImageUrl
                                ? <img src={`http://localhost:8080${listing.primaryImageUrl}`} alt={listing.title} className="w-full h-full object-cover rounded-lg" />
                                : <span className="text-gray-400">No Image</span>
                            }
                        </div>

                        {/* Info */}
                        <h2 className="text-lg font-semibold">{listing.title}</h2>
                        <p className="text-gray-500">{listing.address.city}</p>
                        <p className="text-gray-500">{listing.propertyType} | {listing.sizeM2}m² | {listing.bedroomCount} bd</p>
                        <p className="text-cyan-600 font-bold mt-2">${listing.price.toLocaleString()}</p>
                        <button onClick={() => navigate(`/edit-listing/${listing.id}`)} className="mt-2 px-4 py-1 bg-cyan-500 text-white rounded-full text-sm hover:opacity-90">
                            Edit
                        </button>
                        <button
                            onClick={() => handleStatusChange(listing.id, listing.status === "ACTIVE" ? "INACTIVE" : "ACTIVE")}
                            className={`mt-2 ml-2 px-4 py-1 text-white rounded-full text-sm hover:opacity-90 ${listing.status === "ACTIVE" ? "bg-yellow-500" : "bg-green-500"}`}
                        >
                            {listing.status === "ACTIVE" ? "Deactivate" : "Activate"}
                        </button>

                        {listing.status !== "SOLD" && (
                            <button
                                onClick={() => handleStatusChange(listing.id, "SOLD")}
                                className="mt-2 ml-2 px-4 py-1 bg-gray-500 text-white rounded-full text-sm hover:opacity-90"
                            >
                                Mark as Sold
                            </button>
                        )}
                        <button onClick={() => handleDelete(listing.id)} className="mt-2 ml-2 px-4 py-1 bg-red-500 text-white rounded-full text-sm hover:opacity-90">
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ListingsPage;