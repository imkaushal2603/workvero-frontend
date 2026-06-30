import React, { useState } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

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
                    <a>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path opacity="0.987" fillRule="evenodd" clipRule="evenodd" d="M5.95924 0.06075C6.68424 -0.02025 7.11324 -0.02025 7.89224 0.06075C9.27118 0.264845 10.5495 0.902235 11.5422 1.88075C10.8714 2.51489 10.2093 3.15828 9.55624 3.81075C8.30558 2.75075 6.90958 2.50608 5.36824 3.07675C4.23758 3.59675 3.45024 4.43942 3.00624 5.60475C2.28068 5.06458 1.56457 4.51183 0.858242 3.94675C0.809155 3.92091 0.75309 3.91145 0.698242 3.91975C1.82024 1.75642 3.57358 0.46975 5.95824 0.05975" fill="#F44336" />
                            <path opacity="0.997" fillRule="evenodd" clipRule="evenodd" d="M0.696252 3.91975C0.752919 3.91109 0.806585 3.92009 0.857252 3.94675C1.56358 4.51183 2.27969 5.06458 3.00525 5.60475C2.89108 6.05881 2.8191 6.52245 2.79025 6.98975C2.81492 7.44175 2.88659 7.88542 3.00525 8.32075L0.750252 10.1158C-0.231748 8.06375 -0.249748 5.99842 0.696252 3.91975Z" fill="#FFC107" />
                            <path opacity="0.999" fillRule="evenodd" clipRule="evenodd" d="M11.4353 12.2897C10.7332 11.6705 9.99811 11.0897 9.23331 10.5497C9.99998 10.0084 10.4653 9.26574 10.6293 8.32174H6.87231V5.71274C9.03898 5.69474 11.2046 5.71308 13.3693 5.76774C13.78 7.99774 13.3056 10.0084 11.9463 11.7997C11.7847 11.9716 11.6135 12.1351 11.4353 12.2897Z" fill="#448AFF" />
                            <path opacity="0.993" fillRule="evenodd" clipRule="evenodd" d="M3.00524 8.32178C3.82524 10.3598 5.32858 11.3111 7.51524 11.1758C8.12908 11.1047 8.71759 10.8903 9.23324 10.5498C9.99858 11.0911 10.7326 11.6711 11.4352 12.2898C10.3219 13.2902 8.90236 13.8838 7.40824 13.9738C7.06879 14.0009 6.7277 14.0009 6.38824 13.9738C3.84291 13.6738 1.96358 12.3878 0.750244 10.1158L3.00524 8.32178Z" fill="#43A047" />
                        </svg>
                    </a>
                </div>
                <p className="switch_auth_text">
                    Have an account? <span onClick={onSwitchToLogin}>Sign In</span>
                </p>
            </div>
        </div>
    );
}

export default Registration;