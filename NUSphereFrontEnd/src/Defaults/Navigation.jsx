import { BrowserRouter, Routes, Route, Navigate, NavLink, useLocation} from 'react-router-dom';
import { Outline } from "./Outline.jsx";
import { Listings } from "../OpenMarket/Listings.jsx";
import { LoginForm } from "../LoginPage/Login.jsx";
import { StoresPage } from "../Stores/StoresPage.jsx"

import { AllProviders } from "./AllProviders.jsx";
import { Cart } from "../UserSpecifics/CartItems.jsx";
import { PendingSales } from "../UserSpecifics/PendingSales.jsx";
import { Messages } from "../UserSpecifics/Messages.jsx";

import { AddListingForm } from "../OpenMarket/AddListing.jsx";
import { RegistrationForm } from "../LoginPage/Registration.jsx";
import { ProfilePage } from "../LoginPage/ProfilePage.jsx";

import "./Navigation.css";
import { PersonalListings } from "../OpenMarket/MyListings.jsx";
import { MyOrders } from "../OpenMarket/MyOrders.jsx";
import { MyStore } from "../Stores/MyStore.jsx";
import { SelectMyStore } from "../Stores/SelectMyStore.jsx";
import { AddStoreForm } from "../Stores/AddStore.jsx";
import { AddProductForm } from "../Stores/AddProduct.jsx";
import { VisitStore } from "../Stores/VisitStore.jsx";
import { BackButton } from "./BackButton.jsx";

function AppTopBar() {
    const location = useLocation();
    const hiddenRoutes = new Set(["/login", "/register"]);
    const isLoggedIn = Boolean(localStorage.getItem('access_token'));

    if (hiddenRoutes.has(location.pathname.toLowerCase())) {
        return null;
    }

    return (
        <nav className="app-top-bar" aria-label="Main navigation">
            <div className="app-top-bar-inner">
                <div className="app-top-links">
                    <NavLink to="/open-market">Open Market</NavLink>
                    <NavLink to="/stores">Stores</NavLink>
                </div>
                {isLoggedIn && (
                    <div className="app-top-actions">
                        <NavLink to="/add-listing">Create Listing</NavLink>
                        <NavLink to="/add-store">Create Store</NavLink>
                    </div>
                )}
            </div>
        </nav>
    );
}

function ProtectedRoute({ children }) {
    if (!localStorage.getItem('access_token')) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export function NavigationBar() {
    return(
        <BrowserRouter>
            <div className="app-shell">
                <AppTopBar />
                <BackButton />
                <Routes>
                    <Route path="/" element={<Navigate to="open-market"/>} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegistrationForm />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/cart" element={<AllProviders><Cart /></AllProviders>} />
                    
                    <Route path="open-market" element={<AllProviders><Outline/></AllProviders>}>
                        <Route index element = {<Listings />}/>
                    </Route>
                    
                    <Route path="add-listing" element={<ProtectedRoute><AddListingForm /></ProtectedRoute>} />
                    <Route path="/PersonalListings" element ={<PersonalListings/>} />
                    <Route path="/orders" element = {<MyOrders/>}/>
                    <Route path="/pending-sales" element = {<PendingSales/>}/>
                    <Route path="/messages" element = {<Messages/>}/>
                    <Route path="/messages/:conversationId" element = {<Messages/>}/>

                    <Route path="stores" element={<AllProviders><Outline/></AllProviders>} >
                        <Route index element = {<StoresPage />}/>
                    </Route>
                    <Route path="add-store" element={<ProtectedRoute><AddStoreForm /></ProtectedRoute>} />
                    <Route path="/MyStores" element = {<SelectMyStore/>}/>
                    <Route path="/MyStores/:storeId" element = {<MyStore/>}/>
                    <Route path="/AddProduct/:storeId" element={<AddProductForm />} />
                    <Route path="/VisitStore/:storeId" element={<AllProviders><VisitStore /></AllProviders>} />

                </Routes>
            </div>
        </BrowserRouter>
    )
}
