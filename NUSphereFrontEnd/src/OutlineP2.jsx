import { createContext, useState, useEffect, useRef } from "react";
import nusphereLogo from "./assets/NUSphereLogo.png";
import nusphereName from "./assets/NUSphereName.png";
import electronicsImage from "./assets/Categories/Electronics.jpg";
import clothingImage from "./assets/Categories/Clothes.jpg";
import cartIcon from "./assets/CartIcon.png";
import notificationIcon from "./assets/NotificationIcon.jpg";
import profileIcon from "./assets/ProfilePhotoIcon.png";

const categories = [
    { name: 'Electronics', image: electronicsImage },
    { name: 'Clothing', image: clothingImage },
];

// --- SHARED STYLES ---
const navButtonStyle = {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
};

const iconStyle = {
    width: '28px',
    height: '28px',
    objectFit: 'contain'
};

// --- CATEGORY CARD COMPONENT ---
function CategoryCards({ categoryName, categoryImage }) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f9f9f9',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '20px',
            boxSizing: 'border-box',
            color: 'black',
            width: '250px',
            flexShrink: 0,
        }}>
            <img 
                src={categoryImage} 
                alt={`${categoryName} Image`} 
                style={{ 
                    width: '100%', 
                    height: '150px', 
                    borderRadius: '10px',
                    objectFit: 'cover' 
                }} 
            />
            <div style={{ 
                marginTop: '12px', 
                fontWeight: '500',
                fontSize: '16px',
                textAlign: 'left'
            }}>
                {categoryName}
            </div>
        </div>
    );
}

// --- MAIN OUTLINE PAGE COMPONENT ---
export function Outline() {
    const searchBar = useRef();

    return (
        <>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                backgroundColor: '#f0f0f0', 
                minHeight: '100vh',
                minHeight: '100dvh' 
            }}>

                {/* --- HEADER ZONE --- */}
                <div style={{ 
                    display: 'flex',
                    width: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',       // Keeps the clustered inner nav row perfectly centered
                    justifyContent: 'center',
                    backgroundColor: '#ded9ca', 
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
                    padding: '20px 24px',   
                    boxSizing: 'border-box',
                }}>
                    
                    {/* TOP ROW: Compact Navigation Cluster Layout */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center', // FIXED: Centers the group instead of shooting them to the edges
                        width: '100%',
                        maxWidth: '750px',        // Strict boundary containing the top element zone
                        gap: '32px'               // Controlled spacing between the logo block and outer action items
                    }}>
                        
                        {/* Left Item: Profile */}
                        <button style={navButtonStyle}>
                            <img src={profileIcon} alt="Profile" style={iconStyle} />
                        </button>

                        {/* Center Item: Branding Identity Wrapper */}
                        <a href="#product" style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            textDecoration: 'none',
                            gap: '10px',
                            flexShrink: 0
                        }}>
                            <img src={nusphereLogo} alt="NUSphere Logo" style={{ width: '42px', height: '42px', objectFit: 'contain' }}/>
                            <img src={nusphereName} alt="NUSphere Name" style={{ height: '26px', width: 'auto', objectFit: 'contain' }}/>
                        </a>

                        {/* Right Items: Cart and Notification Group */}
                        <div style={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            alignItems: 'center',
                            gap: '16px',
                            flexShrink: 0
                        }}>
                            <button style={navButtonStyle}>
                                <img src={cartIcon} alt="Cart" style={iconStyle} />
                            </button>
                            <button style={navButtonStyle}>
                                <img src={notificationIcon} alt="Notifications" style={iconStyle} />
                            </button>
                        </div>

                    </div>

                    {/* BOTTOM ROW: Search Pill Input */}
                    <form 
                        onClick={() => searchBar.current.focus()}
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            width: '100%',
                            maxWidth: '500px', 
                            marginTop: '20px', 
                            borderRadius: '120px',
                            backgroundColor: '#ffffff', 
                            border: '2px solid #000000', 
                            padding: '0 20px',
                            boxSizing: 'border-box',
                            height: '44px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)'
                        }}
                    >
                        <input 
                            ref={searchBar} 
                            type="text" 
                            placeholder="Search for products..." 
                            style={{
                                width: '100%',
                                height: '100%',
                                backgroundColor: 'transparent',
                                border: 'none',
                                outline: 'none',
                                fontSize: '16px',
                                color: 'black'
                            }}
                        />
                    </form>
                </div>

                {/* --- MAIN PAGE CONTENT ZONE --- */}
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'start', 
                    padding: '32px 20px',
                    boxSizing: 'border-box'
                }}>
                    <h1 style={{ fontSize: '1.75em', fontWeight: '700', marginBottom: '20px', color: '#222' }}>
                        Categories
                    </h1>
                    
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '20px',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        width: '100%',
                        paddingBottom: '12px',
                        scrollbarWidth: 'none', 
                    }}>
                        {categories.map((category, index) => (
                            <CategoryCards
                                key={index}
                                categoryName={category.name}
                                categoryImage={category.image}
                            />
                        ))}
                    </div>
                </div>

            </div>
        </>
    );
}