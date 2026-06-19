import { useRef } from "react";
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
    return(
        <div className="outline-page">
        <section
            className="main-banner"
            style={{ "--banner-image": `url(${bannerImage})` }}
        >
            <div className="main-banner-inner">
                
                <div className="banner-brand-row">
                
                    <img className="profile-icon" src={profileIcon} alt="Profile" />
                    <img className="nusphere-logo" src={nusphereLogo} alt="NUSphere Logo" />
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
