import { CartProvider } from "../UserSpecifics/CartContext.jsx";
import { ListingsProvider} from "../OpenMarket/ListingContext.jsx";

export function AllProviders({ children }) {
    const providers = [
        CartProvider,
        ListingsProvider,
    ];

    return providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
    }, children);
}