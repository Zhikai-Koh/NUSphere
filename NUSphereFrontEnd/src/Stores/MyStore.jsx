import {useContext, createContext, useState, useEffect} from "react";
import { API_BASE_URL } from "../config.js";
import { useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import "../OpenMarket/Listings.css";
import { StoreLocationPicker } from "./StoreLocationPicker.jsx";

export function MyStore() {
    const [listings, setListings] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [loading, setLoading] = useState(true);
    const [store, setStore] = useState(null);
    const [editingLocation, setEditingLocation] = useState(false);
    const [locationName, setLocationName] = useState("");
    const [location, setLocation] = useState(null);
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

    //fetching products
    const fetchShopProducts = async () => {
      try{
        const headers = {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        };
        const [productsResponse, storesResponse] = await Promise.all([
            fetch(`${API_BASE_URL}/api/store/storeitems/${storeId}`, { headers }),
            fetch(`${API_BASE_URL}/api/store/personal/`, { headers })
        ]);
          if (!productsResponse.ok || !storesResponse.ok) {
              throw new Error('Network response failure');
          }
          const products = await productsResponse.json();
          const stores = await storesResponse.json();
          const selectedStore = stores.find((item) => item.id === Number(storeId));

          if (!selectedStore) {
              throw new Error('Store not found');
          }

          setListings(products);
          setStore(selectedStore);
          setLocationName(selectedStore.location_name || "");
          setLocation(selectedStore.latitude != null && selectedStore.longitude != null ? {
              latitude: selectedStore.latitude,
              longitude: selectedStore.longitude,
          } : null);
      } catch (error) {
          console.error('Error fetching listings:', error);
          setLoadSuccess(false);
          setListings(<p style={{ color: 'red' }}>Failed to load listings. Please try again later.</p>);
      } finally {
          setLoading(false);
      }
  }

    const saveLocation = async () => {
        if (!locationName.trim() || !location) {
            alert("Please enter a location name and select the location on the map.");
            return;
        }

        try {
            const response = await axios.patch(`${API_BASE_URL}/api/store/personal/`, {
                shop_id: Number(storeId),
                location_name: locationName.trim(),
                latitude: location.latitude,
                longitude: location.longitude,
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            setStore((currentStore) => ({
                ...currentStore,
                location_name: response.data.location_name,
                latitude: response.data.latitude,
                longitude: response.data.longitude,
            }));
            setEditingLocation(false);
        } catch (error) {
            console.error('Error updating store location:', error);
            alert(error.response?.data?.error || "Failed to update store location.");
        }
    };

    const cancelLocationEdit = () => {
        setLocationName(store.location_name || "");
        setLocation(store.latitude != null && store.longitude != null ? {
            latitude: store.latitude,
            longitude: store.longitude,
        } : null);
        setEditingLocation(false);
    };

    useEffect(() => {
        fetchShopProducts();
    }, []);

    return (
        !loadSuccess ? listings :
        loading ? <p>Loading listings...</p> :
        <div className="pending-listing-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <h2 style={{ margin: 0 }}>{store.store_name}</h2>
                <button onClick={() => navigate('/pending-sales')}>
                    View Pending Sales
                </button>
            </div>

            <section className="store-location-section">
                <div className="store-location-section-header">
                    <h3>Store Location</h3>
                    {!editingLocation && (
                        <button type="button" onClick={() => setEditingLocation(true)}>
                            {location ? "Edit Location" : "Add Location"}
                        </button>
                    )}
                </div>

                {(location || editingLocation) ? (
                    <StoreLocationPicker
                        locationName={locationName}
                        onLocationNameChange={setLocationName}
                        location={location}
                        onLocationChange={setLocation}
                        editable={editingLocation}
                        inputId="store-location-edit-name"
                    />
                ) : (
                    <p>No location has been set for this store.</p>
                )}

                {editingLocation && (
                    <div className="store-location-actions">
                        <button type="button" onClick={cancelLocationEdit}>Cancel</button>
                        <button type="button" onClick={saveLocation}>Save Location</button>
                    </div>
                )}
            </section>

            {listings.length === 0 ? <div
            className="listing-card add-new-card"
            onClick={() => navigate('/AddProduct/' +  storeId)}
        >
            <div className="plus-icon-circle">
                <span className="plus-symbol">+</span>
            </div>
            <h3 className="add-card-text">Add New Product/Service</h3>
        </div>:
        
        <>
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
                        <button
                            onClick={() => navigate('/pending-sales')}
                            style={{ background: "transparent", color: "#1a3644", border: "none", padding: 0, textAlign: "left", cursor: "pointer", fontWeight: "600", font: "inherit" }}
                        >
                            Pending Sales: {listing.pending_order_count || 0}
                        </button>
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
        }
        </div>
    );
}
