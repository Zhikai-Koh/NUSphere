import {useState, useEffect, useRef} from "react";
import {NavLink, Outlet} from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import { CartButton } from "../UserSpecifics/CartButton.jsx"
import { ChatButton } from "../Defaults/ChatButton.jsx"

// Components
import { ProfileDropdown } from "../LoginPage/ProfileDropDown";

// Assets
import nusphereLogo from "../assets/NUSphereLogo.png";
import nusphereName from "../assets/NUSphereName.png";
import electronicsImage from "../assets/Categories/Electronics.png";
import furnitureImage from "../assets/Categories/Furniture.png";
import academicsImage from "../assets/Categories/Academics.png";
import clothingImage from "../assets/Categories/Clothes.png";
import dormImage from "../assets/Categories/Dorm.png";
import serviceImage from "../assets/Categories/Service.png";
import foodImage from "../assets/Categories/Food.png";
import othersImage from "../assets/Categories/Others.png";
import searchIcon from "../assets/SearchIcon.png";

import "./Outline.css";

const categories = [
    { name: 'All' },
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
        <button
            type="button"
            className={`category-card ${isActive ? "active" : ""}`}
            onClick={onClick}
            aria-pressed={isActive}
        >
            {categoryName === "All" ? (
                <span className="category-icon category-icon-all" aria-hidden="true">
                    {Array.from({ length: 9 }, (_, index) => <i key={index} />)}
                </span>
            ) : (
                <img src={categoryImage} alt="" />
            )}
            <span className="category-label">{categoryName}</span>
        </button>
    )
}

export function Outline() {
    const searchBar = useRef(null)
    const [currentUser, setCurrentUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
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
    }, [token]);


    return(
        <div className="outline-page">
            <header className="main-banner">
                <div className="main-banner-inner">
                    <div className="brand-lockup">
                        <img className="nusphere-logo" src={nusphereLogo} alt="NUSphere Logo" />
                        <div className="brand-copy">
                            <img className="nusphere-name" src={nusphereName} alt="NUSphere Name" />
                            <span>Your Connected Campus Marketplace &amp; Ecosystem</span>
                        </div>
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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <img src={searchIcon} alt="Search Icon" />
                    </form>

                    <div className="banner-actions">
                        <CartButton />
                        <ChatButton />
                        <ProfileDropdown user={currentUser} />
                    </div>
                </div>
            </header>

            <nav className="market-tabs" aria-label="Marketplace sections">
                <div className="market-tabs-inner">
                    <NavLink to="/open-market">Open Market</NavLink>
                    <NavLink to="/stores">Stores</NavLink>
                </div>
            </nav>

            <main className="main-content-wrapper">
                <aside className="categories-bar">
                    <h2>Categories</h2>
                    <div className="category-row">                        
                        {categories.map((category) => (
                            <CategoryCards
                                key={category.name}
                                categoryName={category.name}
                                categoryImage={category.image}
                                isActive={selectedCategory === category.name}
                                onClick={() => setSelectedCategory(category.name)}
                            />
                        ))}
                    </div>
                </aside>

                <section className="page-content">
                        <Outlet context={{ selectedCategory, searchTerm }} />
                </section>
            </main>
        </div>
    );
}
