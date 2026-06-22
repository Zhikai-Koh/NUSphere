import { CartProvider } from "../UserSpecifics/CartContext.jsx";

export function AllProviders({ children }) {
    const providers = [
        CartProvider,
    ];

    return providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
    }, children);
}