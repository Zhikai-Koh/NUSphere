import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.js";
import { useOutletContext, useNavigate} from "react-router-dom";
import './StoresPage.css';
import axios from "axios"
import { NearbyStoresMap } from "./NearbyStoresMap.jsx";
import { buildGoogleMapsUrl, hasMapLocation } from "../utils/googleMaps.js";

function StoreCard({ store }) {
    const navigate = useNavigate();
    function handleViewStore(storeId){
        navigate(`../VisitStore/${storeId}`)
    }

    return (
        <div className="store-card">
            <div className="store-card-body">
                <img className="store-image" src={store.image.startsWith('http') ? store.image : `${API_BASE_URL}${store.image}`} alt={store.store_name} />
                <h3 className="store-title">{store.store_name}</h3>
                <span className="store-owner">By: {store.owner}</span>
                <p className="store-description">{store.description}</p>
                {hasMapLocation(store) && (
                    <div className="store-location-details">
                        <strong>Location</strong>
                        <span>{store.location_name}</span>
                        <a
                            href={buildGoogleMapsUrl(store.latitude, store.longitude)}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Show on Google Maps
                        </a>
                    </div>
                )}
                <div className="store-card-footer">
                    <span className="store-category-tag">{store.category}</span>
                    <button className="view-store-btn" onClick={() => handleViewStore(store.id)}>Visit Store</button>
                </div>
            </div>
        </div>
    )
}

export function StoresPage() {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const [viewMode, setViewMode] = useState("list");
    const navigate = useNavigate();

    const fetchStores = async () => {
      try{
        const token = localStorage.getItem('access_token');

        let response;
        if (token && token !== "null" && token !== "undefined") {
            response = await axios.get(`${API_BASE_URL}/api/store/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
            });
        }
        else{
            response = await axios.get(`${API_BASE_URL}/api/store/`);
        }

        if (!response) {
            throw new Error('Network response failure');
        }
        setStores(response.data);
        } catch (error) {
            console.error('Error fetching stores:', error);
            if (error.response?.status === 401){
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.reload();
            }
            setLoadSuccess(false);
            setStores(<p style={{ color: 'red' }}>Failed to load listings. Please try again later.</p>);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchStores();
    }, []);

    const { selectedCategory, searchTerm } = useOutletContext();

    const filteredStores = selectedCategory === "All"
        ? stores
        : stores.filter(store => store.category === selectedCategory);

    const normalizedSearch = searchTerm.trim().toLowerCase();
    const searchedStores = normalizedSearch
        ? filteredStores.filter(store =>
            [
                store.store_name,
                store.owner,
                store.description,
                store.location_name,
                store.category
            ].some(value => value?.toLowerCase().includes(normalizedSearch))
        )
        : filteredStores;

    return (
        !loadSuccess ? stores :
        loading ? <p>Loading stores...</p> :
        <main className="stores-main-content">
            <div className="stores-grid-header">
                <h2>Registered Student Stores</h2>
                <div className="stores-view-toggle" role="group" aria-label="Store view">
                    <button
                        type="button"
                        className={viewMode === "list" ? "active" : ""}
                        onClick={() => setViewMode("list")}
                    >
                        List
                    </button>
                    <button
                        type="button"
                        className={viewMode === "map" ? "active" : ""}
                        onClick={() => setViewMode("map")}
                    >
                        Nearby Map
                    </button>
                </div>
            </div>
            {searchedStores.length === 0 ? (
                <div className="no-stores-message">
                    <p>No stores currently registered.</p>
                </div>
            ) : viewMode === "map" ? (
                <NearbyStoresMap
                    stores={searchedStores}
                    onVisitStore={(storeId) => navigate(`../VisitStore/${storeId}`)}
                />
            ) : (
                <div className="stores-grid">
                    {searchedStores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </div>
            )}
        </main>
    )
}
