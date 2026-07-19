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
            <Link to="/cart" className="cart-icon-btn" aria-label="Open cart">
                <img className="cart-icon" src={cartIcon} alt="" />
            </Link>
        );
    }
    else{
        return (
            <button type="button" className="cart-icon-btn" aria-label="Open cart" onClick={handleOnClick}>
                <img className="cart-icon" src={cartIcon} alt="" />
            </button>
        );
    }
}
