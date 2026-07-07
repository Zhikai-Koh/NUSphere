import React, { useContext, useState ,useEffect, useRef} from 'react';
import { CartContext } from "../UserSpecifics/CartContext";
import axios from "axios"
import { API_BASE_URL } from '../config';


export function SelectQuantityCart({product_id, input_Quantity, updateQty, product_type}) {
    const [quantity, setQuantity] = useState(Number(input_Quantity) || 1);
    const { getListingItem } = useContext(CartContext);

    useEffect(() => {
        if (input_Quantity !== undefined && input_Quantity !== null) {
            setQuantity(Number(input_Quantity));
        }
    }, [input_Quantity]);

    const saveToCart= async (productId, qty) => {
        const listingItem= await getListingItem(product_id,product_type)
        if (!listingItem) {
            alert("Could not verify available quantity. Please try again.")
            setQuantity(Number(input_Quantity) || 1)
            return
        }

        const listingItemQty = listingItem.item_quantity

        if(quantity > listingItemQty){
            alert("Max amount of item is: " + listingItemQty)
            setQuantity(listingItemQty)
            qty = listingItemQty
        }
        if(qty < 1 || isNaN(qty)){
            setQuantity(1)
            qty = 1
        }

        const token = localStorage.getItem('access_token');
        if (!token) {
            alert("Please log in to add items to your cart!");
            return;
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/api/cart/`, {
                product_id: productId,
                quantity: qty,
                post_type: "change",
                product_type: product_type

            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Add item transaction failed:", error);
            alert(error.response?.data?.error || "Failed to update cart quantity.");
        }
        updateQty(productId, qty, product_type)
    }

    return (
        <div>
            <div onClick={(e) => e.stopPropagation()} style={{display:"flex", flexDirection:"column", alignItems:"center"}}>
                <h3 style ={{fontSize:"18px", marginRight:"5px", color: "var(--text-muted)", margin:"0"}}>Quantity</h3>
                <form style = {{height:"100%"}}>
                    <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity((e.target.value))}
                        onBlur={(e) => saveToCart(product_id, parseInt(e.target.value))}
                        style={{ 
                            width: "55px",
                            textAlign: "center",
                            padding: "6px 4px",
                            borderRadius: "6px",
                            border: "1px solid #cbd5e1",
                            fontSize: "16px",
                            marginLeft: "5px"
                        }}
                    />
                </form>
            </div>
            {/* <div>
                <button type="button" onClick={() => checkAppropriateQuantity()}>Check Out</button>
            </div> */}

        </div>
    );
    }
