import {createContext, useState, useEffect, useRef} from "react";
import { Link } from "react-router-dom";
import nusphereLogo from "../assets/NUSphereLogo.png";
import nusphereName from "../assets/NUSphereName.png";
import bannerImage from "../assets/MainBanner.jpg";
import electronicsImage from "../assets/Categories/Electronics.jpg";
import clothingImage from "../assets/Categories/Clothes.jpg";
import cartIcon from "../assets/CartIcon.png";
import notificationIcon from "../assets/NotificationIcon.jpg";
import profileIcon from "../assets/ProfilePhotoIcon.png";
import searchIcon from "../assets/SearchIcon.png";
import "./Outline.css";
import { ProfileDropdown } from "../LoginPage/ProfileDropDown";
import { API_BASE_URL } from "../config.js";
import axios from "axios";

const categories = [
    { name: 'Electronics', image: electronicsImage },
    { name: 'Clothing', image: clothingImage },
];

function CategoryCards({categoryName, categoryImage}) {
    return(
        <div className="category-card">
            <img src={categoryImage} alt={`${categoryName} Image`} />
            {categoryName}
        </div>
    )
}


export function Outline() {
    const searchBar = useRef()
    const [currentUser, setCurrentUser] = useState(null);
    const token = localStorage.getItem('access_token'); 

    useEffect(() => {
        const fetchProfile = async () => {
            try {
            const response = await axios.get(`${API_BASE_URL}/api/auth/profile/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
                const userData = await response.data;
                setCurrentUser(userData);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            }
        };

        const token = localStorage.getItem('access_token');
        if (token) {
            fetchProfile();
        }
    }, []);


    return(
        <div className="outline-page">
        <section
            className="main-banner"
            style={{ "--banner-image": `url(${bannerImage})` }}
        >
            <div className="main-banner-inner">
                
                <div className="banner-brand-row">
                
                    <ProfileDropdown user={currentUser} style={{ width: '10%', height: 'auto', marginRight: '20px' }}/>                    <img className="nusphere-logo" src={nusphereLogo} alt="NUSphere Logo" />
                    <img className="nusphere-name" src={nusphereName} alt="NUSphere Name" />

                    <Link to="/cart" className="cart-link">
                        <img src={cartIcon} alt="Cart Icon" />
                    </Link>

                    <img className="notification-icon" src={notificationIcon} alt="Notification Icon" />
            </div>

            <form className="banner-search" onClick = {() => searchBar.current.focus()}>
                <input
                    ref={searchBar}
                    type="text"
                    placeholder="Search for products..."
                />
                <img src={searchIcon} alt="Search Icon" />
            </form>
        </div>
    </section>

            <section className="categories-section">
                <h1>Categories</h1>
                <div className="category-row">
                    {/* Category cards would go here */}
                    {categories.map((category, index) => (
                        <CategoryCards
                            key={index}
                            categoryName={category.name}
                            categoryImage={category.image}
                        />
                    ))}
                </div>
            </section>
        </div>
    );
}
