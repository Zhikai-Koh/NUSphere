import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config.js";
import { useOutletContext, useNavigate} from "react-router-dom";
import './StoresPage.css';
import axios from "axios"

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
        console.log(response.data)
        } catch (error) {
            console.error('Error fetching stores:', error);
            if (error.response.status === 401){
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

    const { selectedCategory } = useOutletContext();

    const filteredStores = selectedCategory === "All"
        ? stores
        : stores.filter(store => store.category === selectedCategory);

    return (
        !loadSuccess ? stores :
        loading ? <p>Loading stores...</p> :
        <main className="stores-main-content">
            <div className="stores-grid-header">
                <h2>Registered Student Stores</h2>
            </div>
            {stores.length === 0 ? (
                <div className="no-stores-message">
                    <p>No stores currently registered.</p>
                </div>
            ) : (
                <div className="stores-grid">
                    {filteredStores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </div>
            )}
        </main>
    )
}