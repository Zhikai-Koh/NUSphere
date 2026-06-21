import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import axios from 'axios';
import { API_BASE_URL } from "../config.js";


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
        <>
            <form>
                <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
                <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            </form>
            <form style={{ display: 'flex',  marginTop: '10px' }}>
                <button type="submit" onClick={handleLogin}>Log In</button>
                <button type="submit" onClick={() => navigate("/register") } style={{ marginLeft: '10px' }}>Register</button>
            </form>
        </>
    );
}