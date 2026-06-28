import { useState } from "react";
import { API_BASE_URL } from "../config.js";
import '../OpenMarket/AddListing.css';
import { useNavigate, useParams} from "react-router-dom";

export function AddProductForm() {
    const [item_name, setName] = useState("");
    const [item_price, setPrice] = useState("");
    const [item_quantity, setQuantity] = useState("");
    const [item_description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const {storeId} = useParams();


    const navigate = useNavigate()
    const logInToken = localStorage.getItem('access_token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("item_name", item_name);
        formData.append("item_price", item_price);
        formData.append("item_quantity", item_quantity);
        formData.append("item_description", item_description);

        if (imageFile) {
            formData.append("image", imageFile);
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/store/storeitems/${storeId}`, {
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${logInToken}`,
                },
            });

            if (response.ok) {
                alert("Product added successfully!");
                navigate("/MyStores/" + storeId);
            }else {
                const errorData = await response.json();
                console.error("Django Validation Errors:", errorData);
                alert(`Failed: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-listing-form">
            <input type="text" placeholder="Item Name" value={item_name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" placeholder="Price" value={item_price} onChange={(e) => setPrice(e.target.value)} required />
            <input type="number" placeholder="Quantity" value={item_quantity} onChange={(e) => setQuantity(e.target.value)} required />
            <textarea placeholder="Description" value={item_description} onChange={(e) => setDescription(e.target.value)} />
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button type="submit">Upload Listing</button>
        </form>
    );
}