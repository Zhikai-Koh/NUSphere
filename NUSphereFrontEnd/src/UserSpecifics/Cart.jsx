import { useState, createContext, useContext, useEffect} from 'react';
import { API_BASE_URL } from "../config.js";


function CartItems({ data, loading }) {
    return (
      loading ? <p>Loading cart items...</p> :
          data.length === 0 ? <h2>Your cart is empty</h2> :
        <>
          <h2 style={{ margin: '20px', fontSize: '48px' }}>Cart Items</h2>
          <ul style={{ listStyleType: 'none', padding: 0 }}>
              {data.map((cartItem) => (
                  <li key={cartItem.id}>
                      {cartItem.item_name} - Quantity: {cartItem.quantity} - Price: ${cartItem.item_price}
                  </li>
              ))}
          </ul>
        </>
    );
}

function ItemDetails({placeholder='', itemValue, setValue}) {
  return(
        <>
          <label htmlFor="add-to-cart">{placeholder}: </label>
          <input
            type="text"
            id="add-to-cart"
            value ={itemValue}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
          /><br/>
        </>
  )
}

export function CartButton() {
  const [loadingCart, setLoadingCart] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  const [isAdding, setIsAdding] = useState(false);
  const [itemName, setValue] = useState("");
  const [itemPrice, setPrice] = useState("0.00");
  const [itemQuantity, setQuantity] = useState("1");

  const fetchCartItems = async () => {
      try{
      const response = await fetch(`${API_BASE_URL}/api/cart/`);
          if (!response.ok) {
              throw new Error('Network response failure');
          }
          const data = await response.json();
          setCartItems(data);
      } catch (error) {
          console.error('Error fetching cart items:', error);
          alert('Failed to load cart items from backend.');
      } finally {
          setLoadingCart(false);
      }
  }

  useEffect(() => {
      fetchCartItems();
  }, []);

  // Function to handle adding item to cart and sending data to backend
  const addToCart = async (e) => {
    setIsAdding(true);
    e.preventDefault();
    
    if (!itemName.trim()) {
      alert("Please enter an item name first!");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          item_name: itemName,
          quantity: itemQuantity,
          item_price: itemPrice
        }),
      });

      if (!response.ok) {
        throw new Error('Network response failure');
      }

      const data = await response.json();
      console.log('Database row generated:', data);
      alert('Item added to PostgreSQL database successfully!');
    } catch (error) {
      console.error('Transmission error:', error);
      alert('Failed to connect to backend database.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleCartClick = (e) => {
    addToCart(e);
    fetchCartItems();
  };

  return (
    <>
      <form>
        <label htmlFor="add-to-cart">Item to add to Cart:</label><br/>
        <ItemDetails placeholder="Enter Item Name" itemValue={itemName} setValue={setValue} />
        <ItemDetails placeholder="Enter Item Price" itemValue={itemPrice} setValue={setPrice} />
        <ItemDetails placeholder="Enter Item Quantity" itemValue={itemQuantity} setValue={setQuantity} />
        <button 
          onClick={e => handleCartClick(e)} 
          disabled={isAdding}
          style={{ padding: '10px 20px', cursor: 'pointer' }}
        >
          {isAdding ? 'Processing...' : 'Add to Cart'}
        </button>
      </form>
      <CartItems data = {cartItems} loading={loadingCart} />
    </>
  );
}