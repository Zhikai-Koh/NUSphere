import {useContext, useState} from "react";
import { API_BASE_URL } from "../config.js";
import { CartContext } from "../UserSpecifics/CartContext.jsx";
import { ListingsContext } from "./ListingContext.jsx";
import "./Listings.css";
import axios from "axios";

export function Listings() {
    const [expandedId, setExpandedId] = useState(null);

    const { handleAddToCart } = useContext(CartContext);
    const { listings, loadSuccess } = useContext(ListingsContext);

    return (
        !loadSuccess ? listings :

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
                        Quantity: <strong>{listing.item_quantity}</strong>
                    </div>
                    
                    <div className="card-footer">                        
                        <button onClick={(e) =>{
                            e.stopPropagation(listing.id, 1);
                            handleAddToCart(listing.id, 1);
                        }}>
                            Add to Cart
                        </button>
                        <div className="card-price">
                            ${parseFloat(listing.item_price).toFixed(2)}
                        </div>
                    </div>

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