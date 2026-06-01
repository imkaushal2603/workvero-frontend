import React from 'react';
import Logo from '../assets/logo.png'

function Header() {
    return (
        <header>
            <div className="content-wrapper">
                <div className="header_section">
                    <div className="header_logo">
                        <img src={Logo} />
                    </div>
                    <div className="header_menus">
                        <nav>
                            <a className="header_nav">
                                <span>
                                    Job
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                                        <path d="M0 0L5 5L10 0H0Z" fill="black" />
                                    </svg>
                                </span>
                                <div className="header_submenu">
                                    <a>Job 1</a>
                                    <a>Job 2</a>
                                    <a>Job 3</a>
                                    <a>Job 4</a>
                                </div>
                            </a>
                            <a className="header_nav">
                                <span>
                                    Companies
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                                        <path d="M0 0L5 5L10 0H0Z" fill="black" />
                                    </svg>
                                </span>
                                <div className="header_submenu">
                                    <a>Companies 1</a>
                                    <a>Companies 2</a>
                                    <a>Companies 3</a>
                                    <a>Companies 4</a>
                                </div>
                            </a>
                            <a className="header_nav">
                                <span>
                                    Candidates
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                                        <path d="M0 0L5 5L10 0H0Z" fill="black" />
                                    </svg>
                                </span>
                                <div className="header_submenu">
                                    <a>Candidates 1</a>
                                    <a>Candidates 2</a>
                                    <a>Candidates 3</a>
                                    <a>Candidates 4</a>
                                </div>
                            </a>
                            <a className="header_nav">
                                <span>
                                    Pages
                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="5" viewBox="0 0 10 5" fill="none">
                                        <path d="M0 0L5 5L10 0H0Z" fill="black" />
                                    </svg>
                                </span>
                                <div className="header_submenu">
                                    <a>Pages 1</a>
                                    <a>Pages 2</a>
                                    <a>Pages 3</a>
                                    <a>Pages 4</a>
                                </div>
                            </a>
                            <a>
                                <span>Contact</span>
                            </a>
                        </nav>
                        <div className="header_btns">
                            <a className="transparent_btn">Employer Login</a>
                            <a className="bg_btn">Candidate Login</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;