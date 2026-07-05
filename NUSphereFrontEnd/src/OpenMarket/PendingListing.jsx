import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import { CartContext } from "../UserSpecifics/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function PendingListings(){
    const [pendings, setPending] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('access_token');


    const handleConfirmSale = async (productId, buyer) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/listings/confirmsold/`, {
                product_id: productId,
                buyer: buyer
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Sale Successfully Confirmed!")
            window.location.reload();
        } catch (error) {
            console.error("Confirmation of Sale Failed:", error);
        }
    };

    const fetchPending = async () => {
      try{
        const response = await axios.get(`${API_BASE_URL}/api/listings/confirmsold/`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            });

        if (!response) {
            throw new Error('Network response failure');
        }
        setPending(response.data);
        } catch (error) {
            console.error('Error fetching pending listings:', error);
            setLoadSuccess(false);
            setPending(<p style={{ color: 'red' }}>Failed to load pending listings. Please try again later.</p>);
        } finally {
            setLoading(false);
      }
  }

    useEffect(() => {
        fetchPending();
    }, []);

    return (
        <div className="pending-listing-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            
            <h2>Pending Listings</h2>

            {!loadSuccess ? pendings :
            loading ? <p>Loading listings...</p> :
            pendings.length === 0 ? <h2>No pending listings available</h2> :
            <div className="my-listings-grid">
                {pendings?.map((pending) => (
                    <div key={pending.listing_id} 
                    className="listing-card"
                    >
                        {pending.image && (
                            <img src={pending.image.startsWith('http') ? pending.image : `${API_BASE_URL}${pending.image}`} 
                            alt={pending.item_name}
                            className="listing-image"
                            />
                        )}

                        <h4 className="card-title">
                            {pending.item_name}
                        </h4>

                        <div className="card-quantity">
                            Quantity: <strong>{pending.quantity}</strong>
                        </div>
                        
                        <div className="card-footer">                        
                            <button onClick={(e) =>{
                                e.stopPropagation(pending.id, pending.buyer);
                                handleConfirmSale(pending.id, pending.buyer);
                            }}
                            style = {{backgroundColor:"#11ac38ff"}}
                            >
                                Confirm Sale
                            </button>
                            <div className="card-price">
                                ${parseFloat(pending.item_price).toFixed(2)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>}
        </div>
    );
}