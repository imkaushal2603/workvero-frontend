import React, { useState } from 'react';
import api from '../services/api';
import GoogleAuthButton from "./GoogleAuthButton";

function Login({ isOpen, onClose, onSwitchToRegister, onSwitchToReset }) {
    const [showPassword, setShowPassword] = useState(false);
    const [userType, setUserType] = useState('CANDIDATE');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', {
                email,
                password,
                rememberMe
            });

            const data = response.data;
            const returnedRole = data.role ? data.role.toUpperCase() : 'CANDIDATE';

            if (returnedRole !== userType) {
                const expected = userType === 'CANDIDATE' ? 'Candidate' : 'Employer';
                const actual = returnedRole === 'CANDIDATE' ? 'Candidate' : 'Employer';
                setError(`This account is registered as ${actual}. Please switch to the ${actual} tab to log in.`);
                setLoading(false);
                return;
            }

            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('role', data.role ? data.role.toLowerCase() : 'candidate');
            window.dispatchEvent(new Event('authChange'));
            onClose();

        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || 'Something went wrong';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth_modal_overlay">
            <div className="auth_modal_content">
                <button className="close_btn" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                        <path d="M1.64016 0.27L5.50016 4.13L9.34016 0.29C9.42498 0.199717 9.52716 0.127495 9.64058 0.0776622C9.75399 0.0278298 9.87629 0.00141434 10.0002 0C10.2654 0 10.5197 0.105357 10.7073 0.292893C10.8948 0.48043 11.0002 0.734784 11.0002 1C11.0025 1.1226 10.9797 1.24439 10.9333 1.35788C10.8869 1.47138 10.8178 1.57419 10.7302 1.66L6.84016 5.5L10.7302 9.39C10.895 9.55124 10.9916 9.76959 11.0002 10C11.0002 10.2652 10.8948 10.5196 10.7073 10.7071C10.5197 10.8946 10.2654 11 10.0002 11C9.87272 11.0053 9.74557 10.984 9.62678 10.9375C9.508 10.8911 9.40017 10.8204 9.31016 10.73L5.50016 6.87L1.65016 10.72C1.56567 10.8073 1.46473 10.8769 1.35316 10.925C1.2416 10.9731 1.12163 10.9986 1.00016 11C0.734946 11 0.480592 10.8946 0.293056 10.7071C0.10552 10.5196 0.000162707 10.2652 0.000162707 10C-0.00216879 9.8774 0.0205781 9.75561 0.0670076 9.64212C0.113437 9.52862 0.18257 9.42581 0.270163 9.34L4.16016 5.5L0.270163 1.61C0.105348 1.44876 0.00870232 1.23041 0.000162707 1C0.000162707 0.734784 0.10552 0.48043 0.293056 0.292893C0.480592 0.105357 0.734946 0 1.00016 0C1.24016 0.003 1.47016 0.1 1.64016 0.27Z" fill="#0146EE" />
                    </svg>
                </button>
                <h2>Hi, Welcome Back!</h2>
                <p>Ready to get started? Sign up now</p>
                {error && <div className="auth_error_message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="auth_tab_container">
                        <button
                            type="button"
                            className={`auth_tab ${userType === 'CANDIDATE' ? 'active' : ''}`}
                            onClick={() => { setUserType('CANDIDATE'); setError(''); }}
                        >
                            Candidate
                        </button>
                        <button
                            type="button"
                            className={`auth_tab ${userType === 'RECRUITER' ? 'active' : ''}`}
                            onClick={() => { setUserType('RECRUITER'); setError(''); }}
                        >
                            Employer
                        </button>
                    </div>
                    <div className="input_group">
                        <label htmlFor="email">Email*</label>
                        <input type="email" id="email" placeholder="info@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input_group">
                        <label htmlFor="password">Password*</label>
                        <div className='input_password'>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                    <div className="form_actions">
                        <label><input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} /> <span>Keep me logged in</span></label>
                        <span className="forgot_link" onClick={onSwitchToReset}>Forgot Password?</span>
                    </div>
                    <button type="submit" className="login_submit_btn">{loading ? 'Logging in...' : 'Login'}</button>
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
                    Don't have an account? <span onClick={onSwitchToRegister}>Sign up</span>
                </p>
            </div>
        </div>
    );
}

export default Login;