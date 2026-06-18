import React, { useState } from "react";

function JobDetails({ job }) {
    const [activeIndex, setActiveIndex] = useState(0);
    if (!job) {
        return (
            <div className="job_details">
                <div className="content-wrapper">
                    <p>No job details found. Please return to the listings page.</p>
                </div>
            </div>
        );
    }

    const accordionData = [
        {
            title: "Job description",
            content: job.Description || "Discover a world of career opportunities tailored to your skills, experience, and ambitions. Whether you are beginning your professional journey or searching for your next big career move, our platform helps you connect with trusted companies and exciting job openings across multiple industries and locations. Browse thousands of curated job listings designed for freshers, experienced professionals, and remote workers alike."
        },
        {
            title: "Responsibilities",
            content: job.Responsibilities || "Core responsibilities include executing feature updates, collaborating with design and product teams to translate layouts into reliable components, writing semantic structures, and optimizing runtime rendering performance across target environments."
        },
        {
            title: "Qualification",
            content: job.Qualifications || "Strong fundamental knowledge of component lifecycle patterns, predictable state management containers, asynchronous data flow layouts, and cross-browser responsive layout paradigms."
        },
        {
            title: "Skills & Experience",
            content: job.SkillsExperience || "Minimum of 5 years of active professional domain experience required. Proven track record managing modular codebases, design token architectures, and performance instrumentation cycles."
        }
    ];

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="job_details">
            <div className="content-wrapper">
                <div className="job_details_section">
                    <div className="job_details_content">
                        <div className="job_details_summary">
                            <h5>Opportunity Summary</h5>
                            <div className="job_details_list">
                                <span>Published on: <p>29 Sep 2026</p></span>
                                <span>Vacancy: <p>01</p></span>
                                <span>Job type: <p>{job["Job Type"]}</p></span>
                                <span>Experience: <p>At least 5 Year</p></span>
                                <span>Job location: <p>Mohali</p></span>
                                <span>Category: <p>Engineer</p></span>
                                <span>Gender: <p>Male</p></span>
                                <span>Salary: <p>{job.Salary}</p></span>
                                <span>Application deadline: <p>20 Jan 2026</p></span>
                            </div>
                        </div>
                        <div className="job_details_summary">
                            <h5>Job location</h5>
                            <div className="job_details_location">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6859.633704647308!2d76.69886641210768!3d30.723548785968635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fef57f82df5bd%3A0x92f440a10e942199!2sIndustrial%20Area%20Phase%207!5e0!3m2!1sen!2sin!4v1781777699534!5m2!1sen!2sin" width="400" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                            <div className="job_details_share">
                                <h5>Share This Opportunity</h5>
                                <div className="job_details_icons">
                                    <ul>
                                        <li>
                                            <a>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="9" height="14" viewBox="0 0 9 14" fill="none">
                                                    <path d="M7.33301 1.33337H5.99967C4.33301 1.33337 3.33301 2.33337 3.33301 4.00004V12" stroke="black" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M1.33301 6.66675H5.99967" stroke="black" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </a>
                                        </li>
                                        <li>
                                            <a>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="11" viewBox="0 0 12 11" fill="none">
                                                    <path d="M9.06 0H10.825L6.97 4.405L11.505 10.4H7.955L5.1725 6.765L1.9925 10.4H0.225L4.3475 5.6875L0 0H3.64L6.1525 3.3225L9.06 0ZM8.44 9.345H9.4175L3.1075 1H2.0575L8.44 9.345Z" fill="black" />
                                                </svg>
                                            </a>
                                        </li>
                                        <li>
                                            <a>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="12" viewBox="0 0 13 12" fill="none">
                                                    <path d="M2.66667 1.334C2.66649 1.68762 2.52584 2.02669 2.27567 2.27661C2.0255 2.52654 1.68629 2.66684 1.33267 2.66667C0.979045 2.66649 0.639976 2.52584 0.390053 2.27567C0.140129 2.0255 -0.000176644 1.68629 1.66908e-07 1.33267C0.000176978 0.979045 0.140822 0.639976 0.390996 0.390053C0.641169 0.140129 0.980378 -0.000176644 1.334 1.66908e-07C1.68762 0.000176978 2.02669 0.140822 2.27661 0.390996C2.52654 0.641169 2.66684 0.980378 2.66667 1.334ZM2.70667 3.654H0.0400001V12.0007H2.70667V3.654ZM6.92 3.654H4.26667V12.0007H6.89333V7.62067C6.89333 5.18067 10.0733 4.954 10.0733 7.62067V12.0007H12.7067V6.714C12.7067 2.60067 8 2.754 6.89333 4.774L6.92 3.654Z" fill="black" />
                                                </svg>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="job_details_description">
                        <div className="job_details_banner">
                            <img src="../src/assets/blog-detailed.png" alt={`${job.Title}`} />
                        </div>
                        <div className="job_featured_title">
                            <div className="job_details_featured">
                                <img src={`../src/assets/${job.Image}`} alt={`${job.Title}`} />
                            </div>
                            <div className="job_details_title">
                                <div className="job_details_location">
                                    <h6>{job.Title}</h6>
                                    <div className="job_featured_location">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M6.18525 14.2267C7.04783 13.444 7.84615 12.5933 8.5725 11.6827C10.1025 9.7605 11.0332 7.86525 11.0963 6.18C11.1212 5.4951 11.0078 4.81219 10.7629 4.17209C10.518 3.53198 10.1466 2.9478 9.67087 2.45444C9.19515 1.96109 8.62486 1.56868 7.99409 1.30065C7.36331 1.03263 6.68498 0.894491 5.99963 0.894491C5.31427 0.894491 4.63594 1.03263 4.00516 1.30065C3.37439 1.56868 2.8041 1.96109 2.32838 2.45444C1.85265 2.9478 1.48125 3.53198 1.23634 4.17209C0.991443 4.81219 0.878071 5.4951 0.903 6.18C0.96675 7.86525 1.89825 9.7605 3.4275 11.6827C4.15385 12.5933 4.95217 13.444 5.81475 14.2267C5.89775 14.3018 5.9595 14.3562 6 14.3903L6.18525 14.2267ZM5.4465 15.1005C5.4465 15.1005 0 10.5135 0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 10.5135 6.5535 15.1005 6.5535 15.1005C6.2505 15.3795 5.75175 15.3765 5.4465 15.1005ZM6 8.1C6.55695 8.1 7.0911 7.87875 7.48492 7.48492C7.87875 7.0911 8.1 6.55695 8.1 6C8.1 5.44305 7.87875 4.9089 7.48492 4.51508C7.0911 4.12125 6.55695 3.9 6 3.9C5.44305 3.9 4.9089 4.12125 4.51508 4.51508C4.12125 4.9089 3.9 5.44305 3.9 6C3.9 6.55695 4.12125 7.0911 4.51508 7.48492C4.9089 7.87875 5.44305 8.1 6 8.1ZM6 9C5.20435 9 4.44129 8.68393 3.87868 8.12132C3.31607 7.55871 3 6.79565 3 6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3C6.79565 3 7.55871 3.31607 8.12132 3.87868C8.68393 4.44129 9 5.20435 9 6C9 6.79565 8.68393 7.55871 8.12132 8.12132C7.55871 8.68393 6.79565 9 6 9Z" fill="#636363" />
                                        </svg>
                                        <p>{job.Location}</p>
                                    </div>
                                </div>
                                <div className="job_details_btn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none">
                                        <rect width="28" height="28" rx="14" fill="#F4EBFF" />
                                        <path d="M8 21.5V7.616C8 7.15533 8.15433 6.771 8.463 6.463C8.77167 6.155 9.156 6.00067 9.616 6H18.385C18.845 6 19.2293 6.15433 19.538 6.463C19.8467 6.77167 20.0007 7.156 20 7.616V21.5L14 18.923L8 21.5ZM9 19.95L14 17.8L19 19.95V7.616C19 7.462 18.936 7.32067 18.808 7.192C18.68 7.06333 18.5387 6.99933 18.384 7H9.616C9.462 7 9.32067 7.064 9.192 7.192C9.06333 7.32 8.99933 7.46133 9 7.616V19.95Z" fill="#6D17E1" />
                                    </svg>
                                    <a>Apply</a>
                                </div>
                            </div>
                        </div>
                        <div className="job_details_faq">
                            {accordionData.map((item, index) => {
                                const isOpen = activeIndex === index;
                                return (
                                    <div key={index} className={`job_details_accordion ${isOpen ? "active" : ""}`}
                                    >
                                        <div className="accordion_header" onClick={() => toggleAccordion(index)}>
                                            <h5>{item.title}</h5>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="9" viewBox="0 0 16 9" fill="none">
                                                <path d="M15 1L8 8L0.999999 1" stroke="#6C6969" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        {isOpen && (
                                            <div className="accordion_content">
                                                <p>{item.content}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="job_details_related">
                            <h4>Related Jobs</h4>
                            <div className="job_related_posts">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetails;