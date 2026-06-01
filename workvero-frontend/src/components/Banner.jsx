import React from 'react';
import heroBanner from '../assets/hero-banner.png'

function Banner() {
    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Searching...");
    };

    return (
        <div className="hero_banner">
            <div className='content-wrapper'>
                <div className='hero_banner_section'>
                    <div className='hero_banner_text'>
                        <h1><span>Find Your Dream Job</span> Build Your Future</h1>
                        <p>Discover thousands of job opportunities and connect with top companies.</p>
                        <div className='hero_banner_form'>
                            <form onSubmit={handleSearch}>
                                <input type="search" id="job_title" name="job_title" placeholder="Search Job Title, Keyword or Company"></input>
                                <input type="search" id="city" name="city" placeholder="City, State, Zip Code or Remote"></input>
                                <button>Search Jobs</button>
                            </form>
                        </div>
                        <div className="hero_form_searches">
                            <span><strong>Popular Searches :</strong> Designer, Developer, Web, IOS, PHP, Senior, Engineer,</span>
                        </div>
                    </div>
                    <div className='hero_banner_img'>
                        <img src={heroBanner} alt="Home Hero Banner" />
                    </div>
                    <div className="hero_banner_bg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="891" height="727" viewBox="0 0 891 727" fill="none">
                            <path d="M0.368775 726C0.211039 726.015 0.0878382 726.015 0 726H0.368775C10.9856 725.01 178.054 657.101 249 462C321 264 467 5 891 0V726H0.368775Z" fill="url(#paint0_linear_199_88)" />
                            <defs>
                                <linearGradient id="paint0_linear_199_88" x1="445.5" y1="0" x2="445.5" y2="726.011" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#6D17E1" stopOpacity="0.53" />
                                    <stop offset="1" stopColor="#0146EE" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Banner;