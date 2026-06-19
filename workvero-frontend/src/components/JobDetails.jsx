import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function JobDetails({ job, allJobs = [] }) {
    const navigate = useNavigate();
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

    const relatedJobs = allJobs
        .filter((item) => {
            const matchCompany = item.Company?.trim().toLowerCase() === job.Company?.trim().toLowerCase();
            const isDifferentJob = item.Title !== job.Title;

            return matchCompany && isDifferentJob;
        })
        .slice(0, 4);

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

    const handleRelatedJobClick = (relatedJob) => {
        const generatedSlug = `${relatedJob.Title}`
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        navigate(`/jobs/${generatedSlug}`, {
            state: { job: relatedJob, allJobs: allJobs }
        });
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
                        {relatedJobs.length > 0 && (
                            <div className="job_details_related">
                                <h4>Related Jobs</h4>
                                <div className="job_related_posts">
                                    {relatedJobs.map((job, index) => (
                                        <div className="job_listings_cards" key={index}>
                                            <div className="job_card_left_meta">
                                                <div className="job_card_img_container">
                                                    <img src={`../src/assets/${job.Image}`} alt={`${job.Title}`} />
                                                </div>
                                                <div className="job_details_main_text">
                                                    <h4>{job.Title}</h4>
                                                    <div className="job_badges_row">
                                                        <span className="badge badge_workmode">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="13" viewBox="0 0 9 13" fill="none">
                                                                <path d="M8.5 4.25C8.5 3.69188 8.39007 3.13923 8.17649 2.6236C7.96291 2.10796 7.64985 1.63945 7.2552 1.2448C6.86055 0.850147 6.39204 0.537094 5.8764 0.323512C5.36077 0.109929 4.80812 0 4.25 0C3.69188 0 3.13923 0.109929 2.6236 0.323512C2.10796 0.537094 1.63945 0.850147 1.2448 1.2448C0.850147 1.63945 0.537094 2.10796 0.323512 2.6236C0.109929 3.13923 -8.3166e-09 3.69188 0 4.25C0 5.09211 0.248321 5.87532 0.670893 6.53589H0.666036L4.25 12.1429L7.83396 6.53589H7.82971C8.26742 5.85383 8.50007 5.06043 8.5 4.25ZM4.25 6.07143C3.76693 6.07143 3.30364 5.87953 2.96206 5.53794C2.62047 5.19636 2.42857 4.73307 2.42857 4.25C2.42857 3.76693 2.62047 3.30364 2.96206 2.96206C3.30364 2.62047 3.76693 2.42857 4.25 2.42857C4.73307 2.42857 5.19636 2.62047 5.53794 2.96206C5.87953 3.30364 6.07143 3.76693 6.07143 4.25C6.07143 4.73307 5.87953 5.19636 5.53794 5.53794C5.19636 5.87953 4.73307 6.07143 4.25 6.07143Z" fill="#6D17E1" />
                                                            </svg>
                                                            {job.workMode}
                                                        </span>
                                                        <span className="badge badge_jobtype">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
                                                                <path d="M5.83333 0C9.05508 0 11.6667 2.61158 11.6667 5.83333C11.6667 9.05508 9.05508 11.6667 5.83333 11.6667C2.61158 11.6667 0 9.05508 0 5.83333C0 2.61158 2.61158 0 5.83333 0ZM5.83333 1.16667C4.59566 1.16667 3.40867 1.65833 2.5335 2.5335C1.65833 3.40867 1.16667 4.59566 1.16667 5.83333C1.16667 7.07101 1.65833 8.258 2.5335 9.13317C3.40867 10.0083 4.59566 10.5 5.83333 10.5C7.07101 10.5 8.258 10.0083 9.13317 9.13317C10.0083 8.258 10.5 7.07101 10.5 5.83333C10.5 4.59566 10.0083 3.40867 9.13317 2.5335C8.258 1.65833 7.07101 1.16667 5.83333 1.16667ZM5.83333 2.33333C5.97621 2.33335 6.11411 2.38581 6.22088 2.48075C6.32765 2.57569 6.39587 2.70652 6.41258 2.84842L6.41667 2.91667V5.59183L7.99575 7.17092C8.10037 7.27589 8.16111 7.41675 8.16563 7.56489C8.17016 7.71303 8.11812 7.85733 8.0201 7.9685C7.92209 8.07966 7.78543 8.14934 7.63789 8.1634C7.49035 8.17745 7.343 8.13482 7.22575 8.04417L7.17092 7.99575L5.42092 6.24575C5.33025 6.15501 5.27203 6.03692 5.25525 5.90975L5.25 5.83333V2.91667C5.25 2.76196 5.31146 2.61358 5.42085 2.50419C5.53025 2.39479 5.67862 2.33333 5.83333 2.33333Z" fill="#6D17E1" />
                                                            </svg>
                                                            {job["Job Type"]}
                                                        </span>
                                                        <span className="badge badge_salary">{job.Salary}</span>
                                                    </div>
                                                    <div className="job_company_location_subtext">
                                                        <span className="company_name_item">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
                                                                <path d="M7.9005 0.139976C7.71816 0.0479447 7.51675 0 7.3125 0C7.10825 0 6.90684 0.0479447 6.7245 0.139976L0.9015 3.07098C-0.3285 3.68973 0.096 5.56623 1.4895 5.56623H3V11.2505H1.6875C1.23995 11.2505 0.810725 11.4283 0.494257 11.7447C0.17779 12.0612 0 12.4904 0 12.938C0 13.3855 0.17779 13.8148 0.494257 14.1312C0.810725 14.4477 1.23995 14.6255 1.6875 14.6255H12.9375C13.3851 14.6255 13.8143 14.4477 14.1307 14.1312C14.4472 13.8148 14.625 13.3855 14.625 12.938C14.625 12.4904 14.4472 12.0612 14.1307 11.7447C13.8143 11.4283 13.3851 11.2505 12.9375 11.2505H11.625V5.56548H13.1355C14.529 5.56548 14.9528 3.68973 13.7235 3.07098L7.9005 0.139976ZM4.125 11.2505V5.56548H6.75V11.2505H4.125ZM7.875 11.2505V5.56548H10.5V11.2505H7.875Z" fill="#8492A6" />
                                                            </svg>
                                                            {job.Company}
                                                        </span>
                                                        <span className="location_text_item">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="15" viewBox="0 0 11 15" fill="none">
                                                                <path d="M10.5 5.25C10.5 4.56056 10.3642 3.87787 10.1004 3.24091C9.83653 2.60395 9.44982 2.0252 8.96231 1.53769C8.4748 1.05018 7.89605 0.66347 7.25909 0.399632C6.62213 0.135795 5.93944 0 5.25 0C4.56056 0 3.87787 0.135795 3.24091 0.399632C2.60395 0.66347 2.0252 1.05018 1.53769 1.53769C1.05018 2.0252 0.66347 2.60395 0.399632 3.24091C0.135795 3.87787 -1.02735e-08 4.56056 0 5.25C0 6.29025 0.30675 7.25775 0.82875 8.07375H0.82275L5.25 15L9.67725 8.07375H9.672C10.2127 7.2312 10.5001 6.25112 10.5 5.25ZM5.25 7.5C4.65326 7.5 4.08097 7.26295 3.65901 6.84099C3.23705 6.41903 3 5.84674 3 5.25C3 4.65326 3.23705 4.08097 3.65901 3.65901C4.08097 3.23705 4.65326 3 5.25 3C5.84674 3 6.41903 3.23705 6.84099 3.65901C7.26295 4.08097 7.5 4.65326 7.5 5.25C7.5 5.84674 7.26295 6.41903 6.84099 6.84099C6.41903 7.26295 5.84674 7.5 5.25 7.5Z" fill="#8492A6" />
                                                            </svg>
                                                            {job.Location}
                                                        </span>
                                                        <span className="timestamp_item">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
                                                                <path d="M7.5 0C11.6423 0 15 3.35775 15 7.5C15 11.6423 11.6423 15 7.5 15C3.35775 15 0 11.6423 0 7.5C0 3.35775 3.35775 0 7.5 0ZM7.5 1.5C5.9087 1.5 4.38258 2.13214 3.25736 3.25736C2.13214 4.38258 1.5 5.9087 1.5 7.5C1.5 9.0913 2.13214 10.6174 3.25736 11.7426C4.38258 12.8679 5.9087 13.5 7.5 13.5C9.0913 13.5 10.6174 12.8679 11.7426 11.7426C12.8679 10.6174 13.5 9.0913 13.5 7.5C13.5 5.9087 12.8679 4.38258 11.7426 3.25736C10.6174 2.13214 9.0913 1.5 7.5 1.5ZM7.5 3C7.6837 3.00002 7.861 3.06747 7.99828 3.18954C8.13556 3.31161 8.22326 3.47981 8.24475 3.66225L8.25 3.75V7.1895L10.2802 9.21975C10.4148 9.35472 10.4929 9.53583 10.4987 9.72629C10.5045 9.91675 10.4376 10.1023 10.3116 10.2452C10.1855 10.3881 10.0098 10.4777 9.82014 10.4958C9.63045 10.5139 9.44099 10.4591 9.29025 10.3425L9.21975 10.2802L6.96975 8.03025C6.85318 7.91358 6.77832 7.76175 6.75675 7.59825L6.75 7.5V3.75C6.75 3.55109 6.82902 3.36032 6.96967 3.21967C7.11032 3.07902 7.30109 3 7.5 3Z" fill="#8492A6" />
                                                            </svg>
                                                            {job.timePosted}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="job_listings_btn">
                                                <button onClick={() => handleRelatedJobClick(job)}>Apply</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JobDetails;