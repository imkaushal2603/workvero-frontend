import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function JobListings() {
    const jobListings = [
        {
            "Title": "Graphic Designer, UI/UX Designer & Art",
            "Company": "UrbanEdge Pvt. Ltd.",
            "Location": "Rogers Street Cincinnati, OH 45202",
            "timePosted": "3 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Full Stack Web Developer",
            "Company": "UrbanEdge Pvt. Ltd.",
            "Location": "Rogers Street Cincinnati, OH 45202",
            "timePosted": "3 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Marketing Department",
            "Company": "UrbanEdge Pvt. Ltd.",
            "Location": "Rogers Street Cincinnati, OH 45202",
            "timePosted": "3 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Production Department",
            "Company": "UrbanEdge Pvt. Ltd.",
            "Location": "Rogers Street Cincinnati, OH 45202",
            "timePosted": "3 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Customer Support",
            "Company": "UrbanEdge Pvt. Ltd.",
            "Location": "Rogers Street Cincinnati, OH 45202",
            "timePosted": "3 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Mobile App Development",
            "Company": "UrbanEdge Pvt. Ltd.",
            "Location": "Rogers Street Cincinnati, OH 45202",
            "timePosted": "3 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Research & Development",
            "Company": "UrbanEdge Pvt. Ltd.",
            "Location": "Rogers Street Cincinnati, OH 45202",
            "timePosted": "3 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Business Development",
            "Company": "UrbanEdge Pvt. Ltd.",
            "Location": "Rogers Street Cincinnati, OH 45202",
            "timePosted": "3 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Engineering Department",
            "Company": "UrbanEdge Pvt. Ltd.",
            "Location": "Rogers Street Cincinnati, OH 45202",
            "timePosted": "3 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Finance & Accounts",
            "Company": "UrbanEdge Pvt. Ltd.",
            "Location": "Rogers Street Cincinnati, OH 45202",
            "timePosted": "3 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Senior React Developer",
            "Company": "TechVantage Labs",
            "Location": "Silicon Valley Bangalore, KA 560001",
            "timePosted": "12 Minute ago",
            "Image": "blog-img.png",
            "workMode": "hybrid",
            "Job Type": "Full Time",
            "Salary": "₹ 60k - 90k"
        },
        {
            "Title": "SEO & Content Strategist",
            "Company": "GrowthHackers Corp",
            "Location": "MG Road Gurugram, HR 122002",
            "timePosted": "45 Minute ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Freelance",
            "Salary": "₹ 30k - 45k"
        },
        {
            "Title": "Data Analyst & BI Specialist",
            "Company": "InsightMetrics",
            "Location": "Sector 62 Noida, UP 201301",
            "timePosted": "1 Hour ago",
            "Image": "blog-img.png",
            "workMode": "onsite",
            "Job Type": "Full Time",
            "Salary": "₹ 40k - 55k"
        },
        {
            "Title": "DevOps Infrastructure Engineer",
            "Company": "CloudScale Systems",
            "Location": "Hitech City Hyderabad, TG 500081",
            "timePosted": "2 Hour ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 80k - 120k"
        },
        {
            "Title": "Talent Acquisition Specialist",
            "Company": "PeopleFirst HR",
            "Location": "Malad Mumbai, MH 400064",
            "timePosted": "3 Hour ago",
            "Image": "blog-img.png",
            "workMode": "hybrid",
            "Job Type": "Part Time",
            "Salary": "₹ 25k - 35k"
        },
        {
            "Title": "Product QA Automation Engineer",
            "Company": "QualiTest Solutions",
            "Location": "Salt Lake Sector V Kolkata, WB 700091",
            "timePosted": "5 Hour ago",
            "Image": "blog-img.png",
            "workMode": "onsite",
            "Job Type": "Full Time",
            "Salary": "₹ 35k - 50k"
        },
        {
            "Title": "Python Backend Intern",
            "Company": "AlphaStream AI",
            "Location": "JLN Marg Jaipur, RJ 302017",
            "timePosted": "8 Hour ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Internship",
            "Salary": "₹ 10k - 15k"
        },
        {
            "Title": "Lead Cyber Security Analyst",
            "Company": "ShieldNet Security",
            "Location": "VIP Road Zirakpur, PB 140603",
            "timePosted": "1 Day ago",
            "Image": "blog-img.png",
            "workMode": "hybrid",
            "Job Type": "Full Time",
            "Salary": "₹ 90k - 140k"
        },
        {
            "Title": "UI/UX Product Designer",
            "Company": "PixelPerfect Studios",
            "Location": "Indiranagar Bangalore, KA 560038",
            "timePosted": "1 Day ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 50k - 75k"
        },
        {
            "Title": "Social Media Manager",
            "Company": "BuzzMedia Agency",
            "Location": "Connaught Place New Delhi, DL 100001",
            "timePosted": "2 Day ago",
            "Image": "blog-img.png",
            "workMode": "hybrid",
            "Job Type": "Part Time",
            "Salary": "₹ 20k - 30k"
        },
        {
            "Title": "Machine Learning Engineer",
            "Company": "DeepMind Web Labs",
            "Location": "Silicon Valley Bangalore, KA 560001",
            "timePosted": "2 Day ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 100k - 160k"
        },
        {
            "Title": "Content Writer & Editor",
            "Company": "ScribePublishers",
            "Location": "MG Road Gurugram, HR 122002",
            "timePosted": "3 Day ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Freelance",
            "Salary": "₹ 15k - 25k"
        },
        {
            "Title": "Executive Assistant",
            "Company": "CoreCorp Industries",
            "Location": "Bandra Kurla Complex Mumbai, MH 400051",
            "timePosted": "3 Day ago",
            "Image": "blog-img.png",
            "workMode": "onsite",
            "Job Type": "Full Time",
            "Salary": "₹ 30k - 40k"
        },
        {
            "Title": "Network Security Administrator",
            "Company": "NetLink Connect",
            "Location": "Sector 62 Noida, UP 201301",
            "timePosted": "4 Day ago",
            "Image": "blog-img.png",
            "workMode": "onsite",
            "Job Type": "Full Time",
            "Salary": "₹ 45k - 65k"
        },
        {
            "Title": "Corporate Legal Counsel",
            "Company": "LexJuris Associates",
            "Location": "Connaught Place New Delhi, DL 100001",
            "timePosted": "4 Day ago",
            "Image": "blog-img.png",
            "workMode": "hybrid",
            "Job Type": "Full Time",
            "Salary": "₹ 70k - 110k"
        },
        {
            "Title": "Cloud Solutions Architect",
            "Company": "SkyHigh Tech Solutions",
            "Location": "Hitech City Hyderabad, TG 500081",
            "timePosted": "5 Day ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Full Time",
            "Salary": "₹ 110k - 180k"
        },
        {
            "Title": "Front-End Web Developer Intern",
            "Company": "DevSpark Incubator",
            "Location": "VIP Road Zirakpur, PB 140603",
            "timePosted": "1 Week ago",
            "Image": "blog-img.png",
            "workMode": "onsite",
            "Job Type": "Internship",
            "Salary": "₹ 12k - 18k"
        },
        {
            "Title": "Customer Success Manager",
            "Company": "SaaSify Global",
            "Location": "Indiranagar Bangalore, KA 560038",
            "timePosted": "1 Week ago",
            "Image": "blog-img.png",
            "workMode": "hybrid",
            "Job Type": "Full Time",
            "Salary": "₹ 50k - 70k"
        },
        {
            "Title": "Financial Risk Analyst",
            "Company": "Apex Wealth Management",
            "Location": "Bandra Kurla Complex Mumbai, MH 400051",
            "timePosted": "1 Week ago",
            "Image": "blog-img.png",
            "workMode": "onsite",
            "Job Type": "Full Time",
            "Salary": "₹ 55k - 80k"
        },
        {
            "Title": "Temporary Technical Support",
            "Company": "QuickFix Helpdesk",
            "Location": "JLN Marg Jaipur, RJ 302017",
            "timePosted": "2 Week ago",
            "Image": "blog-img.png",
            "workMode": "remote",
            "Job Type": "Temporary",
            "Salary": "₹ 20k - 28k"
        }
    ];

    const [searchTitle, setSearchTitle] = useState("");
    const [searchLocation, setSearchLocation] = useState("");
    const [searchCategory, setSearchCategory] = useState("");

    const [appliedFilters, setAppliedFilters] = useState({
        title: "",
        location: "",
        category: ""
    });

    const [sortOrder, setSortOrder] = useState("az");

    const [selectedJobTypes, setSelectedJobTypes] = useState([]);
    const [selectedSalaries, setSelectedSalaries] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSearchSubmit = () => {
        setAppliedFilters({
            title: searchTitle,
            location: searchLocation,
            category: searchCategory
        });
        setCurrentPage(1);
    };

    const handleCheckboxChange = (value, state, setState) => {
        if (state.includes(value)) {
            setState(state.filter(item => item !== value));
        } else {
            setState([...state, value]);
        }
        setCurrentPage(1);
    };

    const uniqueJobTypes = [...new Set(jobListings.map(job => job["Job Type"]))].filter(Boolean);
    const uniqueSalaries = [...new Set(jobListings.map(job => job.Salary))].filter(Boolean);

    const uniqueLocations = [...new Set(jobListings.map(job => {
        const parts = job.Location.split(' ');
        return parts.length >= 3 ? `${parts[parts.length - 3].replace(',', '')}, ${parts[parts.length - 2]}` : job.Location;
    }))].filter(Boolean);

    const filteredJobs = jobListings.filter(job => {
        const matchesTitle = job.Title.toLowerCase().includes(appliedFilters.title.toLowerCase()) ||
            job.Company.toLowerCase().includes(appliedFilters.title.toLowerCase());
        const matchesSearchLocation = job.Location.toLowerCase().includes(appliedFilters.location.toLowerCase());
        const matchesCategory = appliedFilters.category === "" || job.Title.toLowerCase().includes(appliedFilters.category.toLowerCase());

        const matchesJobTypeCheckbox = selectedJobTypes.length === 0 || selectedJobTypes.includes(job["Job Type"]);
        const matchesSalaryCheckbox = selectedSalaries.length === 0 || selectedSalaries.includes(job.Salary);
        const matchesLocationCheckbox = selectedLocations.length === 0 || selectedLocations.some(loc => job.Location.includes(loc));

        return matchesTitle && matchesSearchLocation && matchesCategory && matchesJobTypeCheckbox && matchesSalaryCheckbox && matchesLocationCheckbox;
    });

    const sortedAndFilteredJobs = [...filteredJobs].sort((a, b) => {
        if (sortOrder === "az") {
            return a.Title.localeCompare(b.Title);
        } else if (sortOrder === "za") {
            return b.Title.localeCompare(a.Title);
        }
        return 0;
    });

    const totalPages = Math.ceil(sortedAndFilteredJobs.length / itemsPerPage);
    const indexOfLastJob = currentPage * itemsPerPage;
    const indexOfFirstJob = indexOfLastJob - itemsPerPage;

    const currentJobsSlice = sortedAndFilteredJobs.slice(indexOfFirstJob, indexOfLastJob);

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const navigate = useNavigate();

    const handleApply = (item) => {
        const generatedSlug = `${item.Title}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        navigate(`/jobs/${generatedSlug}`, { state: { job: item } });
    };

    return (
        <div className="job_listings">
            <div className="content-wrapper">
                <div className="job_listings_search">
                    <div className="search_input_group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                            <path d="M11.5213 10.1388H10.7932L10.5351 9.88991C11.4697 8.80605 11.9833 7.42224 11.9822 5.99109C11.9822 4.80617 11.6308 3.64785 10.9725 2.66262C10.3142 1.67739 9.37851 0.909499 8.28378 0.456047C7.18905 0.00259585 5.98445 -0.116048 4.82229 0.11512C3.66013 0.346287 2.59262 0.916883 1.75475 1.75475C0.916883 2.59262 0.346287 3.66013 0.11512 4.82229C-0.116048 5.98445 0.00259585 7.18905 0.456047 8.28378C0.909499 9.37851 1.67739 10.3142 2.66262 10.9725C3.64785 11.6308 4.80617 11.9822 5.99109 11.9822C7.47504 11.9822 8.83916 11.4384 9.88991 10.5351L10.1388 10.7932V11.5213L14.7473 16.1206L16.1206 14.7473L11.5213 10.1388ZM5.99109 10.1388C3.69604 10.1388 1.84342 8.28614 1.84342 5.99109C1.84342 3.69604 3.69604 1.84342 5.99109 1.84342C8.28614 1.84342 10.1388 3.69604 10.1388 5.99109C10.1388 8.28614 8.28614 10.1388 5.99109 10.1388Z" fill="#6D17E1" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Job Title, Keyword or Company"
                            value={searchTitle}
                            onChange={(e) => setSearchTitle(e.target.value)}
                        />
                    </div>
                    <div className="search_input_group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" viewBox="0 0 23 23" fill="none">
                            <path d="M14.7472 9.21707C14.7472 7.1801 13.0973 5.53024 11.0604 5.53024C9.02339 5.53024 7.37354 7.1801 7.37354 9.21707C7.37354 11.254 9.02339 12.9039 11.0604 12.9039C13.0973 12.9039 14.7472 11.254 14.7472 9.21707ZM9.21695 9.21707C9.21695 8.20319 10.0465 7.37366 11.0604 7.37366C12.0742 7.37366 12.9038 8.20319 12.9038 9.21707C12.9038 10.2309 12.0742 11.0605 11.0604 11.0605C10.0465 11.0605 9.21695 10.2309 9.21695 9.21707Z" fill="#6D17E1" />
                            <path d="M10.5257 20.1024C10.6824 20.213 10.8759 20.2775 11.0603 20.2775C11.2446 20.2775 11.4382 20.2222 11.5948 20.1024C11.8714 19.8996 18.4616 15.1529 18.4339 9.20785C18.4339 5.14312 15.125 1.8342 11.0603 1.8342C6.99554 1.8342 3.68661 5.14312 3.68661 9.20785C3.65896 15.1436 10.2492 19.8996 10.5257 20.1024ZM11.0603 3.68683C14.1111 3.68683 16.5905 6.16622 16.5905 9.21707C16.6089 13.3094 12.5442 16.987 11.0603 18.1945C9.57631 16.987 5.51159 13.3187 5.53002 9.21707C5.53002 6.16622 8.00941 3.68683 11.0603 3.68683Z" fill="#6D17E1" />
                        </svg>
                        <select
                            value={searchLocation}
                            onChange={(e) => setSearchLocation(e.target.value)}
                        >
                            <option value="">Choose Location</option>
                            {uniqueLocations.map((loc, idx) => (
                                <option key={idx} value={loc}>{loc}</option>
                            ))}
                        </select>
                        <svg className="select_svg" xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none">
                            <path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63" />
                        </svg>
                    </div>
                    <div className="search_input_group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                            <path d="M18.9966 10.7013C18.9966 7.2255 18.9966 5.48716 17.9164 4.40785C17.2251 3.71657 16.2638 3.46771 14.7485 3.37738C13.8977 3.32761 12.8728 3.32761 11.623 3.32761H7.93615C6.68632 3.32761 5.66138 3.32761 4.81157 3.37738C3.29536 3.46678 2.33402 3.71564 1.64274 4.40785C0.5625 5.48716 0.5625 7.2255 0.5625 10.7013C0.5625 14.177 0.5625 15.9153 1.64274 16.9947C2.72298 18.074 4.4604 18.0749 7.93615 18.0749H11.623C15.0987 18.0749 16.8371 18.0749 17.9164 16.9947C18.5192 16.3928 18.7856 15.5863 18.9026 14.3881" stroke="#6D17E1" strokeWidth="1.125" strokeLinecap="round" />
                            <path d="M4.81152 3.37739C5.57009 3.35896 6.24017 2.82437 6.49825 2.11097L6.53051 2.01603L6.55355 1.94506C6.59226 1.828 6.61254 1.76994 6.63282 1.71832C6.76302 1.39463 6.98241 1.11453 7.26549 0.910584C7.54857 0.706636 7.88371 0.587211 8.23197 0.566187C8.28636 0.5625 8.34903 0.5625 8.4707 0.5625H11.0865C11.2091 0.5625 11.2708 0.5625 11.3261 0.566187C11.6744 0.587211 12.0096 0.706636 12.2926 0.910584C12.5757 1.11453 12.7951 1.39463 12.9253 1.71832C12.9465 1.76994 12.9659 1.82892 13.0046 1.94506L13.0285 2.01603C13.0451 2.06488 13.0525 2.08977 13.0608 2.11097C13.3189 2.82529 13.989 3.35896 14.7475 3.37739" stroke="#6D17E1" strokeWidth="1.125" />
                            <path d="M18.6851 5.83466C15.9107 7.63751 14.5236 8.53894 13.0617 8.99334C10.9243 9.65744 8.6357 9.65744 6.49827 8.99334C5.03553 8.53894 3.64836 7.63843 0.874023 5.83466M6.09272 7.93615V9.77956M13.4664 7.93615V9.77956" stroke="#6D17E1" strokeWidth="1.125" strokeLinecap="round" />
                        </svg>
                        <select
                            value={searchCategory}
                            onChange={(e) => setSearchCategory(e.target.value)}
                        >
                            <option value="">Choose Category</option>
                            <option value="Developer">Development</option>
                            <option value="Designer">Design & Creative</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Analyst">Analytics & Finance</option>
                        </select>
                        <svg className="select_svg" xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none">
                            <path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63" />
                        </svg>
                    </div>
                    <button className="search_action_btn" onClick={handleSearchSubmit}>Search</button>
                </div>
                <div className="job_listings_section">
                    <div className="job_listings_filters">
                        <div className="filter_header">
                            <h6>All Filters</h6>
                        </div>
                        {uniqueJobTypes.length > 0 && (
                            <div className="job_listing_filter_group">
                                <p className="filter_group_title">Job Type</p>
                                {uniqueJobTypes.map((type, idx) => (
                                    <label className="filter_checkbox_label" key={idx}>
                                        <input
                                            type="checkbox"
                                            checked={selectedJobTypes.includes(type)}
                                            onChange={() => handleCheckboxChange(type, selectedJobTypes, setSelectedJobTypes)}
                                        />
                                        <span>{type}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {uniqueSalaries.length > 0 && (
                            <div className="job_listing_filter_group">
                                <p className="filter_group_title">Salary</p>
                                {uniqueSalaries.map((salary, idx) => (
                                    <label className="filter_checkbox_label" key={idx}>
                                        <input
                                            type="checkbox"
                                            checked={selectedSalaries.includes(salary)}
                                            onChange={() => handleCheckboxChange(salary, selectedSalaries, setSelectedSalaries)}
                                        />
                                        <span>{salary}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {uniqueLocations.length > 0 && (
                            <div className="job_listing_filter_group">
                                <p className="filter_group_title">Location</p>
                                {uniqueLocations.map((loc, idx) => (
                                    <label className="filter_checkbox_label" key={idx}>
                                        <input
                                            type="checkbox"
                                            checked={selectedLocations.includes(loc)}
                                            onChange={() => handleCheckboxChange(loc, selectedLocations, setSelectedLocations)}
                                        />
                                        <span>{loc}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="job_listings_content">
                        <div className="results_count_bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <p>Showing 1 – {sortedAndFilteredJobs.length} of {sortedAndFilteredJobs.length} results</p>
                            <div className="sort_dropdown_wrapper">
                                Sort By:
                                <select
                                    value={sortOrder}
                                    onChange={(e) => setSortOrder(e.target.value)}>
                                    <option value="az">A to Z</option>
                                    <option value="za">Z to A</option>
                                </select>
                                <svg className="select_svg" xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none">
                                    <path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63" />
                                </svg>
                            </div>
                        </div>
                        {currentJobsSlice.length > 0 ? (
                            currentJobsSlice.map((item, index) => (
                                <div className="job_listings_cards" key={index}>
                                    <div className="job_card_left_meta">
                                        <div className="job_card_img_container">
                                            <img src={`../src/assets/${item.Image}`} alt={`${item.Title}`} />
                                        </div>
                                        <div className="job_details_main_text">
                                            <h4>{item.Title}</h4>
                                            <div className="job_badges_row">
                                                <span className="badge badge_workmode">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="9" height="13" viewBox="0 0 9 13" fill="none">
                                                        <path d="M8.5 4.25C8.5 3.69188 8.39007 3.13923 8.17649 2.6236C7.96291 2.10796 7.64985 1.63945 7.2552 1.2448C6.86055 0.850147 6.39204 0.537094 5.8764 0.323512C5.36077 0.109929 4.80812 0 4.25 0C3.69188 0 3.13923 0.109929 2.6236 0.323512C2.10796 0.537094 1.63945 0.850147 1.2448 1.2448C0.850147 1.63945 0.537094 2.10796 0.323512 2.6236C0.109929 3.13923 -8.3166e-09 3.69188 0 4.25C0 5.09211 0.248321 5.87532 0.670893 6.53589H0.666036L4.25 12.1429L7.83396 6.53589H7.82971C8.26742 5.85383 8.50007 5.06043 8.5 4.25ZM4.25 6.07143C3.76693 6.07143 3.30364 5.87953 2.96206 5.53794C2.62047 5.19636 2.42857 4.73307 2.42857 4.25C2.42857 3.76693 2.62047 3.30364 2.96206 2.96206C3.30364 2.62047 3.76693 2.42857 4.25 2.42857C4.73307 2.42857 5.19636 2.62047 5.53794 2.96206C5.87953 3.30364 6.07143 3.76693 6.07143 4.25C6.07143 4.73307 5.87953 5.19636 5.53794 5.53794C5.19636 5.87953 4.73307 6.07143 4.25 6.07143Z" fill="#6D17E1" />
                                                    </svg>
                                                    {item.workMode}
                                                </span>
                                                <span className="badge badge_jobtype">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                                                        <path d="M5.83333 0C9.05508 0 11.6667 2.61158 11.6667 5.83333C11.6667 9.05508 9.05508 11.6667 5.83333 11.6667C2.61158 11.6667 0 9.05508 0 5.83333C0 2.61158 2.61158 0 5.83333 0ZM5.83333 1.16667C4.59566 1.16667 3.40867 1.65833 2.5335 2.5335C1.65833 3.40867 1.16667 4.59566 1.16667 5.83333C1.16667 7.07101 1.65833 8.258 2.5335 9.13317C3.40867 10.0083 4.59566 10.5 5.83333 10.5C7.07101 10.5 8.258 10.0083 9.13317 9.13317C10.0083 8.258 10.5 7.07101 10.5 5.83333C10.5 4.59566 10.0083 3.40867 9.13317 2.5335C8.258 1.65833 7.07101 1.16667 5.83333 1.16667ZM5.83333 2.33333C5.97621 2.33335 6.11411 2.38581 6.22088 2.48075C6.32765 2.57569 6.39587 2.70652 6.41258 2.84842L6.41667 2.91667V5.59183L7.99575 7.17092C8.10037 7.27589 8.16111 7.41675 8.16563 7.56489C8.17016 7.71303 8.11812 7.85733 8.0201 7.9685C7.92209 8.07966 7.78543 8.14934 7.63789 8.1634C7.49035 8.17745 7.343 8.13482 7.22575 8.04417L7.17092 7.99575L5.42092 6.24575C5.33025 6.15501 5.27203 6.03692 5.25525 5.90975L5.25 5.83333V2.91667C5.25 2.76196 5.31146 2.61358 5.42085 2.50419C5.53025 2.39479 5.67862 2.33333 5.83333 2.33333Z" fill="#6D17E1" />
                                                    </svg>
                                                    {item["Job Type"]}
                                                </span>
                                                <span className="badge badge_salary">{item.Salary}</span>
                                            </div>
                                            <div className="job_company_location_subtext">
                                                <span className="company_name_item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                        <path d="M7.9005 0.139976C7.71816 0.0479447 7.51675 0 7.3125 0C7.10825 0 6.90684 0.0479447 6.7245 0.139976L0.9015 3.07098C-0.3285 3.68973 0.096 5.56623 1.4895 5.56623H3V11.2505H1.6875C1.23995 11.2505 0.810725 11.4283 0.494257 11.7447C0.17779 12.0612 0 12.4904 0 12.938C0 13.3855 0.17779 13.8148 0.494257 14.1312C0.810725 14.4477 1.23995 14.6255 1.6875 14.6255H12.9375C13.3851 14.6255 13.8143 14.4477 14.1307 14.1312C14.4472 13.8148 14.625 13.3855 14.625 12.938C14.625 12.4904 14.4472 12.0612 14.1307 11.7447C13.8143 11.4283 13.3851 11.2505 12.9375 11.2505H11.625V5.56548H13.1355C14.529 5.56548 14.9528 3.68973 13.7235 3.07098L7.9005 0.139976ZM4.125 11.2505V5.56548H6.75V11.2505H4.125ZM7.875 11.2505V5.56548H10.5V11.2505H7.875Z" fill="#8492A6" />
                                                    </svg>
                                                    {item.Company}
                                                </span>
                                                <span className="location_text_item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="15" viewBox="0 0 11 15" fill="none">
                                                        <path d="M10.5 5.25C10.5 4.56056 10.3642 3.87787 10.1004 3.24091C9.83653 2.60395 9.44982 2.0252 8.96231 1.53769C8.4748 1.05018 7.89605 0.66347 7.25909 0.399632C6.62213 0.135795 5.93944 0 5.25 0C4.56056 0 3.87787 0.135795 3.24091 0.399632C2.60395 0.66347 2.0252 1.05018 1.53769 1.53769C1.05018 2.0252 0.66347 2.60395 0.399632 3.24091C0.135795 3.87787 -1.02735e-08 4.56056 0 5.25C0 6.29025 0.30675 7.25775 0.82875 8.07375H0.82275L5.25 15L9.67725 8.07375H9.672C10.2127 7.2312 10.5001 6.25112 10.5 5.25ZM5.25 7.5C4.65326 7.5 4.08097 7.26295 3.65901 6.84099C3.23705 6.41903 3 5.84674 3 5.25C3 4.65326 3.23705 4.08097 3.65901 3.65901C4.08097 3.23705 4.65326 3 5.25 3C5.84674 3 6.41903 3.23705 6.84099 3.65901C7.26295 4.08097 7.5 4.65326 7.5 5.25C7.5 5.84674 7.26295 6.41903 6.84099 6.84099C6.41903 7.26295 5.84674 7.5 5.25 7.5Z" fill="#8492A6" />
                                                    </svg>
                                                    {item.Location}
                                                </span>
                                                <span className="timestamp_item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
                                                        <path d="M7.5 0C11.6423 0 15 3.35775 15 7.5C15 11.6423 11.6423 15 7.5 15C3.35775 15 0 11.6423 0 7.5C0 3.35775 3.35775 0 7.5 0ZM7.5 1.5C5.9087 1.5 4.38258 2.13214 3.25736 3.25736C2.13214 4.38258 1.5 5.9087 1.5 7.5C1.5 9.0913 2.13214 10.6174 3.25736 11.7426C4.38258 12.8679 5.9087 13.5 7.5 13.5C9.0913 13.5 10.6174 12.8679 11.7426 11.7426C12.8679 10.6174 13.5 9.0913 13.5 7.5C13.5 5.9087 12.8679 4.38258 11.7426 3.25736C10.6174 2.13214 9.0913 1.5 7.5 1.5ZM7.5 3C7.6837 3.00002 7.861 3.06747 7.99828 3.18954C8.13556 3.31161 8.22326 3.47981 8.24475 3.66225L8.25 3.75V7.1895L10.2802 9.21975C10.4148 9.35472 10.4929 9.53583 10.4987 9.72629C10.5045 9.91675 10.4376 10.1023 10.3116 10.2452C10.1855 10.3881 10.0098 10.4777 9.82014 10.4958C9.63045 10.5139 9.44099 10.4591 9.29025 10.3425L9.21975 10.2802L6.96975 8.03025C6.85318 7.91358 6.77832 7.76175 6.75675 7.59825L6.75 7.5V3.75C6.75 3.55109 6.82902 3.36032 6.96967 3.21967C7.11032 3.07902 7.30109 3 7.5 3Z" fill="#8492A6" />
                                                    </svg>
                                                    {item.timePosted}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="job_listings_btn">
                                        <button onClick={() => handleApply(item)}>Apply</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no_jobs_found">
                                <p>No job postings match your selected filtering rules.</p>
                            </div>
                        )}
                        {totalPages > 1 && (
                            <div className="pagination_wrapper">
                                <button
                                    className="pagination_btn prev_btn"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                        <path d="M0.235449 5.3999L4.43545 9.6749C4.73545 9.9749 5.18545 9.9749 5.48545 9.6749C5.78545 9.3749 5.78545 8.9249 5.48545 8.6249L1.81045 4.9499L5.48545 1.2749C5.63545 1.1249 5.71045 0.974901 5.71045 0.749901C5.71045 0.299901 5.41045 -9.91559e-05 4.96045 -9.91166e-05C4.73545 -9.90969e-05 4.58545 0.0749007 4.43545 0.2249L0.160449 4.4999C-0.0645509 4.6499 -0.0645503 5.0999 0.235449 5.3999Z" fill="#6C6969" />
                                    </svg>
                                </button>
                                {pageNumbers.map((number) => (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        className={`pagination_btn page_num_btn ${currentPage === number ? "active" : ""}`}
                                    >
                                        {number}
                                    </button>
                                ))}
                                <button
                                    className="pagination_btn next_btn"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                        <path d="M5.475 4.5L1.275 0.225C0.975 -0.075 0.525 -0.075 0.225 0.225C-0.0749998 0.525 -0.0749998 0.975 0.225 1.275L3.9 4.95L0.225 8.625C0.0750001 8.775 0 8.925 0 9.15C0 9.6 0.3 9.9 0.75 9.9C0.975 9.9 1.125 9.825 1.275 9.675L5.55 5.4C5.775 5.25 5.775 4.8 5.475 4.5Z" fill="#6C6969" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobListings;