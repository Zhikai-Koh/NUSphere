import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function SelectMyStore() {
    const [listings, setListings] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    //DELETE STORE OPTION
    // const deleteListing = async (listingId) => {
    //     try {
    //         const response = await axios.delete(`${API_BASE_URL}/api/listings/personal/`, {
    //             headers: {
    //                 'Authorization': `Bearer ${localStorage.getItem('access_token')}`
    //             },
    //             data: {
    //                 listing_id: listingId
    //             }
    //         });
    //         fetchListings();
    //     } catch (error) {
    //         console.error('Error deleting listing:', error);
    //     }
    // };

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
        listings.length === 0 ? <div
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
                        <img src={`${API_BASE_URL}${listing.store_image}`} 
                        alt={listing.store_name}
                        className="listing-image"
                        />
                    )}

                    <h4 className="card-title">
                        {listing.store_name}
                    </h4>
                    
                    <div className="card-footer">
                        <button onClick={() => deleteListing(listing.id)}>
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
        </div> 
    );
}