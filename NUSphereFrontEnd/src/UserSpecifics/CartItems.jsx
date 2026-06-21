import { useContext } from 'react';
import { API_BASE_URL } from "../config.js";
import { CartContext } from './CartContext.jsx';
import './CartItems.css';


function CartItems({ data }) {
  const { handleRemoveFromCart } = useContext(CartContext);

  if (data == "No Token") {
    return <p style={{ color: "red" }}>Please Log In To Access Your Cart</p>;
  }

  if (data.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <section className="cart-page">
      <div className="cart-header">
        <h2>Cart Items</h2>
        <span>{data.length} item{data.length === 1 ? "" : "s"}</span>
      </div>

        <ul className="cart-list">
            {data.map((cartItem) => (
                <li key={cartItem.id} className="cart-item">
                    {cartItem.product_details.image && (
                        <img 
                        className="cart-item-image"
                        src={`${API_BASE_URL}${cartItem.product_details.image}`}
                        alt={cartItem.product_details.item_name}
                        />
                    )}

                    <div className="cart-item-details">
                      <h3>{cartItem.product_details.item_name}</h3>
                      <p>Quantity: {cartItem.quantity}</p>
                    </div>

                    <div className="cart-item-price">
                      ${parseFloat(cartItem.product_details.item_price).toFixed(2)}
                    </div>

                    <div className="cart-item-actions">
                      <button onClick={() => handleRemoveFromCart(cartItem.product_details.id)}>Remove</button>
                    </div>
                </li>
            ))}
        </ul>
    </section>
  );
}

export function Cart() {
  const { cartItems } = useContext(CartContext);

  return (
    <>
      <CartItems data = {cartItems}/>
    </>
  );
}