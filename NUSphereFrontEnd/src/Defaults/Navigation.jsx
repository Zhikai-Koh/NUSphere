import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate} from 'react-router-dom';
import { Outline } from "./Outline.jsx";
import { Listings } from "../OpenMarket/Listings.jsx";
import { LoginForm } from "../LoginPage/Login.jsx";

import { CartProvider } from "../UserSpecifics/CartContext.jsx";
import { Cart } from "../UserSpecifics/CartItems.jsx";

import { AddListingForm } from "../OpenMarket/AddListing.jsx";
import { RegistrationForm } from "../LoginPage/Registration.jsx";

import "./Navigation.css";
import { PersonalListings } from "../OpenMarket/MyListings.jsx";

function NavigateTo({page, buttonDisplay, setActivePage}) {
    
        return(
            <NavLink to={page}
            className ={({isActive}) => 
                isActive ? "bottom-nav-link active" : "bottom-nav-link"
            }
            onClick={() => setActivePage(page)}
            >
                {buttonDisplay}
            </NavLink>
        );
    }

export function NavigationBar() {
    const [activePageName, setActivePageName] = useState('open-market');

    const openMarket = <>
                            <NavigateTo page="open-market" buttonDisplay="Open Market" setActivePage={(page) => setActivePageName(page)} />
                            <NavigateTo page="add-listing" buttonDisplay="Add Listing" setActivePage={(page) => setActivePageName(page)} />
                            <NavigateTo page="shops" buttonDisplay="Shops" setActivePage={(page) => setActivePageName(page)}/>
                        </>

    const shops = <>
                        <NavigateTo page="open-market" buttonDisplay="Open Market" setActivePage={(page) => setActivePageName(page)} />
                        <NavigateTo page="visit-own-store" buttonDisplay="Visit Your Store" setActivePage={(page) => setActivePageName(page)} />
                        <NavigateTo page="shops" buttonDisplay="Shops" setActivePage={(page) => setActivePageName(page)}/>
                    </>

    return(
        <BrowserRouter>
            <div className="app-shell">
                <Routes>
                    <Route path="open-market" element={<CartProvider><Outline><Listings /></Outline></CartProvider>} />
                    <Route path="add-listing" element={<AddListingForm />} />
                    <Route path="visit-own-store" element={<div> Own Store Placeholder :D</div>} />
                    <Route path="shops" element={<Outline />} />
                    <Route path="/" element={<Navigate to="open-market"/>} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route path="/cart" element={<CartProvider><Cart /></CartProvider>} />
                    <Route path="/PersonalListings" element ={<PersonalListings/>} />
                </Routes>
                
                <nav className="bottom-nav">
                    {activePageName === 'open-market' || activePageName === 'add-listing' ? openMarket : shops}
                </nav>
            </div>
        </BrowserRouter>
    )
}
