import { useLocation, useNavigate } from "react-router-dom";

const routesWithoutBackButton = new Set([
    "/",
    "/login",
    "/register",
    "/open-market",
    "/stores",
]);

function getFallbackPath(pathname) {
    const storeRoutes = ["/add-store", "/mystores", "/addproduct", "/visitstore"];
    return storeRoutes.some((route) => pathname.startsWith(route)) ? "/stores" : "/open-market";
}

export function BackButton() {
    const location = useLocation();
    const navigate = useNavigate();
    const pathname = location.pathname.toLowerCase();

    if (routesWithoutBackButton.has(pathname)) {
        return null;
    }

    const goBack = () => {
        if ((window.history.state?.idx ?? 0) > 0) {
            navigate(-1);
            return;
        }

        navigate(getFallbackPath(pathname), { replace: true });
    };

    return (
        <div className="back-navigation">
            <button type="button" onClick={goBack}>Back</button>
        </div>
    );
}
