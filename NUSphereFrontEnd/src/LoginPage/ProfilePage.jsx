import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config.js";
import profileIcon from "../assets/ProfilePhotoIcon.png";
import { SellerAnalytics } from "../UserSpecifics/SellerAnalytics.jsx";
import "./AuthForm.css";

export function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [username, setUsername] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('access_token');

    const fetchProfile = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/auth/profile/`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(response.data);
            setUsername(response.data.username || "");
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append("username", username);
        if (profilePicture) {
            formData.append("profile_picture", profilePicture);
        }

        try {
            const response = await axios.patch(`${API_BASE_URL}/api/auth/profile/`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            setProfile(response.data);
            setUsername(response.data.username || "");
            setProfilePicture(null);
            alert("Profile updated successfully.");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert(error.response?.data?.error || "Failed to update profile.");
        }
    };

    useEffect(() => {
        if (token) {
            fetchProfile();
        } else {
            setLoading(false);
        }
    }, []);

    if (!token) {
        return <p style={{ color: "red" }}>Please log in to view your profile.</p>;
    }

    if (loading) {
        return <p>Loading profile...</p>;
    }

    const profileImage = profile?.profile_picture
        ? profile.profile_picture.startsWith("http")
            ? profile.profile_picture
            : `${API_BASE_URL}${profile.profile_picture}`
        : profileIcon;

    return (
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
            <h2>My Profile</h2>

            <section className="listing-card" style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
                    <img
                        src={profileImage}
                        alt="Profile"
                        style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover" }}
                    />

                    <form onSubmit={updateProfile} style={{ display: "flex", flexDirection: "column", gap: "12px", minWidth: "280px" }}>
                        <label>
                            Username:
                            <input
                                className="auth-input"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                                required
                            />
                        </label>

                        <label>
                            Select New Profile Picture:
                            <input
                                className="auth-input"
                                type="file"
                                accept="image/*"
                                onChange={(event) => setProfilePicture(event.target.files[0])}
                            />
                        </label>

                        <button className="auth-btn-primary" type="submit">
                            Save Profile
                        </button>
                    </form>
                </div>
            </section>

            <SellerAnalytics />
        </div>
    );
}
