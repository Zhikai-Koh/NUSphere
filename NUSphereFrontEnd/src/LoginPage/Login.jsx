import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from "../config.js";
import './AuthForm.css'


export function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login/`, {
                username,
                password
            });

            const { access, refresh } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            alert("Logged in successfully!");
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error.response?.data);
            alert("Invalid username or password");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form">
                <input 
                    className="auth-input"
                    type="text" placeholder="Username"
                    onChange={e => setUsername(e.target.value)}
                />

                <input 
                    className="auth-input"
                    type="password" 
                    placeholder="Password" onChange={e => setPassword(e.target.value)} 
                />
            </form>

            <form className="auth-buttons">
                <button className="auth-btn-primary"  onClick={handleLogin}>
                    Log In
                </button>

                <button className="auth-btn-secondary" onClick={() => navigate("/register") }>
                    Register
                </button>
            </form>
        </div>
    );
}