import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../config.js";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState("No Token");
    const token = localStorage.getItem('access_token'); 

    const getListingItem = async (productId) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/listings/checkout/`,{
                headers: { Authorization: `Bearer ${token}` },
                params: { product_id:productId }
            });

            return response.data

        } catch (error) {
            console.error("Error getting listing quantity: ", error);
        }
    }

    const updateLocalItemQuantity = (productId, newQty) => {
        setCartItems(prevItems => 
            prevItems.map(item => 
                item.product_details.id === productId 
                ? { ...item, quantity: newQty } 
                : item
            )
        );
    };

    const handleCheckOut = async (productId, qty) => {
        if (!token) {
            alert("Please log in to check out items in your cart!");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/listings/checkout/`, {
                product_id: productId,
                quantity: qty
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert(qty + " Items Successfully Checked Out")

            handleRemoveFromCart(productId)
        } catch (error) {
            console.error("Checking out cart failed:", error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchCart();
        } else {
            setCartItems("No Token"); // Clear cart if user logs out
        }
    }, [token]);

    const fetchCart = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/cart/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data.items);
        } catch (error) {
            console.error("Could not load database cart data:", error);
        }
    };

    const handleAddToCart = async (productId, qty = 1, product_type = "listing") => {
        if (!token) {
            alert("Please log in to add items to your cart!");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/cart/`, {
                product_id: productId,
                quantity: qty,
                post_type: "add",
                product_type: product_type
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCartItems(response.data.items);
            alert("Item Successfully Added to Cart")
        } catch (error) {
            console.error("Add item transaction failed:", error);
            console.log(response.error)
        }
    };

    const handleRemoveFromCart = async (product_id) => {
        if (!token) {
            alert("Please log in to remove items from your cart!");
            return;
        }

        try {
            const response = await axios.delete(`${API_BASE_URL}/api/cart/`,{
                headers: { Authorization: `Bearer ${token}` },
                data: {product_id: product_id,
                    product_type: "listing"
                }
            });
            setCartItems(response.data.items);
        } catch (error) {
            console.error("Remove item transaction failed:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, handleAddToCart, fetchCart, handleRemoveFromCart, handleCheckOut, getListingItem, updateLocalItemQuantity}}>
            {children}
        </CartContext.Provider>
    );
}