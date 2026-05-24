import {createContext, useState, useEffect, useRef} from "react";
import nusphereLogo from "./assets/NUSphereLogo.png";
import nusphereName from "./assets/NUSphereName.png";
import electronicsImage from "./assets/Categories/Electronics.jpg";
import clothingImage from "./assets/Categories/Clothes.jpg";
import cartIcon from "./assets/CartIcon.png";
import notificationIcon from "./assets/NotificationIcon.jpg";
import profileIcon from "./assets/ProfilePhotoIcon.png";
import searchIcon from "./assets/SearchIcon.png";

const categories = [
    { name: 'Electronics', image: electronicsImage },
    { name: 'Clothing', image: clothingImage },
];

function CategoryCards({categoryName, categoryImage}) {
    return(
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
            <img src={categoryImage} alt={`${categoryName} Image`} style={{ width: '100%', height: '150px', borderRadius: '10px' }} />
            {categoryName}
        </div>
    )
}

export function Outline() {
    const searchBar = useRef()
    return(
        <>
            <div style ={{ 
                display: 'flex', 
                flexDirection: 'column', 
                backgroundColor: '#f0f0f0', 
                minHeight: '100vh' }}>

                <div style = {{ 
                    display: 'flex',
                    height : 'auto',
                    width : '100%',
                    flexDirection: 'column', 
                    alignItems: 'center',
                    justifyContent: 'center', 
                    backgroundColor: '#ded9ca', 
                    padding: '20px', 
                    borderRadius: '10px', 
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    boxSizing: 'border-box',
                    }}
                >
                    <a href="#product" style = {{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "100%",
                        maxWidth:'650px'
                    }}
                >
                        <img src={profileIcon} alt="Profile Icon" style={{ width: '10%', height: 'auto', marginRight: '20px' }}/>
                        <img src={nusphereLogo} alt="NUSphere Logo" style={{ width: '20%', height: 'auto' }}/>
                        <img src={nusphereName} alt="NUSphere Name" style={{ width: '70%', height: 'auto'}}/>
                        <img src={cartIcon} alt="Cart Icon" style={{ width: '10%', height: 'auto', marginLeft: '20px' }}/>
                        <img src={notificationIcon} alt="Notification Icon" style={{ width: '10%', height: 'auto', marginLeft: '20px' }}/>
                    </a>
                    <form onClick = {() => searchBar.current.focus()}
                    
                    style = {{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        width: '100%',
                        maxWidth: '500px',
                        Height: '44px',
                        marginTop: '20px',
                        borderRadius: '120px',
                        backgroundColor: '#ded9ca',
                        border: '4px solid black',

                        boxSizing: 'border-box',
                        padding: '0 20px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.04)',
                        containerType: 'inline-size'
                        }}
                    >
                        <input ref = {searchBar} type="text" placeholder="Search for products..." style = {{
                            margin:'10px 0px 10px 10px',
                            width: '90%',
                            height: '100%',
                            backgroundColor: '#ded9ca',
                            border: 'none',
                            outline: 'none',
                            fontSize: 'clamp(14px, 3.5cqw, 20px)'
                        }}></input>
                        <img src={searchIcon} alt="Search Icon"style={{ 
                            width: 'clamp(16px, 30cqw, 48px)', 
                            height: 'auto',
                            flexShrink: 0 // Prevents the input text from squishing the icon flat
                        }}/>
                    </form>
                </div>
                <div style ={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'start', 
                    padding: '0 20px 20px 20px',
                    backgroundColor: '#f0f0f0', 
                    height: '100%',
                    minHeight: '100vh' 
                    }}
                >
                    <h1 style={{fontSize: '2em',marginBottom: '20px', color: '#333'}}>Categories</h1>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '20px',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        width: '100%',
                    }}>
                        {/* Category cards would go here */}
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
    )
}