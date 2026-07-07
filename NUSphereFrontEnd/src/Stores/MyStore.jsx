import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import { useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import "../OpenMarket/Listings.css";

export function MyStore() {
    const [listings, setListings] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const {storeId} = useParams();

    const deleteProduct = async (productId) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/store/storeitems/${storeId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                data: {
                    product_id: productId
                }
            });
            fetchShopProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert(error.response?.data?.error || "Failed to delete product.");
        }
    };

    const fetchPendingOrders = async () => {
      try{
        const response = await fetch(`${API_BASE_URL}/api/store/orders/${storeId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
          if (!response.ok) {
              throw new Error('Network response failure');
          }
          const data = await response.json();
          setPendingOrders(data);
      } catch (error) {
          console.error('Error fetching pending store orders:', error);
      }
  }

    const confirmStoreOrder = async (productId, buyer) => {
        try {
            await axios.post(`${API_BASE_URL}/api/store/orders/${storeId}`, {
                product_id: productId,
                buyer: buyer
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            alert("Store order confirmed!");
            fetchPendingOrders();
        } catch (error) {
            console.error('Error confirming store order:', error);
            alert(error.response?.data?.error || "Failed to confirm store order.");
        }
    };

    //fetching products
    const fetchShopProducts = async () => {
      try{
        const response = await fetch(`${API_BASE_URL}/api/store/storeitems/${storeId}`, {
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
        fetchShopProducts();
        fetchPendingOrders();
    }, []);

    return (
        !loadSuccess ? listings :
        loading ? <p>Loading listings...</p> :
        listings.length === 0 ? <div
            className="listing-card add-new-card"
            onClick={() => navigate('/AddProduct/' +  storeId)}
        >
            <div className="plus-icon-circle">
                <span className="plus-symbol">+</span>
            </div>
            <h3 className="add-card-text">Add New Product/Service</h3>
        </div>:
        
        <>
        {pendingOrders.length > 0 && (
            <div className="pending-listing-container" style={{ maxWidth: "1200px", margin: "0 auto 24px", padding: "20px" }}>
                <h2>Pending Store Orders</h2>
                <div className="my-listings-grid">
                    {pendingOrders.map((order) => (
                        <div key={`${order.product_id}-${order.buyer}`} className="listing-card">
                            {order.image && (
                                <img src={order.image.startsWith('http') ? order.image : `${API_BASE_URL}${order.image}`}
                                alt={order.item_name}
                                className="listing-image"
                                />
                            )}

                            <h4 className="card-title">
                                {order.item_name}
                            </h4>

                            <div className="card-quantity">
                                Buyer: <strong>{order.buyer}</strong>
                            </div>

                            <div className="card-quantity">
                                Quantity: <strong>{order.quantity}</strong>
                            </div>

                            <div className="price-label">
                                <div>Unit Price: </div>
                                <div className="card-price">
                                        ${parseFloat(order.item_price).toFixed(2)}
                                </div>
                            </div>

                            <div className="card-footer">
                                <span className="order-source-badge store">Store Order</span>
                                <button onClick={() => confirmStoreOrder(order.product_id, order.buyer)}>
                                    Confirm Order
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
        <div className="my-listings-grid">
            {listings?.map((listing) => (
                <div key={listing.id} className="listing-card">

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
                        In Stock: <strong>{listing.item_quantity}</strong>
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
                            {/* <div>Pending: {listing.inventory.pending}</div>
                            <div>Sold: {listing.inventory.sold}</div> */}
                        </div>
                        <button onClick={() => deleteProduct(listing.id)}>
                            Delete Product/Service
                        </button>
                    </div>
                </div>
            ))}
            <div
                className="listing-card add-new-card"
                onClick={() => navigate('/AddProduct/' +  storeId) }
            >
                <div className="plus-icon-circle">
                    <span className="plus-symbol">+</span>
                </div>
                <h3 className="add-card-text">Create New Listing</h3>
            </div>
        </div>
        </>
    );
}
