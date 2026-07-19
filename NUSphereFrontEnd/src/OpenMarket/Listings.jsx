import {useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import {useNavigate, useOutletContext} from "react-router-dom";
import "./Listings.css";
import axios from "axios";
import {SelectQuantity} from "./SelectQuantity.jsx"
import { buildGoogleMapsUrl, hasMapLocation } from "../utils/googleMaps.js";
import { PageState } from "../Defaults/PageState.jsx";

export function Listings() {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { selectedCategory, searchTerm } = useOutletContext();

    const openConversation = async (listingId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert("Please log in to message sellers.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/chat/conversations/`, {
                source_type: "listing",
                product_id: listingId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate(`/messages/${response.data.id}`);
        } catch (error) {
            console.error("Error opening conversation:", error);
            alert(error.response?.data?.error || "Failed to open conversation.");
        }
    };

    const fetchListings = async () => {
      setLoading(true);
      setError("");
      try{
        const token = localStorage.getItem('access_token');

        let response;
        if (token && token !== "null" && token !== "undefined") {
            response = await axios.get(`${API_BASE_URL}/api/listings/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
            });
        }
        else{
            response = await axios.get(`${API_BASE_URL}/api/listings/`);
        }

        if (!response) {
            throw new Error('Network response failure');
        }
        setListings(response.data);
        } catch (error) {
            console.error('Error fetching listings:', error);
            if (error.response?.status === 401){
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.reload();
            }
            setError("Check your connection and try again.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const timer = window.setTimeout(fetchListings, 0);
        return () => window.clearTimeout(timer);
    }, []);

    const filteredListings = selectedCategory === "All"
            ? listings
            : listings.filter(listing => listing.category === selectedCategory);

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const searchedListings = normalizedSearch
            ? filteredListings.filter(listing =>
                [
                    listing.item_name,
                    listing.item_description,
                    listing.location_name,
                    listing.category
                ].some(value => value?.toLowerCase().includes(normalizedSearch))
            )
            : filteredListings;

    if (loading) {
        return <PageState title="Loading marketplace" message="Finding available listings for you…" />;
    }

    if (error) {
        return <PageState title="We couldn’t load the marketplace" message={error} actionLabel="Try again" onAction={fetchListings} tone="error" />;
    }

    if (searchedListings.length === 0) {
        return <PageState title="No listings found" message="Try another category or search term." />;
    }

    return (
        <div className="listings-grid">
            {searchedListings?.map((listing) => (
                <div key={listing.id} 
                className="listing-card"
                onClick={() => setExpandedId(expandedId === listing.id ? null : listing.id)}
                >

                    <div className="listing-image-frame">
                        <span aria-hidden="true">Image unavailable</span>
                        {listing.image && (
                            <img
                                src={listing.image.startsWith('http') ? listing.image : `${API_BASE_URL}${listing.image}`}
                                alt={listing.item_name}
                                className="listing-image"
                                onError={(event) => {
                                    event.currentTarget.hidden = true;
                                }}
                            />
                        )}
                    </div>

                    <h4 className="card-title">
                        {listing.item_name}
                    </h4>

                    <div className="listing-meta">
                        {listing.category && <span className="listing-category">{listing.category}</span>}
                        <span>{listing.inventory.unsold} available</span>
                    </div>

                    <div className="card-footer">
                        <div className="card-actions">
                            <button className="button-secondary" onClick={(e) =>{
                                e.stopPropagation()
                                setSelectedProduct(listing);
                            }}>
                                Add to Cart
                            </button>
                            <button onClick={(e) =>{
                                e.stopPropagation()
                                openConversation(listing.id);
                            }}>
                                Message Seller
                            </button>
                        </div>

                        <div className="card-price">
                            ${parseFloat(listing.item_price).toFixed(2)}
                        </div>
                    </div>
                    {selectedProduct===listing &&
                        <SelectQuantity productid={selectedProduct.id} productMaxQuantity={selectedProduct.inventory.unsold} onClose={() => setSelectedProduct(null)}/>
                    }

                    {expandedId === listing.id && (
                        <div className="card-description">
                            <p>{listing.item_description || "No description provided for this listing."}</p>
                            {hasMapLocation(listing) && (
                                <div className="listing-meetup-location">
                                    <strong>Meet-up location</strong>
                                    <span>{listing.location_name}</span>
                                    <a
                                        href={buildGoogleMapsUrl(listing.latitude, listing.longitude)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        Show on Google Maps
                                    </a>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
