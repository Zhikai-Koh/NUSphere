import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import { CartContext } from "../UserSpecifics/CartContext.jsx";
import {useNavigate, useOutletContext, useParams} from "react-router-dom";
import "../OpenMarket/Listings.css";
import axios from "axios";
import { SelectQuantity } from "../OpenMarket/SelectQuantity.jsx";

export function VisitStore() {
    const [listings, setListings] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const {storeId} = useParams();

    const openConversation = async (productId) => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            alert("Please log in to message sellers.");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/chat/conversations/`, {
                source_type: "shop_product",
                product_id: productId
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
        response = await axios.get(`${API_BASE_URL}/api/store/otherstoreitems/${storeId}`);

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

    const filteredListings = listings;

    return (
        <main className="visit-store-page">
            {!loadSuccess ? listings :
            loading ? <p>Loading listings...</p> :
            filteredListings.length === 0 ? <h2>No listings available</h2> :
            <div className="listings-grid">
            {filteredListings?.map((listing) => (
                <div key={listing.id} 
                className="listing-card"
                onClick={() => setExpandedId(expandedId === listing.id ? null : listing.id)}
                >

                    {listing.item_image && (
                        <img src={listing.item_image.startsWith('http') ? listing.item_image : `${API_BASE_URL}${listing.item_image}`}
                        alt={listing.item_name}
                        className="listing-image"
                        />
                    )}

                    <h4 className="card-title">
                        {listing.item_name}
                    </h4>

                    <div className="card-quantity">
                        Quantity: <strong>{listing.item_quantity}</strong>
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
                        <SelectQuantity productid={selectedProduct.id} productMaxQuantity={selectedProduct.item_quantity} onClose={() => setSelectedProduct(null)} product_type="shop_product"/>
                    }

                    {expandedId === listing.id && (
                        <div className="card-description">
                            {listing.description || "No description provided for this listing."}
                        </div>
                    )}
                </div>
            ))}
            </div>}
        </main>
    );
}
