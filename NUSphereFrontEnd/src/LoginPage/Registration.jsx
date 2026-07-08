import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";
import { API_BASE_URL } from "../config.js";


export function RegistrationForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");

    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE_URL}/api/auth/register/`, {
                username: username,
                email: email,
                password: password,
                password_confirm: passwordConfirm // Matches serializer field
            });

            alert("Account created successfully! Redirecting to login...");
            // Redirect user or switch tabs to the login view here
            navigate('/login');
        } catch (error) {
            console.error("Full Error Object:", error);

            if (error.response) {
                // The server responded with a status code outside the 2xx range
                alert(`Signup Failed: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                // The request was made but no response was received (Backend is down/CORS issue)
                alert("Server is not responding. Please try again later.");
            } else {
                // Something happened in setting up the request
                alert(`Error: ${error.message}`);
            }
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSignup} >
                <input 
                    className="auth-input"
                    type="text" placeholder="Username" 
                    onChange={e => setUsername(e.target.value)} required 
                />
                <input 
                    className="auth-input"
                    type="email" placeholder="Email" 
                    onChange={e => setEmail(e.target.value)} 
                />
                <input 
                    className="auth-input"
                    type="password" placeholder="Password"
                    onChange={e => setPassword(e.target.value)} required 
                />
                <input 
                    className="auth-input"
                    type="password" placeholder="Confirm Password"
                    onChange={e => setPasswordConfirm(e.target.value)} required 
                />
                <button className="auth-btn-primary" type="submit">Sign Up</button>
            </form>
            <div className="auth-acc-check">
                Already have an account? <button className="auth-btn-secondary" onClick={() => navigate("/login")}>Log In</button>
            </div>
        </div>
    );
}
