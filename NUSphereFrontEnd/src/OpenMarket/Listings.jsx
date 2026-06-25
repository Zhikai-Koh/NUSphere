import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import { CartContext } from "../UserSpecifics/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import "./Listings.css";
import axios from "axios";
import {SelectQuantity} from "./SelectQuantity.jsx"

export function Listings() {
    const [listings, setListings] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { handleAddToCart } = useContext(CartContext);

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
            if (error.response.status === 401){
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
    return (
        !loadSuccess ? listings :
        loading ? <p>Loading listings...</p> :
        listings.length === 0 ? <h2>No listings available</h2> :
        <div className="listings-grid">
            {listings?.map((listing) => (
                <div key={listing.id} 
                className="listing-card"
                onClick={() => setExpandedId(expandedId === listing.id ? null : listing.id)}
                >

                    {listing.image && (
                        <img src={`${API_BASE_URL}${listing.image}`} 
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
                        <button onClick={(e) =>{
                            e.stopPropagation()
                            setSelectedProduct(listing);
                        }}>
                            Add to Cart
                        </button>

                        <div className="card-price">
                            ${parseFloat(listing.item_price).toFixed(2)}
                        </div>
                    </div>
                    {selectedProduct===listing &&
                        <SelectQuantity product={selectedProduct} onClose={() => setSelectedProduct(null)}/>
                    }

                    {expandedId === listing.id && (
                        <div className="card-description">
                            {listing.item_description || "No description provided for this listing."}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}