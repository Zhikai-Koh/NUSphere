import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const token = localStorage.getItem('access_token'); // Get user session key

    // Automatically load the database cart data the second the user loads the application
    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            setCartItems([]); // Clear local UI cart if user logs out
        }
    }, [token]);

    const fetchCart = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/api/cart/', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data.items); // Set state to your nested items array
        } catch (error) {
            console.error("Could not load database cart data:", error);
        }
    };

    const handleAddToCart = async (productId, qty = 1) => {
        if (!token) {
            alert("Please log in to add items to your cart!");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:8000/api/cart/', {
                product_id: productId,
                quantity: qty
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data.items); // React UI instantly updates!
        } catch (error) {
            console.error("Add item transaction failed:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, handleAddToCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
}