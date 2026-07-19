import "./PageState.css";

export function PageState({ title, message, actionLabel, onAction, tone = "neutral" }) {
    return (
        <section className={`page-state page-state--${tone}`} role={tone === "error" ? "alert" : "status"}>
            <h2>{title}</h2>
            {message && <p>{message}</p>}
            {onAction && (
                <button type="button" onClick={onAction}>
                    {actionLabel}
                </button>
            )}
        </section>
    );
}
