import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import "../OpenMarket/Listings.css";

function MetricCard({ label, value }) {
    return (
        <div className="listing-card">
            <div style={{ color: "#64748b", fontSize: "14px" }}>{label}</div>
            <strong style={{ fontSize: "24px", color: "#1a3644" }}>{value}</strong>
        </div>
    );
}

export function SellerAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/seller/analytics/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAnalytics(response.data);
            } catch (error) {
                console.error("Error fetching seller analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchAnalytics();
        } else {
            setLoading(false);
        }
    }, []);

    if (!token) {
        return <p style={{ color: "red" }}>Please log in to view seller analytics.</p>;
    }

    if (loading) {
        return <p>Loading seller analytics...</p>;
    }

    if (!analytics) {
        return <p style={{ color: "red" }}>Failed to load seller analytics.</p>;
    }

    const summary = analytics.summary;
    const inventory = analytics.inventory;

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <h2>Seller Analytics</h2>

            <div className="my-listings-grid" style={{ marginBottom: "24px" }}>
                <MetricCard label="Total Revenue" value={`$${parseFloat(summary.total_revenue).toFixed(2)}`} />
                <MetricCard label="Pending Orders" value={summary.pending_orders} />
                <MetricCard label="Completed Orders" value={summary.completed_orders} />
                <MetricCard label="Open Stores" value={`${summary.open_stores}/${summary.stores}`} />
            </div>

            <section style={{ marginBottom: "24px" }}>
                <h3>Inventory</h3>
                <div className="my-listings-grid">
                    <MetricCard label="Open Market Unsold" value={inventory.market_unsold} />
                    <MetricCard label="Open Market Pending" value={inventory.market_pending} />
                    <MetricCard label="Open Market Sold" value={inventory.market_sold} />
                    <MetricCard label="Store Stock" value={inventory.store_stock} />
                </div>
            </section>

            <section style={{ marginBottom: "24px" }}>
                <h3>Best Selling Items</h3>
                {analytics.best_selling.length === 0 ? <p>No completed sales yet.</p> :
                <div className="my-listings-grid">
                    {analytics.best_selling.map((item, index) => (
                        <div key={`${item.source}-${item.item_name}-${index}`} className="listing-card">
                            <span className={`order-source-badge ${item.source === "Store" ? "store" : "market"}`}>
                                {item.source}
                            </span>
                            <h4 className="card-title">{item.item_name}</h4>
                            <div className="card-quantity">Sold: <strong>{item.sold_count}</strong></div>
                        </div>
                    ))}
                </div>}
            </section>

            <section>
                <h3>Low Stock Store Products</h3>
                {analytics.low_stock.length === 0 ? <p>No low-stock store products.</p> :
                <div className="my-listings-grid">
                    {analytics.low_stock.map((item, index) => (
                        <div key={`${item.store_name}-${item.item_name}-${index}`} className="listing-card">
                            <h4 className="card-title">{item.item_name}</h4>
                            <div className="card-quantity">Store: <strong>{item.store_name}</strong></div>
                            <div className="card-quantity">Remaining: <strong>{item.quantity}</strong></div>
                        </div>
                    ))}
                </div>}
            </section>
        </div>
    );
}
