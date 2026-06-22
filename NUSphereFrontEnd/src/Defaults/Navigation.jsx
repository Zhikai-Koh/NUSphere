import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate} from 'react-router-dom';
import { Outline } from "./Outline.jsx";
import { Listings } from "../OpenMarket/Listings.jsx";
import { LoginForm } from "../LoginPage/Login.jsx";
import { StoresPage } from "../Stores/StoresPage.jsx"

import { AllProviders } from "./AllProviders.jsx";
import { Cart } from "../UserSpecifics/CartItems.jsx";

import { AddListingForm } from "../OpenMarket/AddListing.jsx";
import { RegistrationForm } from "../LoginPage/Registration.jsx";

import "./Navigation.css";
import { PersonalListings } from "../OpenMarket/MyListings.jsx";
import { PendingListings } from "../OpenMarket/PendingListing.jsx";

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

    return(
        <BrowserRouter>
            <div className="app-shell">
                <Routes>
                    <Route path="open-market" element={<AllProviders><Outline><Listings /></Outline></AllProviders>} />
                    <Route path="add-listing" element={<AddListingForm />} />
                    <Route path="visit-own-store" element={<div> Own Store Placeholder :D</div>} />
                    <Route path="stores" element={<AllProviders><Outline><StoresPage /></Outline></AllProviders>} />
                    <Route path="/" element={<Navigate to="open-market"/>} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route path="/cart" element={<AllProviders><Cart /></AllProviders>} />
                    <Route path="/PersonalListings" element ={<><PersonalListings/><PendingListings/></>} />
                </Routes>
                
                <nav className="bottom-nav">
                    <NavigateTo page="open-market" buttonDisplay="Open Market" setActivePage={(page) => setActivePageName(page)} />
                    <NavigateTo page="stores" buttonDisplay="Stores" setActivePage={(page) => setActivePageName(page)}/>
                </nav>
            </div>
        </BrowserRouter>
    )
}
