import React, { useState } from 'react';
import Logo from '../assets/logo.png'
import { Link } from 'react-router-dom';

function Header() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <header className={isOpen ? 'menu-open' : ''}>
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
                            <div className="header_nav">
                                <span>
                                    Job
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                                        <path d="M0 0L5 5L10 0H0Z" fill="black" />
                                    </svg>
                                </span>
                                <div className="header_submenu">
                                    <Link to="/jobs/search">Search Jobs</Link>
                                    <Link to="/jobs/featured">Featured Jobs</Link>
                                    <Link to="/jobs/remote">Remote Work</Link>
                                    <Link to="/jobs/internships">Internships</Link>
                                </div>
                            </div>
                            <div className="header_nav">
                                <span>
                                    Companies
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                                        <path d="M0 0L5 5L10 0H0Z" fill="black" />
                                    </svg>
                                </span>
                                <div className="header_submenu">
                                    <Link to="/companies/browse">Browse Companies</Link>
                                    <Link to="/companies/reviews">Company Reviews</Link>
                                    <Link to="/companies/salaries">Salary Insights</Link>
                                </div>
                            </div>
                            <div className="header_nav">
                                <span>
                                    Candidates
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                                        <path d="M0 0L5 5L10 0H0Z" fill="black" />
                                    </svg>
                                </span>
                                <div className="header_submenu">
                                    <Link to="/candidates/dashboard">Dashboard</Link>
                                    <Link to="/candidates/resume">Build Resume</Link>
                                    <Link to="/candidates/applications">Applications</Link>
                                </div>
                            </div>
                            <div className="header_nav">
                                <span>
                                    Pages
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                                        <path d="M0 0L5 5L10 0H0Z" fill="black" />
                                    </svg>
                                </span>
                                <div className="header_submenu">
                                    <Link to="/about">About Us</Link>
                                    <Link to="/pricing">Pricing Plans</Link>
                                    <Link to="/faq">FAQs</Link>
                                    <Link to="/terms">Terms of Service</Link>
                                </div>
                            </div>
                            <Link to="/contact">
                                <span>Contact</span>
                            </Link>
                        </nav>
                        <div className="header_btns">
                            <Link to="/terms" className="transparent_btn">Employer Login</Link>
                            <Link to="/terms" className="bg_btn">Candidate Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;