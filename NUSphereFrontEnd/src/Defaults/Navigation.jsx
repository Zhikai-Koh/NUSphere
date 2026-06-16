import {createContext, useState, useEffect, useRef} from "react";
import { BrowserRouter, Routes, Route, Link, Outlet, NavLink} from 'react-router-dom';
import {Outline} from "../Outline.jsx";
import {Listings} from "../OpenMarket/Listings.jsx";
import {LoginForm} from "../LoginPage/Login.jsx";

import {AddListingForm} from "../OpenMarket/AddListing.jsx";
import {RegistrationForm} from "../LoginPage/Registration.jsx";

function NavigateTo({page, buttonDisplay, setActivePage}) {
    
        return(
            <NavLink to={page}
            style ={({isActive}) => ({
                display: 'flex',
                flexDirection: 'column',
                color: isActive ? 'white' : 'black',
                backgroundColor:  isActive ? '#555' : 'white',
                padding: '10px 20px',
                borderRadius: '120px',
                border: '1px solid black',
                cursor: 'pointer',
                width: '250px',
            })}
            onClick={() => setActivePage(page)}
            >
                {buttonDisplay}
            </NavLink>
        )
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
            <div style ={{display: 'flex', flexDirection: 'column',minHeight: '100vh', backgroundColor: '#f0f0f0'}}>
                <Routes>
                    <Route path="open-market" element={<div style = {{display: 'flex', flexDirection: 'column'}}><Outline /> <Listings /></div>} />
                    <Route path="add-listing" element={<AddListingForm />} />
                    <Route path="visit-own-store" element={<div> Own Store Placeholder :D</div>} />
                    <Route path="shops" element={<Outline />} />
                    <Route path="/" element={<Outline />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegistrationForm />} />
                </Routes>
                <nav style = {{display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                backgroundColor: 'white',
                color: 'black',
                padding: '10px 0',

                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                }}>
                    {activePageName === 'open-market' || activePageName === 'add-listing' ? openMarket : shops}
                </nav>
            </div>
        </BrowserRouter>

    )
}
