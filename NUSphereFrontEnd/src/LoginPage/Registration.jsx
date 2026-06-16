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
                console.log("Django Validation Errors:", error.response.data);
                alert(`Signup Failed: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                // The request was made but no response was received (Backend is down/CORS issue)
                console.log("No response received from server:", error.request);
                alert("Server is not responding. Please try again later.");
            } else {
                // Something happened in setting up the request
                console.log("Error message:", error.message);
                alert(`Error: ${error.message}`);
            }
        }
    };

    return (
        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} required />
            <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
            <input type="password" placeholder="Confirm Password" onChange={e => setPasswordConfirm(e.target.value)} required />
            <button type="submit">Sign Up</button>
        </form>
    );
}