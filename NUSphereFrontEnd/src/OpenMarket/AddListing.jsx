import { useState } from "react";
import { API_BASE_URL } from "../config.js";

function ListingCard({ listing }) {
        return (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
            <img 
                src={listing.image} 
                alt={listing.title} 
                style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} 
            />
            <h3>{listing.title}</h3>
            <p>${listing.price}</p>
        </div>
    );
}

export function AddListingForm() {
    const [item_name, setName] = useState("");
    const [item_price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [item_quantity, setQuantity] = useState("");
    const [item_description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const logInToken = localStorage.getItem('access_token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("item_name", item_name);
        formData.append("item_price", item_price);
        formData.append("category", '1');
        formData.append("item_quantity", item_quantity);
        formData.append("item_description", item_description);

        if (imageFile) {
            formData.append("image", imageFile);
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/listings/`, {
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${logInToken}`,
                },
            });

            if (response.ok) {
                alert("Listing added locally successfully!");
            }else {
                const errorData = await response.json();
                console.error("Django Validation Errors:", errorData);
                alert(`Failed: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error("Error saving listing:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', color: 'white' }}>
            <input type="text" placeholder="Item Name" value={item_name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" placeholder="Price" value={item_price} onChange={(e) => setPrice(e.target.value)} required />
            <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} required />
            <input type="number" placeholder="Quantity" value={item_quantity} onChange={(e) => setQuantity(e.target.value)} required />
            <textarea placeholder="Description" value={item_description} onChange={(e) => setDescription(e.target.value)} />
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])} // Captures the single chosen file
            />

            <button type="submit">Upload Listing</button>
        </form>
    );
}