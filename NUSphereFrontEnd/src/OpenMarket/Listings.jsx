import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import { CartContext } from "../UserSpecifics/CartContext.jsx";
import {useNavigate, useOutletContext} from "react-router-dom";
import "./Listings.css";
import axios from "axios";
import {SelectQuantity} from "./SelectQuantity.jsx"
import { buildGoogleMapsUrl, hasMapLocation } from "../utils/googleMaps.js";

export function Listings() {
    const [listings, setListings] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
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
            setLoadSuccess(false);
            setListings(<p style={{ color: 'red' }}>Failed to load listings. Please try again later.</p>);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchListings();
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

    return (
        !loadSuccess ? listings :
        loading ? <p>Loading listings...</p> :
        searchedListings.length === 0 ? <h2>No listings available</h2> :
        <div className="listings-grid">
            {searchedListings?.map((listing) => (
                <div key={listing.id} 
                className="listing-card"
                onClick={() => setExpandedId(expandedId === listing.id ? null : listing.id)}
                >

                    {listing.image && (
                        <img src={listing.image.startsWith('http') ? listing.image : `${API_BASE_URL}${listing.image}`}
                        alt={listing.item_name}
                        className="listing-image"
                        />
                    )}

                    <h4 className="card-title">
                        {listing.item_name}
                    </h4>

                    <div className="card-quantity">
                        Quantity: <strong>{listing.inventory.unsold}</strong>
                    </div>
                    
                    <div className="card-footer">
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <button onClick={(e) =>{
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
