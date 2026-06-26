import React, { useState, useEffect } from 'react';
import Logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Registration from './Registration';
import ForgotPassword from './ForgotPassword';
import api from '../services/api';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 991);
    const [activeAuthModal, setActiveAuthModal] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 991);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleAuthChange = () => {
            const token = localStorage.getItem('token');
            const role = localStorage.getItem('role');

            setIsLoggedIn(!!token);

            if (token && role) {
                const normalizedRole = role.toLowerCase();

                if (normalizedRole === 'recruiter') {
                    navigate('/employer/dashboard');
                } else if (normalizedRole === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/candidate/dashboard');
                }
            }
        };

        window.addEventListener('storage', handleAuthChange);
        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('storage', handleAuthChange);
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, [navigate]);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        }
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('authChange'));
        setIsLoggedIn(false);
        navigate('/');
    };

    const handleToggle = (index) => {
        if (isMobile) {
            setActiveIndex(activeIndex === index ? null : index);
        }
    };

    const navData = [
        {
            title: "Job",
            submenu: [
                { label: "Search Jobs", path: "/jobs/search" },
                { label: "Featured Jobs", path: "/jobs/featured" },
                { label: "Remote Work", path: "/jobs/remote" },
                { label: "Internships", path: "/jobs/internships" }
            ]
        },
        {
            title: "Companies",
            submenu: [
                { label: "Browse Companies", path: "/companies/browse" },
                { label: "Company Reviews", path: "/companies/reviews" },
                { label: "Salary Insights", path: "/companies/salaries" }
            ]
        },
        {
            title: "Candidates",
            submenu: [
                { label: "Dashboard", path: "/candidates/dashboard" },
                { label: "Build Resume", path: "/candidates/resume" },
                { label: "Applications", path: "/candidates/applications" }
            ]
        },
        {
            title: "Pages",
            submenu: [
                { label: "Job Category", path: "/job-category" },
                { label: "Jobs", path: "/jobs" },
                { label: "Job Apply", path: "/job-apply" },
                { label: "Terms of Service", path: "/terms" }
            ]
        }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className={isMenuOpen ? 'menu-open' : ''}>
            <div className="content-wrapper">
                <div className="header_section">
                    <div className="header_logo">
                        <Link to="/">
                            <img src={Logo} alt="Logo" />
                        </Link>
                    </div>
                    <div className='header_toggle' onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div className="header_menus">
                        <nav>
                            {navData.map((navItem, index) => {
                                const isSubmenuOpen = !isMobile || activeIndex === index;

                                return (
                                    <div className="header_nav" key={index}>
                                        <span onClick={() => handleToggle(index)}>
                                            {navItem.title}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="10"
                                                height="5"
                                                viewBox="0 0 10 5"
                                                fill="none"
                                                style={{
                                                    transform: isSubmenuOpen && isMobile ? 'rotate(180deg)' : 'rotate(0deg)',
                                                    transition: 'transform 0.2s ease',
                                                    marginLeft: '5px'
                                                }}
                                            >
                                                <path d="M0 0L5 5L10 0H0Z" fill="black" />
                                            </svg>
                                        </span>

                                        {isSubmenuOpen && (
                                            <div className={`header_submenu ${isSubmenuOpen && isMobile ? 'active' : ''}`}>
                                                {navItem.submenu.map((subItem, subIndex) => (
                                                    <Link key={subIndex} to={subItem.path}>
                                                        {subItem.label}
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <Link to="/contact">
                                <span>Contact</span>
                            </Link>
                        </nav>
                        <div className="header_btns">
                            {isLoggedIn ? (
                                <div className="account_dropdown">
                                    <button
                                        className="transparent_btn"
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50" fill="none">
                                            <circle cx="25" cy="25" r="25" fill="#E2EAFF" />
                                            <path d="M24.9999 13.3333C23.4678 13.3333 21.9507 13.635 20.5353 14.2213C19.1198 14.8076 17.8337 15.667 16.7503 16.7503C14.5624 18.9383 13.3333 21.9057 13.3333 24.9999C13.3333 28.0941 14.5624 31.0616 16.7503 33.2495C17.8337 34.3328 19.1198 35.1922 20.5353 35.7785C21.9507 36.3648 23.4678 36.6666 24.9999 36.6666C28.0941 36.6666 31.0616 35.4374 33.2495 33.2495C35.4374 31.0616 36.6666 28.0941 36.6666 24.9999C36.6666 23.4678 36.3648 21.9507 35.7785 20.5353C35.1922 19.1198 34.3328 17.8337 33.2495 16.7503C32.1661 15.667 30.88 14.8076 29.4646 14.2213C28.0491 13.635 26.532 13.3333 24.9999 13.3333ZM24.9999 20.7883C26.8823 22.0114 29.0784 22.6638 31.3233 22.6666C32.2333 22.6666 33.1083 22.5616 33.9483 22.3633C34.1933 23.1916 34.3333 24.0783 34.3333 24.9999C34.3333 30.1449 30.1449 34.3333 24.9999 34.3333C21.4999 34.3333 18.4549 32.3966 16.8333 29.5383L18.8749 27.3333V26.1666C18.8749 25.7798 19.0286 25.4089 19.3021 25.1354C19.5755 24.8619 19.9465 24.7083 20.3333 24.7083C20.72 24.7083 21.091 24.8619 21.3644 25.1354C21.6379 25.4089 21.7916 25.7798 21.7916 26.1666V27.3333H24.9999M29.6666 24.7083C29.2798 24.7083 28.9089 24.8619 28.6354 25.1354C28.3619 25.4089 28.2083 25.7798 28.2083 26.1666C28.2083 26.5534 28.3619 26.9243 28.6354 27.1978C28.9089 27.4713 29.2798 27.6249 29.6666 27.6249C30.0534 27.6249 30.4243 27.4713 30.6978 27.1978C30.9713 26.9243 31.1249 26.5534 31.1249 26.1666C31.1249 25.7798 30.9713 25.4089 30.6978 25.1354C30.4243 24.8619 30.0534 24.7083 29.6666 24.7083Z" fill="#0146EE" />
                                        </svg>
                                        My Account
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="8" viewBox="0 0 13 8" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.65703 7.071L2.66411e-05 1.414L1.41403 -4.94551e-07L6.36403 4.95L11.314 -6.18079e-08L12.728 1.414L7.07103 7.071C6.8835 7.25847 6.62919 7.36379 6.36403 7.36379C6.09886 7.36379 5.84455 7.25847 5.65703 7.071Z" fill="#0146EE" />
                                        </svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="dropdown_menu">
                                            <Link to="/dashboard" onClick={() => setIsDropdownOpen(false)}>
                                                Dashboard
                                            </Link>
                                            <button onClick={handleLogout}>
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <>
                                    <button onClick={() => setActiveAuthModal('login')} className="transparent_btn">
                                        Employer Login
                                    </button>
                                    <button onClick={() => setActiveAuthModal('login')} className="bg_btn">
                                        Candidate Login
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Login
                isOpen={activeAuthModal === 'login'}
                onClose={() => setActiveAuthModal(null)}
                onSwitchToRegister={() => setActiveAuthModal('register')}
                onSwitchToReset={() => setActiveAuthModal('reset')}
            />
            <Registration
                isOpen={activeAuthModal === 'register'}
                onClose={() => setActiveAuthModal(null)}
                onSwitchToLogin={() => setActiveAuthModal('login')}
            />
            <ForgotPassword
                isOpen={activeAuthModal === 'reset'}
                onClose={() => setActiveAuthModal(null)}
                onSwitchToLogin={() => setActiveAuthModal('login')}
            />
        </header>
    );
}

export default Header;