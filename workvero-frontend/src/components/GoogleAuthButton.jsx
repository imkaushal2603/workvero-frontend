// src/components/GoogleAuthButton.jsx

import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import api from "../services/api";

function GoogleAuthButton({ onSuccess }) {

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const {data} = await api.post("/auth/google",
                {
                    idToken: credentialResponse.credential,
                    rememberMe: true,
                },
                {
                    withCredentials: true,
                }
            );
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('role', data.role ? data.role.toLowerCase() : 'candidate');
            window.dispatchEvent(new Event('authChange'));
            toast.success("Login successful!");

        } catch (err) {
            toast.error(
                err || "Google login failed"
            );
        }
    };

    const handleGoogleError = () => {
        toast.error("Google Sign-In failed");
    };

    return (
        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            shape="rectangular"
            width="320"
        />
    );
}

export default GoogleAuthButton;