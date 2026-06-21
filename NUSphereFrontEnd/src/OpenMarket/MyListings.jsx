import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";

export function PersonalListings() {
    const [listings, setListings] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);

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
        !loadSuccess ? listings :
        loading ? <p>Loading listings...</p> :
        listings.length === 0 ? <h2>No listings available</h2> :
        <div className="listings-grid">
            {listings?.map((listing) => (
                <div key={listing.id} className="listing-card">

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
                        <div className="card-price">
                            ${parseFloat(listing.item_price).toFixed(2)}
                        </div>
                    </div>
                </div>
            ))}
        </div>       
    );
}