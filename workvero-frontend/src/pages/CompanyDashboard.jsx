import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from 'react-router-dom';
import Loader from "../components/Loader";

function CompanyDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplications: 0,
        shortlistedCount: 0,
        interviewsCount: 0
    });
    const [jobs, setJobs] = useState([]);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const calculateStatsAndFetchJobs = async () => {
            try {
                setLoading(true);
                setError(null);
                const [jobsResponse, applicantsResponse] = await Promise.all([
                    api.get("/job/my-jobs"),
                    api.get("/company/me/applicants?page=1&pageSize=4"),
                    new Promise(resolve => setTimeout(resolve, 600))
                ]);
                const jobsData = jobsResponse.data?.data?.jobs || [];
                const recentApplicants = applicantsResponse.data?.applications || [];
                const statusCounts = applicantsResponse.data?.statusCounts || {};
                const totalApplications = applicantsResponse.data?.totalApplications || 0;
                if (Array.isArray(jobsData)) {
                    setJobs(jobsData);
                }
                setApplicants(recentApplicants);
                setStats({
                    totalJobs: jobsData.length,
                    totalApplications,
                    shortlistedCount: statusCounts.HIRED || 0,
                    interviewsCount: statusCounts.INTERVIEW || 0
                });
            } catch (err) {
                console.error("Failed to parse dashboard data from API:", err);
                setError("Unable to process dashboard statistics.");
            } finally {
                setLoading(false);
            }
        };

        calculateStatsAndFetchJobs();
    }, []);

    const recentJobs = [...jobs]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 5);

    const getRelativeTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        const posted = new Date(dateStr);
        const now = new Date();
        const diffMs = now - posted;
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffMinutes < 1) return 'Just now';
        if (diffMinutes < 60) return `${diffMinutes} min ago`;
        if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 30) return `${diffDays} days ago`;
        const diffMonths = Math.floor(diffDays / 30);
        if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        const diffYears = Math.floor(diffDays / 365);
        return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
    };

    const getFileUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
            return path;
        }
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, "");
        return encodeURI(`${baseUrl}/${path.replace(/^\//, "")}`);
    };

    return (
        <>
            {loading && <Loader />}
            <div className={`company_dashboard ${loading ? "loading" : ""}`}>
                <h2>Dashboard</h2>
                <div className="company_dashboard_section">
                    <ul>
                        <li>
                            <div className="company_dashboard_details">
                                <h3>{stats.totalJobs}</h3>
                                <p>Total Jobs</p>
                            </div>
                            <div className="company_dashboard_icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="27" viewBox="0 0 22 27" fill="none">
                                    <path d="M10.6667 0L10.8227 0.00933329C11.1203 0.0444318 11.3974 0.178772 11.6093 0.390682C11.8212 0.602591 11.9556 0.879711 11.9907 1.17733L12 1.33333V6.66667L12.0067 6.86667C12.0544 7.50156 12.3277 8.09844 12.7771 8.54937C13.2266 9.00031 13.8226 9.27555 14.4573 9.32533L14.6667 9.33333H20L20.156 9.34267C20.4536 9.37777 20.7307 9.51211 20.9427 9.72402C21.1546 9.93593 21.2889 10.213 21.324 10.5107L21.3333 10.6667V22.6667C21.3334 23.6869 20.9436 24.6687 20.2436 25.411C19.5437 26.1533 18.5865 26.6001 17.568 26.66L17.3333 26.6667H4C2.97972 26.6667 1.99798 26.2769 1.25565 25.577C0.513324 24.877 0.0665233 23.9199 0.00666683 22.9013L6.21393e-09 22.6667V4C-5.6829e-05 2.97972 0.389767 1.99798 1.08971 1.25565C1.78966 0.513324 2.74681 0.0665233 3.76533 0.00666682L4 0H10.6667Z" fill="#6D17E1" />
                                    <path d="M20 6.6667H14.6666L14.6653 1.33203L20 6.6667Z" fill="#6D17E1" />
                                </svg>
                            </div>
                        </li>
                        <li>
                            <div className="company_dashboard_details">
                                <h3>{stats.totalApplications}</h3>
                                <p>Total Applications</p>
                            </div>
                            <div className="company_dashboard_icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="25" viewBox="0 0 27 25" fill="none">
                                    <path d="M13.3373 2.0407C14.861 0.677578 16.8488 -0.0504624 18.8925 0.0060722C20.9361 0.0626068 22.8806 0.899426 24.3266 2.3447C25.7711 3.78896 26.6084 5.73103 26.6669 7.77282C26.7254 9.81461 26.0007 11.8014 24.6413 13.326L13.3346 24.6487L2.03063 13.326C0.669641 11.8007 -0.0557625 9.81211 0.00334838 7.76868C0.0624592 5.72525 0.9016 3.78197 2.34849 2.33781C3.79539 0.893646 5.74025 0.058177 7.78379 0.00292539C9.82733 -0.0523262 11.8145 0.676832 13.3373 2.0407Z" fill="#6D17E1" />
                                </svg>
                            </div>
                        </li>
                        <li>
                            <div className="company_dashboard_details">
                                <h3>{stats.shortlistedCount}</h3>
                                <p>Hired</p>
                            </div>
                            <div className="company_dashboard_icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30" fill="none">
                                    <mask id="mask0_677_338" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="30">
                                        <path d="M1.33325 28V2.66671C1.33325 2.31309 1.47373 1.97395 1.72378 1.7239C1.97383 1.47385 2.31296 1.33337 2.66659 1.33337H21.3333C21.6869 1.33337 22.026 1.47385 22.2761 1.7239C22.5261 1.97395 22.6666 2.31309 22.6666 2.66671V28L11.9999 22.4847L1.33325 28Z" fill="white" stroke="white" strokeWidth="2.66667" strokeLinejoin="round" />
                                        <path d="M6.6665 10.6667H17.3332" stroke="black" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round" />
                                    </mask>
                                    <g mask="url(#mask0_677_338)">
                                        <path d="M-4 -1.33325H28V30.6667H-4V-1.33325Z" fill="#6D17E1" />
                                    </g>
                                </svg>
                            </div>
                        </li>
                        <li>
                            <div className="company_dashboard_details">
                                <h3>{stats.interviewsCount}</h3>
                                <p>Interviews</p>
                            </div>
                            <div className="company_dashboard_icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="31" height="30" viewBox="0 0 31 30" fill="none">
                                    <path d="M24.6667 0C26.3022 0 27.8707 0.6497 29.0272 1.80617C30.1836 2.96265 30.8333 4.53116 30.8333 6.16667V18.5C30.8333 20.1355 30.1836 21.704 29.0272 22.8605C27.8707 24.017 26.3022 24.6667 24.6667 24.6667H17.3838L10.0424 29.0712C9.82133 29.2039 9.57049 29.279 9.31286 29.2897C9.05523 29.3003 8.79904 29.2462 8.56775 29.1322C8.33645 29.0183 8.13743 28.8481 7.98891 28.6373C7.84038 28.4266 7.74709 28.1819 7.71758 27.9257L7.70833 27.75V24.6667H6.16667C4.58454 24.6667 3.06294 24.0586 1.91658 22.9682C0.770224 21.8778 0.0868147 20.3885 0.00770851 18.8083L0 18.5V6.16667C0 4.53116 0.649701 2.96265 1.80617 1.80617C2.96265 0.6497 4.53116 0 6.16667 0H24.6667ZM18.5 13.875H9.25C8.84112 13.875 8.449 14.0374 8.15988 14.3265C7.87076 14.6157 7.70833 15.0078 7.70833 15.4167C7.70833 15.8255 7.87076 16.2177 8.15988 16.5068C8.449 16.7959 8.84112 16.9583 9.25 16.9583H18.5C18.9089 16.9583 19.301 16.7959 19.5901 16.5068C19.8792 16.2177 20.0417 15.8255 20.0417 15.4167C20.0417 15.0078 19.8792 14.6157 19.5901 14.3265C19.301 14.0374 18.9089 13.875 18.5 13.875ZM21.5833 7.70833H9.25C8.84112 7.70833 8.449 7.87076 8.15988 8.15988C7.87076 8.449 7.70833 8.84112 7.70833 9.25C7.70833 9.65888 7.87076 10.051 8.15988 10.3401C8.449 10.6292 8.84112 10.7917 9.25 10.7917H21.5833C21.9922 10.7917 22.3843 10.6292 22.6735 10.3401C22.9626 10.051 23.125 9.65888 23.125 9.25C23.125 8.84112 22.9626 8.449 22.6735 8.15988C22.3843 7.87076 21.9922 7.70833 21.5833 7.70833Z" fill="#6D17E1" />
                                </svg>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="company_jobs_applicants">
                    <div className="company_dashboard_jobs form_card">
                        <h3>Recent Job Post</h3>
                        <ul>
                            {recentJobs.length > 0 ? (
                                recentJobs.map((job) => (
                                    <li key={job.id || job._id}>
                                        <div className="job_item_meta">
                                            <h4 onClick={() => navigate(`/employer/manage-jobs/${job.id}`)}>{job.title}</h4>
                                        </div>
                                        <span className="job_item_applicants_count">
                                            {getRelativeTime(job.createdAt)}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p className="no_data_message">No jobs posted yet.</p>
                            )}
                        </ul>
                        <button onClick={() => navigate(`/employer/manage-jobs`)}>View All</button>
                    </div>
                    <div className="company_dashboard_applicants form_card">
                        <h3>Recent Applicants</h3>
                        <ul>
                            {applicants.length > 0 ? (
                                applicants.map((applicant) => {
                                    const profile = applicant.user?.candidate_profile;
                                    const candidateName = profile ? `${profile.firstName || ""} ${profile.lastName || ""}`.trim() : applicant.user?.name;
                                    const jobTitle = applicant.appliedJobs?.[0]?.jobTitle || "Unknown Position";
                                    return (
                                        <li key={applicant.id}>
                                            <div className="company_applicant_img">
                                                {profile?.photoUrl ? (
                                                    <img src={getFileUrl(profile.photoUrl)} alt={`${profile?.firstName} ${profile?.lastName}`} />
                                                ) : (
                                                    <div className="avatar-placeholder">
                                                        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="company_applicant_info">
                                                <div className="company_applicant_detail">
                                                    <h4 onClick={() => navigate(`/employer/applicants/${applicant?.id}`)}>{candidateName}</h4>
                                                    <p>{jobTitle}</p>
                                                </div>
                                                <div className="company_applicant_applied">
                                                    <span>{getRelativeTime(applicant.createdAt)}</span>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })
                            ) : (
                                <p className="no_data_message">No applications received yet.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CompanyDashboard;