import cartIcon from "../assets/CartIcon.png"
import { Link } from "react-router-dom";

export function CartButton() {
    const token = localStorage.getItem('access_token');

    const handleOnClick = () => {
        if (token === null) {
            alert("Please log in to access your cart.");
        }
    };

    if (token !== null){
        return (
            <Link to="/cart" className="cart-link">
                <img src={cartIcon} alt="Cart Icon" />
            </Link>
        );
    }
    else{
        return (
            <img src={cartIcon} alt="Cart Icon" onClick={handleOnClick} />
        );
    }
    return null;
}
