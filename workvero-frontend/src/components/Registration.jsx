import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import GoogleAuthButton from "./GoogleAuthButton";

function Registration({ isOpen, onClose, onSwitchToLogin }) {
    const [userType, setUserType] = useState('CANDIDATE');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();

        if (!agreeTerms) {
            setErrorMessage("You must accept the terms and conditions to register.");
            return;
        }

        setErrorMessage("");
        setIsLoading(true);

        try {
            const response = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: userType
            });

            toast.success("Account created successfully! Please login.");
            onSwitchToLogin();

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
            setErrorMessage(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth_modal_overlay register_account">
            <div className="auth_modal_content register_modal">
                <button className="close_btn" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M1.64016 0.27L5.50016 4.13L9.34016 0.29C9.42498 0.199717 9.52716 0.127495 9.64058 0.0776622C9.75399 0.0278298 9.87629 0.00141434 10.0002 0C10.2654 0 10.5197 0.105357 10.7073 0.292893C10.8948 0.48043 11.0002 0.734784 11.0002 1C11.0025 1.1226 10.9797 1.24439 10.9333 1.35788C10.8869 1.47138 10.8178 1.57419 10.7302 1.66L6.84016 5.5L10.7302 9.39C10.895 9.55124 10.9916 9.76959 11.0002 10C11.0002 10.2652 10.8948 10.5196 10.7073 10.7071C10.5197 10.8946 10.2654 11 10.0002 11C9.87272 11.0053 9.74557 10.984 9.62678 10.9375C9.508 10.8911 9.40017 10.8204 9.31016 10.73L5.50016 6.87L1.65016 10.72C1.56567 10.8073 1.46473 10.8769 1.35316 10.925C1.2416 10.9731 1.12163 10.9986 1.00016 11C0.734946 11 0.480592 10.8946 0.293056 10.7071C0.10552 10.5196 0.000162707 10.2652 0.000162707 10C-0.00216879 9.8774 0.0205781 9.75561 0.0670076 9.64212C0.113437 9.52862 0.18257 9.42581 0.270163 9.34L4.16016 5.5L0.270163 1.61C0.105348 1.44876 0.00870232 1.23041 0.000162707 1C0.000162707 0.734784 0.10552 0.48043 0.293056 0.292893C0.480592 0.105357 0.734946 0 1.00016 0C1.24016 0.003 1.47016 0.1 1.64016 0.27Z" fill="#0146EE" />
                    </svg>
                </button>
                <h2>Create Account</h2>
                {errorMessage && (
                    <div className="auth_error_msg" style={{ color: "#ef4444", fontSize: "0.85rem", marginBottom: "15px", textAlign: "center" }}>
                        {errorMessage}
                    </div>
                )}
                <form onSubmit={handleRegisterSubmit}>
                    <div className="auth_tab_container">
                        <button
                            type="button"
                            className={`auth_tab ${userType === 'CANDIDATE' ? 'active' : ''}`}
                            onClick={() => setUserType('CANDIDATE')}
                        >
                            Candidate
                        </button>
                        <button
                            type="button"
                            className={`auth_tab ${userType === 'RECRUITER' ? 'active' : ''}`}
                            onClick={() => setUserType('RECRUITER')}
                        >
                            Employer
                        </button>
                    </div>
                    <div className="input_group">
                        <label htmlFor="name">Name*</label>
                        <input type="text" id="name" placeholder="Enter Your Name" value={formData.name} onChange={handleInputChange} required />
                    </div>
                    <div className="input_group">
                        <label htmlFor="email">Email*</label>
                        <input type="email" id="email" placeholder="Info@gmail.com" value={formData.email} onChange={handleInputChange} required />
                    </div>
                    <div className="input_group">
                        <label htmlFor="password">Password*</label>
                        <div className='input_password'>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button
                                type="button"
                                className="password_mask_toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5CFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7A5CFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                                        <line x1="1" y1="1" x2="23" y2="23"></line>
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                    <div className="form_actions terms_checkbox_group">
                        <label>
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => setAgreeTerms(e.target.checked)}
                                required
                            />
                            <span>I accept terms and condition</span>
                        </label>
                    </div>
                    <button type="submit" disabled={isLoading} className="login_submit_btn register_submit_btn">{isLoading ? "Registering..." : "Register"}</button>
                </form>
                <div className="auth_divider"><span>Or</span></div>
                <div className="social_login_btns">
                    <GoogleAuthButton
                        role={userType}
                        onSuccess={() => {
                            onClose();
                            window.location.reload();
                        }}
                    />
                </div>
                <p className="switch_auth_text">
                    Have an account? <span onClick={onSwitchToLogin}>Sign In</span>
                </p>
            </div>
        </div>
    );
}

export default Registration;