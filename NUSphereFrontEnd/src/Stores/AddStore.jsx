import { useState } from "react";
import { API_BASE_URL } from "../config.js";
import '../OpenMarket/AddListing.css';
import { useNavigate } from "react-router-dom";

export function ListingCard({ listing }) {
        return (
        <div className="listing-card">
            <img 
                src={listing.image.startsWith('http') ? listing.image : `${API_BASE_URL}${listing.image}`}
                alt={listing.title} 
                className="listing-image"
            />
            <h3>{listing.title}</h3>
            <p>${listing.price}</p>
        </div>
    );
}

export function AddStoreForm() {
    const [shop_name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [item_description, setDescription] = useState("");
    const [imageFile, setImageFile] = useState(null);

    const navigate = useNavigate()
    const logInToken = localStorage.getItem('access_token');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (category === "") {
            alert("Please select a category.");
            return;
        }
        if (!imageFile) {
            alert("Please upload a store cover image.");
            return;
        }

        const formData = new FormData();
        formData.append("store_name", shop_name);
        formData.append("category", category);
        formData.append("description", item_description);

        if (imageFile) {
            formData.append("image", imageFile);
        }
        try {
            const response = await fetch(`${API_BASE_URL}/api/store/`, {
                method: "POST",
                body: formData,
                headers: {
                    'Authorization': `Bearer ${logInToken}`,
                },
            });

            if (response.ok) {
                alert("Store created successfully!");
                navigate("/MyStores")
            }else {
                const errorData = await response.json();
                console.error("Django Validation Errors:", errorData);
                alert(`Failed: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error("Error creating store:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="add-listing-form">
            <input type="text" placeholder="Store Name" value={shop_name} onChange={(e) => setName(e.target.value)} required />
            
            <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Furniture">Furniture</option>
                <option value="Academics">Academics</option>
                <option value="Dorm Living">Dorm Living</option>
                <option value="Services & Collaboration">Services & Collaboration</option>
                <option value="Food">Food</option>
                <option value="Others">Others</option>
            </select>
            
            <textarea placeholder="Description" value={item_description} onChange={(e) => setDescription(e.target.value)} />
            <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => setImageFile(e.target.files[0])}
            />
            <button type="submit">Create Store</button>
        </form>
    );
}
