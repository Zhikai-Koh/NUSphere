import {createContext, useState, useEffect, useRef} from "react";
import {Link, Outlet} from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import { CartButton } from "../UserSpecifics/CartButton.jsx"

// Components
import { ProfileDropdown } from "../LoginPage/ProfileDropDown";

// Assets
import nusphereLogo from "../assets/NUSphereLogo.png";
import nusphereName from "../assets/NUSphereName.png";
import bannerImage from "../assets/MainBanner.jpg";
import allImage from "../assets/Categories/All.png"
import electronicsImage from "../assets/Categories/Electronics.png";
import furnitureImage from "../assets/Categories/Furniture.png";
import academicsImage from "../assets/Categories/Academics.png";
import clothingImage from "../assets/Categories/Clothes.png";
import dormImage from "../assets/Categories/Dorm.png";
import serviceImage from "../assets/Categories/Service.png";
import foodImage from "../assets/Categories/Food.png";
import othersImage from "../assets/Categories/Others.png";
import cartIcon from "../assets/CartIcon.png";
import notificationIcon from "../assets/NotificationIcon.png";
import profileIcon from "../assets/ProfilePhotoIcon.png";
import searchIcon from "../assets/SearchIcon.png";

import "./Outline.css";

const categories = [
    { name: 'All', image: allImage },
    { name: 'Electronics', image: electronicsImage },
    { name: 'Fashion', image: clothingImage },
    { name: 'Furniture', image: furnitureImage },
    { name: 'Academics', image: academicsImage },
    { name: 'Dorm Living', image: dormImage },
    { name: 'Services & Collaboration', image: serviceImage },
    { name: 'Food', image: foodImage },
    { name: 'Others', image: othersImage }
];

function CategoryCards({categoryName, categoryImage, isActive, onClick}) {
    return(
        <div 
            className={`category-card ${isActive ? "active" : ""}`}
            onClick={onClick}
            style={{ cursor: "pointer", fontWeight: isActive ? "bold" : "normal" }}
        >
            <img src={categoryImage} alt={`${categoryName} Image`} />
            {categoryName}
        </div>
    )
}

export function Outline() {
    const searchBar = useRef(null)
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
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

        if (token) {
            fetchProfile();
        }
    }, []);


    return(
        <div className="outline-page">
            <section className="main-banner"
                style={{ "--banner-image": `url(${bannerImage})` }}
            >
                <div className="main-banner-inner">
                    
                    <div className="banner-brand-row">
                    
                        <ProfileDropdown user={currentUser} style={{ width: '10%', height: 'auto', marginRight: '20px' }}/>                    <img className="nusphere-logo" src={nusphereLogo} alt="NUSphere Logo" />
                        <img className="nusphere-name" src={nusphereName} alt="NUSphere Name" />
                        <CartButton />
                        <img className="notification-icon" src={notificationIcon} alt="Notification Icon" />
                    </div>

                    <form 
                        className="banner-search"
                        onClick = {() => searchBar.current.focus()}
                        onSubmit={(e) => e.preventDefault()}
                    >
                        <input
                            ref={searchBar}
                            type="text"
                            placeholder="Search for products..."
                        />
                        <img src={searchIcon} alt="Search Icon" />
                    </form>
                </div>
            </section>

            <main className="main-content-wrapper">
                <aside className="categories-bar">
                    <h1>Categories</h1>
                    <div className="category-row">                        
                        {categories.map((category, index) => (
                            <CategoryCards
                                key={index}
                                categoryName={category.name}
                                categoryImage={category.image}
                                isActive={selectedCategory === category.name}
                                onClick={() => setSelectedCategory(category.name)}
                            />
                        ))}
                    </div>
                </aside>

                <section className="page-content">
                        <Outlet context={{ selectedCategory}} />
                </section>
            </main>
        </div>
    );
}
