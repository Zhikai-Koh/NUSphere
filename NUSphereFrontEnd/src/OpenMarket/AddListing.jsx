import { useState } from "react";
import { API_BASE_URL } from "../config.js";
import './AddListing.css';

export function ListingCard({ listing }) {
        return (
        <div className="listing-card">
            <img 
                src={listing.image} 
                alt={listing.title} 
                className="listing-image"
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

        if (category === "") {
            alert("Please select a category.");
            return;
        }

        const formData = new FormData();
        formData.append("item_name", item_name);
        formData.append("item_price", item_price);
        formData.append("category", category);
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
        <form onSubmit={handleSubmit} className="add-listing-form">
            <input type="text" placeholder="Item Name" value={item_name} onChange={(e) => setName(e.target.value)} required />
            <input type="number" placeholder="Price" value={item_price} onChange={(e) => setPrice(e.target.value)} required />
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Furnitures">Furnitures</option>
                <option value="Academics">Academics</option>
                <option value="Dorm Living">Dorm Living</option>
                <option value="Services & Collaboration">Services & Collaboration</option>
                <option value="Food">Food</option>
                <option value="Others">Others</option>

            </select>
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