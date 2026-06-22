import { useState } from "react";
import { API_BASE_URL } from "../config.js";
import './StoresPage.css';

function StoreCard({ store }) {
    return (
        <div className="store-card">
            <div className="store-card-body">
                <h3 className="store-title">{store.name}</h3>
                <span className="store-owner">By: {store.owner}</span>
                <p className="store-description">{store.description}</p>
                <div className="store-card-footer">
                    <span className="store-category-tag">{store.category}</span>
                    <button className="view-store-btn">Visit Store</button>
                </div>
            </div>
        </div>
    )
}

export function StoresPage() {
    const [stores, setStores] = useState([
        {
            id: 1,
            name: "Corner Cafe",
            owner: "Danvers (DSA '25)",
            description: "Home-made Matcha, Hojicha and Latte Art",
            category: "Food"
        },
        {
            id: 2,
            name: "Computing Notes Exchange",
            owner: "Jeff (CS '26)",
            description: "Collated study materials for Computing Students",
            category: "Academics"
        }
    ])

    return (
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
                    {stores.map((store) => (
                        <StoreCard key={store.id} store={store} />
                    ))}
                </div>
            )}
        </main>
    )
}