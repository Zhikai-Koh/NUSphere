import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config.js";
import "../OpenMarket/Listings.css";

export function PendingSales() {
    const [activeTab, setActiveTab] = useState("all");
    const [pendingSales, setPendingSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadSuccess, setLoadSuccess] = useState(true);
    const token = localStorage.getItem('access_token');
    const navigate = useNavigate();

    const fetchPendingSales = async () => {
        try {
            const [marketResponse, storeResponse] = await Promise.all([
                axios.get(`${API_BASE_URL}/api/listings/confirmsold/`, {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get(`${API_BASE_URL}/api/store/orders/`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);

            const marketSales = marketResponse.data.map((sale) => ({
                ...sale,
                source_type: "listing",
                source_label: "Open Market",
                id: sale.listing_id
            }));

            const storeSales = storeResponse.data.map((sale) => ({
                ...sale,
                source_type: "store_product",
                source_label: "Store",
                id: sale.product_id
            }));

            setPendingSales([...marketSales, ...storeSales]);
        } catch (error) {
            console.error("Error fetching pending sales:", error);
            setLoadSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    const confirmSale = async (sale) => {
        try {
            if (sale.source_type === "listing") {
                await axios.post(`${API_BASE_URL}/api/listings/confirmsold/`, {
                    product_id: sale.listing_id,
                    buyer: sale.buyer
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post(`${API_BASE_URL}/api/store/orders/${sale.store_id}`, {
                    product_id: sale.product_id,
                    buyer: sale.buyer
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            alert("Sale Successfully Confirmed!");
            fetchPendingSales();
        } catch (error) {
            console.error("Confirmation of sale failed:", error);
            alert(error.response?.data?.error || "Failed to confirm sale.");
        }
    };

    useEffect(() => {
        if (token) {
            fetchPendingSales();
        } else {
            setLoading(false);
            setLoadSuccess(false);
        }
    }, []);

    const displayedSales = pendingSales.filter((sale) => {
        if (activeTab === "market") {
            return sale.source_type === "listing";
        }
        if (activeTab === "store") {
            return sale.source_type === "store_product";
        }
        return true;
    });

    const goToSource = (sale) => {
        if (sale.source_type === "store_product") {
            navigate(`/MyStores/${sale.store_id}`);
        } else {
            navigate('/PersonalListings');
        }
    };

    return (
        <div className="pending-listing-container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <h2>Pending Sales</h2>

            <div className="tab-navigation" style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "2px solid #e2e8f0", paddingBottom: "10px" }}>
                <button onClick={() => setActiveTab("all")} style={{
                    padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600",
                    background: activeTab === "all" ? "#2563eb" : "transparent",
                    color: activeTab === "all" ? "#fff" : "#64748b"
                }}>
                    All ({pendingSales.length})
                </button>
                <button onClick={() => setActiveTab("market")} style={{
                    padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600",
                    background: activeTab === "market" ? "#2563eb" : "transparent",
                    color: activeTab === "market" ? "#fff" : "#64748b"
                }}>
                    Open Market ({pendingSales.filter((sale) => sale.source_type === "listing").length})
                </button>
                <button onClick={() => setActiveTab("store")} style={{
                    padding: "10px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "600",
                    background: activeTab === "store" ? "#2563eb" : "transparent",
                    color: activeTab === "store" ? "#fff" : "#64748b"
                }}>
                    Stores ({pendingSales.filter((sale) => sale.source_type === "store_product").length})
                </button>
            </div>

            {!loadSuccess ? <p style={{ color: "red" }}>Failed to load pending sales. Please try again later.</p> :
            loading ? <p>Loading pending sales...</p> :
            displayedSales.length === 0 ? <h2>No pending sales available</h2> :
            <div className="my-listings-grid">
                {displayedSales.map((sale) => (
                    <div key={`${sale.source_type}-${sale.id}-${sale.buyer}`} className="listing-card">
                        {sale.image && (
                            <img src={sale.image.startsWith('http') ? sale.image : `${API_BASE_URL}${sale.image}`}
                            alt={sale.item_name}
                            className="listing-image"
                            />
                        )}

                        <h4 className="card-title">
                            {sale.item_name}
                        </h4>

                        <div className="order-source-row">
                            <span className={`order-source-badge ${sale.source_type === "store_product" ? "store" : "market"}`}>
                                {sale.source_label}
                            </span>
                            {sale.store_name && (
                                <span className="order-source-meta">{sale.store_name}</span>
                            )}
                        </div>

                        <div className="card-quantity">
                            Buyer: <strong>{sale.buyer}</strong>
                        </div>

                        <div className="card-quantity">
                            Quantity: <strong>{sale.quantity}</strong>
                        </div>

                        <div className="price-label">
                            <div>Unit Price: </div>
                            <div className="card-price">
                                ${parseFloat(sale.item_price).toFixed(2)}
                            </div>
                        </div>

                        <div className="price-label">
                            <div>Total Price: </div>
                            <div className="card-price">
                                ${parseFloat(sale.item_price * sale.quantity).toFixed(2)}
                            </div>
                        </div>

                        <div className="card-footer">
                            <button onClick={() => confirmSale(sale)} style={{ backgroundColor: "#11ac38ff" }}>
                                Confirm Sale
                            </button>
                            <button onClick={() => goToSource(sale)}>
                                {sale.source_type === "store_product" ? "Go to Store" : "Go to Listing"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>}
        </div>
    );
}
