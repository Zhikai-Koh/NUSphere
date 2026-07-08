import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function SelectMyStore() {
    const [listings, setListings] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const deleteStore = async (storeId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/store/personal/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                data: {
                    shop_id: storeId
                }
            });
            fetchListings();
        } catch (error) {
            console.error('Error deleting store:', error);
            alert(error.response?.data?.error || "Failed to delete store.");
        }
    };

    //FETCH ALL MY STORES
    const fetchListings = async () => {
      try{
        const response = await fetch(`${API_BASE_URL}/api/store/personal/`, {
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
          console.error('Error fetching stores:', error);
          setLoadSuccess(false);
          setListings(<p style={{ color: 'red' }}>Failed to load stores. Please try again later.</p>);
      } finally {
          setLoading(false);
      }
  }

    useEffect(() => {
        fetchListings();
    }, []);

    return (
        !loadSuccess ? listings :
        loading ? <p>Loading stores...</p> :
        <div className="pending-listing-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <h2 style={{ margin: 0 }}>My Stores</h2>
                <button onClick={() => navigate('/pending-sales')}>
                    View Pending Sales
                </button>
            </div>

            {listings.length === 0 ? <div
            className="listing-card add-new-card"
            onClick={() => navigate('/add-store') }
        >
            <div className="plus-icon-circle">
                <span className="plus-symbol">+</span>
            </div>
            <h3 className="add-card-text">Add New Store</h3>
        </div>:
        
        <div className="my-listings-grid">
            {listings?.map((listing) => (
                <div key={listing.id} className="listing-card" onClick={()=> navigate(`./${listing.id}`)}>

                    {listing.store_image && (
                        <img src={listing.store_image.startsWith('http') ? listing.store_image : `${API_BASE_URL}${listing.store_image}`}
                        alt={listing.store_name}
                        className="listing-image"
                        />
                    )}

                    <h4 className="card-title">
                        {listing.store_name}
                    </h4>

                    <div className="card-quantity" onClick={(event) => {
                        event.stopPropagation();
                        navigate('/pending-sales');
                    }} style={{ cursor: "pointer", fontWeight: "600" }}>
                        Pending Orders: <strong>{listing.pending_order_count || 0}</strong>
                    </div>
                    
                    <div className="card-footer">
                        <button onClick={(event) => {
                            event.stopPropagation();
                            deleteStore(listing.id);
                        }}>
                            Delete Store
                        </button>
                    </div>
                </div>
            ))}
            <div
                className="listing-card add-new-card"
                onClick={() => navigate('/add-store') }
            >
                <div className="plus-icon-circle">
                    <span className="plus-symbol">+</span>
                </div>
                <h3 className="add-card-text">Add New Store</h3>
            </div>
        </div>}
        </div> 
    );
}
