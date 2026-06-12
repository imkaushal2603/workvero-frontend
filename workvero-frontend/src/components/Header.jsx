import React, { useState, useEffect } from 'react';
import Logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Renamed to avoid collision with item open state
    const [activeIndex, setActiveIndex] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 991); // Updated threshold to 991px

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 991); // Updated threshold to 991px
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                { label: "About Us", path: "/about" },
                { label: "Pricing Plans", path: "/pricing" },
                { label: "FAQs", path: "/faq" },
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
                            <Link to="/employer-login" className="transparent_btn">Employer Login</Link>
                            <Link to="/candidate-login" className="bg_btn">Candidate Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;