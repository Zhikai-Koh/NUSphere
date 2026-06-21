import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from "../config.js";

export const ListingsContext = createContext();

export function ListingsProvider({ children }) {
    const [listings, setListings] = useState([]);
    const [loadSuccess, setLoadSuccess] = useState(true);

    const fetchListings = async () => {
      try{
        let response;
        if (localStorage.getItem('access_token') !== null) {
            response = await axios.get(`${API_BASE_URL}/api/listings/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
            });
        }
        else{
            response = await axios.get(`${API_BASE_URL}/api/listings/`);
        }

        if (!response) {
            throw new Error('Network response failure');
        }
        setListings(response.data);
        } catch (error) {
            console.error('Error fetching listings:', error);
            setLoadSuccess(false);
            setListings(<p style={{ color: 'red' }}>Failed to load listings. Please try again later.</p>);
        } 
    }

    useEffect(() => {
        fetchListings();
    }, []);

    return (
        <ListingsContext.Provider value={{listings, loadSuccess}}>
            {children}
        </ListingsContext.Provider>
    );
}