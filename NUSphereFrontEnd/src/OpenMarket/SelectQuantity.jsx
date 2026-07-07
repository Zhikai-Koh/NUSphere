import React, { useContext, useState } from 'react';
import { CartContext } from "../UserSpecifics/CartContext";


export function SelectQuantity({ productid,productMaxQuantity, onClose, product_type = "listing" }) {
    // or is a fallback :o
    const [quantity, setQuantity] = useState(1 || 1);
    const {handleAddToCart} = useContext(CartContext)

    function addToCart(e){
        e.preventDefault()
        if(quantity > productMaxQuantity){
            alert("There is not enough quantity in stock! Maximum quantity is " + productMaxQuantity)
            setQuantity(productMaxQuantity)
        }else if(quantity < 1){
            alert("You can only add 1 or more item to cart!")
            setQuantity(1)
        }else{
            handleAddToCart(productid, quantity, product_type)
        }
    }

    return (
        <div>
        {/* Backdrop background click closes pop-up */}
        <div onClick={() => onClose} /> 

        {/* Pop-up Box Container */}
        <div onClick={(e) => e.stopPropagation()} style={{display:"flex", flexDirection:"row"}}>
            <h3 style ={{fontSize:"12px"}}>Select Quantity</h3>
            
            <form style={{display:"flex", flexDirection:"row"}}>
                <input 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity((e.target.value))} 
                />
                <div>
                    <button onClick={(e) => addToCart(e)}>Confirm</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </div>
            </form>
        </div>
        </div>
    );
    }