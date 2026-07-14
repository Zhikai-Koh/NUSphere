import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import "./SellerAnalytics.css";

const currencyFormatter = new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
});

function formatCurrency(value) {
    const amount = Number(value);
    return currencyFormatter.format(Number.isFinite(amount) ? amount : 0);
}

function MetricCard({ label, value, hint, tone = "blue" }) {
    return (
        <article className={`analytics-metric analytics-metric--${tone}`}>
            <span className="analytics-metric__label">{label}</span>
            <strong className="analytics-metric__value">{value}</strong>
            {hint && <span className="analytics-metric__hint">{hint}</span>}
        </article>
    );
}

export function SellerAnalytics() {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const token = localStorage.getItem("access_token");

    const fetchAnalytics = useCallback(async (signal) => {
        if (!token) return;

        setLoading(true);
        setError("");

        try {
            const response = await axios.get(`${API_BASE_URL}/api/seller/analytics/`, {
                headers: { Authorization: `Bearer ${token}` },
                signal,
            });
            setAnalytics(response.data);
        } catch (requestError) {
            if (requestError.code !== "ERR_CANCELED") {
                setError("Unable to load your seller analytics.");
            }
        } finally {
            if (!signal?.aborted) setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        const controller = new AbortController();
        const timer = window.setTimeout(() => fetchAnalytics(controller.signal), 0);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [fetchAnalytics]);

    const summary = analytics?.summary ?? {};
    const inventory = analytics?.inventory ?? {};
    const lowStock = analytics?.low_stock ?? [];
    const bestSelling = useMemo(
        () => [...(analytics?.best_selling ?? [])].sort(
            (first, second) => second.sold_count - first.sold_count,
        ),
        [analytics],
    );

    if (!token) {
        return <p className="analytics-message analytics-message--error">Please log in to view seller analytics.</p>;
    }

    if (loading) {
        return <p className="analytics-message" aria-live="polite">Loading seller analytics…</p>;
    }

    if (error) {
        return (
            <div className="analytics-error" role="alert">
                <div>
                    <strong>Analytics unavailable</strong>
                    <p>{error}</p>
                </div>
                <button type="button" onClick={() => fetchAnalytics()}>Try again</button>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <section className="analytics-dashboard" aria-labelledby="seller-analytics-title">
            <header className="analytics-header">
                <div>
                    <span className="analytics-eyebrow">Seller overview</span>
                    <h2 id="seller-analytics-title">Your business at a glance</h2>
                    <p>Track sales, orders, and inventory health.</p>
                </div>
                <span className="analytics-live-badge">Live data</span>
            </header>

            <div className="analytics-metrics">
                <MetricCard label="Total revenue" value={formatCurrency(summary.total_revenue)} hint="Across market and stores" />
                <MetricCard label="Pending orders" value={summary.pending_orders ?? 0} hint="Awaiting completion" tone="amber" />
                <MetricCard label="Completed orders" value={summary.completed_orders ?? 0} hint="Successfully fulfilled" tone="green" />
                <MetricCard label="Open stores" value={`${summary.open_stores ?? 0} / ${summary.stores ?? 0}`} hint="Currently accepting orders" tone="violet" />
            </div>

            <div className="analytics-details">
                <article className="analytics-panel">
                    <header className="analytics-panel__header">
                        <h3>Inventory snapshot</h3>
                        <p>Units by sales channel and status</p>
                    </header>
                    <dl className="inventory-list">
                        <div><dt>Market unsold</dt><dd>{inventory.market_unsold ?? 0}</dd></div>
                        <div><dt>Market pending</dt><dd>{inventory.market_pending ?? 0}</dd></div>
                        <div><dt>Market sold</dt><dd>{inventory.market_sold ?? 0}</dd></div>
                        <div><dt>Store stock</dt><dd>{inventory.store_stock ?? 0}</dd></div>
                    </dl>
                </article>

                <article className="analytics-panel">
                    <header className="analytics-panel__header">
                        <h3>Best-selling items</h3>
                        <p>Strongest performers across all channels</p>
                    </header>
                    {bestSelling.length === 0 ? (
                        <p className="analytics-empty">Completed sales will appear here.</p>
                    ) : (
                        <ol className="seller-ranking">
                            {bestSelling.map((item, index) => (
                                <li key={`${item.source}-${item.item_name}-${index}`}>
                                    <span className="seller-ranking__position">{index + 1}</span>
                                    <div className="seller-ranking__item">
                                        <strong>{item.item_name}</strong>
                                        <span>{item.source}</span>
                                    </div>
                                    <strong>{item.sold_count} sold</strong>
                                </li>
                            ))}
                        </ol>
                    )}
                </article>
            </div>

            <article className="analytics-panel">
                <header className="analytics-panel__header analytics-panel__header--row">
                    <div>
                        <h3>Low-stock products</h3>
                        <p>Products with three or fewer units remaining</p>
                    </div>
                    {lowStock.length > 0 && <span className="analytics-alert-count">{lowStock.length} need attention</span>}
                </header>
                {lowStock.length === 0 ? (
                    <p className="analytics-empty">All products have healthy stock levels.</p>
                ) : (
                    <div className="low-stock-grid">
                        {lowStock.map((item, index) => (
                            <div className="low-stock-item" key={`${item.store_name}-${item.item_name}-${index}`}>
                                <div><strong>{item.item_name}</strong><span>{item.store_name}</span></div>
                                <strong>{item.quantity} left</strong>
                            </div>
                        ))}
                    </div>
                )}
            </article>
        </section>
    );
}
