import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function PersonalListings() {
    const [listings, setListings] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const deleteListing = async (listingId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/api/listings/personal/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                data: {
                    listing_id: listingId
                }
            });
            fetchListings();
        } catch (error) {
            console.error('Error deleting listing:', error);
        }
    };

    //fetching personal listings 
    const fetchListings = async () => {
      try{
        const response = await fetch(`${API_BASE_URL}/api/listings/personal/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
          if (!response.ok) {
              throw new Error('Network response failure');
          }
          const data = await response.json();
          setListings(data);
      } catch (error) {
          console.error('Error fetching listings:', error);
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
        <div className="pending-listing-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            
            <h2>All Listings</h2>

            {!loadSuccess ? listings :
            loading ? <p>Loading listings...</p> :
            listings.length === 0 ? <div
                className="listing-card add-new-card"
                onClick={() => navigate('/add-listing') }
            >
                <div className="plus-icon-circle">
                    <span className="plus-symbol">+</span>
                </div>
                <h3 className="add-card-text">Create New Listing</h3>
            </div>:
            
            <div className="my-listings-grid">
                {listings?.map((listing) => (
                    <div key={listing.id} className="listing-card">

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
                            Quantity: <strong>{listing.item_quantity}</strong>
                        </div>

                        <div className="price-label">
                            <div> Price: </div>
                            <div className="card-price">
                                    ${parseFloat(listing.item_price).toFixed(2)}
                            </div>
                        </div>
                        
                        <div className="card-footer">
                            <div className = "item-status" style = {{display: "flex", flexDirection: "column"}}>
                                <div><strong>Status:</strong></div>
                                <div>Unsold: {listing.inventory.unsold}</div>
                                <div>Pending: {listing.inventory.pending}</div>
                                <div>Sold: {listing.inventory.sold}</div>
                            </div>
                            <button onClick={() => deleteListing(listing.id)}>
                                Delete Listing
                            </button>
                        </div>
                    </div>
                ))}
                <div
                    className="listing-card add-new-card"
                    onClick={() => navigate('/add-listing') }
                >
                    <div className="plus-icon-circle">
                        <span className="plus-symbol">+</span>
                    </div>
                    <h3 className="add-card-text">Create New Listing</h3>
                </div>
            </div>}
        </div>
    );
}