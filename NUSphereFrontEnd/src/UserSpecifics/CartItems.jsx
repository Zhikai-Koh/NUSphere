import { useContext } from 'react';
import { API_BASE_URL } from "../config.js";
import { CartContext } from './CartContext.jsx';
import './CartItems.css';
import { SelectQuantityCart } from './SelectQuantityCart.jsx';



function CartItems({ data }) {
  const { handleRemoveFromCart } = useContext(CartContext);
  const { handleCheckOut } = useContext(CartContext);
  const { getListingItem } = useContext(CartContext);
  const { updateLocalItemQuantity } = useContext(CartContext);

  const checkAppropriateQuantity = async (product_id, quantity, product_type) => {
      const listingItem = await getListingItem(product_id, product_type)
      if (!listingItem) {
          alert("Could not verify available quantity. Please try again.")
          return
      }

      if(quantity > listingItem.item_quantity){
          alert("Input quantity is more than available quantity! Only " + listingItem.item_quantity + " available!")
      }else if(quantity < 1){
          alert("Please select more than 1 item to check out.")
      }
      else{
      handleCheckOut(product_id, quantity,product_type)
      }
  }

  if (data == "No Token") {
    return <p style={{ color: "red" }}>Please Log In To Access Your Cart</p>;
  }

  if (data.length === 0) {
    return <p>Your cart is empty</p>;
  }

  return (
    <>
      <section className="cart-page">
        <div className="cart-header">
          <h2>Cart Items</h2>
          <span>{data.length} item{data.length === 1 ? "" : "s"}</span>
        </div>

          <ul className="cart-list">
              {data.map((cartItem) => (
                  <li key={cartItem.id} className="cart-item" >
                      {cartItem.product_details.image && (
                          <img 
                          className="cart-item-image"
                          src={cartItem.product_details.image.startsWith('http') ? cartItem.product_details.image : `${API_BASE_URL}${cartItem.product_details.image}`}
                          alt={cartItem.product_details.item_name}
                          />
                      )}

                      <div className="cart-item-details">
                        <h3>{cartItem.product_details.item_name}</h3>
                      </div>

                      <div>
                        <SelectQuantityCart product_id={cartItem.product_details.id} input_Quantity={parseInt(cartItem.quantity)} updateQty={(productId, qty, product_type) => updateLocalItemQuantity(productId, qty, product_type)} product_type={cartItem.product_details.type}/>
                      </div>

                      <div className="cart-item-price">
                        <div style = {{ color: "var(--text-muted)"}}>Price: </div>
                        ${parseFloat(cartItem.product_details.item_price).toFixed(2)}
                      </div>

                      <div className="cart-item-actions">
                        <button onClick={() => checkAppropriateQuantity(cartItem.product_details.id, cartItem.quantity, cartItem.product_details.type)}>Check Out</button>
                        <button onClick={() => handleRemoveFromCart(cartItem.product_details.id, cartItem.product_details.type)}>Remove</button>
                      </div>
                      
                  </li>
              ))}
          </ul>
          <div className ="checkout-button">

          </div>
      </section>
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
