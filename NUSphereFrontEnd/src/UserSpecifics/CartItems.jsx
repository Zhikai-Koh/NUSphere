import { useState, createContext, useContext, useEffect} from 'react';
import { API_BASE_URL } from "../config.js";
import { CartContext } from './CartContext.jsx';


function CartItems({ data }) {
    return (
          data.length === 0 ? <h2 style = {{ margin: '20px', fontSize: '48px', color: 'black' }}>Your cart is empty</h2> :
        <>
          <h2 style={{ margin: '20px', fontSize: '48px', color: 'black' }}>Cart Items</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
              {data.map((cartItem) => (
                  <li key={cartItem.id} style={{ display: 'flex', flexDirection: 'row', marginBottom: '20px', fontSize: '24px', color: 'black' }}>
                      {cartItem.product_details.image && (
                          <img src={`${API_BASE_URL}${cartItem.product_details.image}`} alt={cartItem.product_details.item_name} style={{ width: '100px', height: 'auto', marginBottom: '10px' }} />
                      )}
                      {cartItem.product_details.item_name} - Quantity: {cartItem.quantity} - Price: ${cartItem.product_details.item_price}
                  </li>
              ))}
          </ul>
        </>
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