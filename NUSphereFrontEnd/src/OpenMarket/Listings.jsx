import {createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";

export function Listings() {
    const [listings, setListings] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);


    const fetchListings = async () => {
      try{
        const response = await fetch(`${API_BASE_URL}/api/listings/`);
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
            <>
                <div style={{
                    display: 'grid',
                    backgroundColor: '#f0f0f0',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '20px',
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '20px',
                }}>

                    {listings?.map((listing) => (
                        <div 
                        key={listing.id} 
                        style={{
                                backgroundColor: '#f9f9f9',
                                border: '1px solid #e0e0e0', 
                                borderRadius: '10px',
                                padding: '20px',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                                }}>
                            <h4 style={{ margin: 0, fontSize: '20px', color: '#4b4747' }}>
                                {listing.image && (
                                    <img src={`${API_BASE_URL}${listing.image}`} alt={listing.item_name} style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                                )}
                                {listing.item_name}
                            </h4>

                            <div style={{ color: '#666', fontSize: '14px' }}>
                                Quantity: <strong style={{ color: '#000' }}>{listing.quantity}</strong>
                            </div>

                            <div style={{ 
                                fontSize: '18px', 
                                fontWeight: 'bold', 
                                color: '#2e7d32', 
                                marginTop: 'auto',
                                paddingTop: '10px',
                                textAlign: 'right',
                                paddingTop: '20px'
                            }}>
                                ${parseFloat(listing.item_price).toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </>
    );
}