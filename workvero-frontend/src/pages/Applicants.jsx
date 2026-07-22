import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../services/api";
import Loader from "../components/Loader";

function Applicants() {
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);
    const [params, setParams] = useState({ page: 1, limit: 8, jobType: "All Status" });

    const STATUS_BADGE_MAP = {
        APPLIED: { label: 'In Review', className: 'in-review' },
        INTERVIEW: { label: 'Interview', className: 'interview' },
        HIRED: { label: 'Selected', className: 'selected' },
        REJECTED: { label: 'Rejected', className: 'rejected' },
    };

    const getPaginationPages = () => {
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= params.page - 1 && i <= params.page + 1)) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== '...') {
                pages.push('...');
            }
        }
        return pages;
    };

    useEffect(() => {
        const fetchApplicants = async () => {
            setLoading(true);
            try {
                const [res] = await Promise.all([
                    api.get("/company/me/applicants", {
                        params: {
                            page: params.page,
                            pageSize: params.limit,
                            status: params.jobType !== "All Status" ? params.jobType : undefined
                        }
                    }),
                    new Promise(resolve => setTimeout(resolve, 600))
                ]);
                const dataList = res.data?.applications || [];
                const fetchedTotalPages = res.data?.totalPages || 1;
                setApplicants(dataList);
                setTotalPages(fetchedTotalPages);
                setError(null);
            } catch (err) {
                console.error("Error fetching applicants:", err);
                setError("Failed to load applicants data.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplicants();
    }, [params.page, params.limit, params.jobType]);

    const getFileUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
            return path;
        }
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, "");
        return encodeURI(
            `${baseUrl}/${path.replace(/^\//, "")}`
        );
    };

    return (
        <>
            {loading && <Loader />}
            <div className={`applicants ${loading ? "loading" : ""}`}>
                <div className="applicants_header">
                    <h2>Applicants</h2>
                    <div className="applicants_filter">
                        <div className="select-wrapper">
                            <select
                                value={params.jobType}
                                onChange={(e) => setParams({ ...params, jobType: e.target.value, page: 1 })}
                            >
                                <option value="All Status">All Status</option>
                                <option value="APPLIED">In Review</option>
                                <option value="INTERVIEW">Interview</option>
                                <option value="HIRED">Selected</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                        </div>
                    </div>
                </div>
                {error ? (
                    <div className="error">{error}</div>
                ) : (
                    <div className="applicants_table">
                        {applicants.length > 0 ? (
                            applicants.map((application) => {
                                const candidate = application.user.candidate_profile;
                                const badge = STATUS_BADGE_MAP[application.status] || { label: application.status, className: '' };
                                const jobId = application?.appliedJobs?.[0]?.jobId;
                                return (
                                    <div className="applicants_section" key={application.id}>
                                        <div className="applicants_img_info">
                                            <div className="applicant_img">
                                                {candidate?.photoUrl ? (
                                                    <img src={getFileUrl(candidate?.photoUrl)} alt={`${candidate?.firstName} ${candidate?.lastName}`} />
                                                ) : (
                                                    <img />
                                                )}
                                            </div>
                                            <div className="applicant_info">
                                                <span><span>Applied for</span> <span onClick={() => navigate(`/employer/manage-jobs/${jobId}`)}>{application.appliedJobs?.[0]?.jobTitle || "N/A"}</span></span>
                                                <h3 onClick={() => navigate(`/employer/applicants/${application?.id}`)}>{candidate?.firstName} {candidate?.lastName}</h3>
                                                <div className="applicant_position_location">
                                                    <span>{candidate?.currentPosition}</span>
                                                    <p>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M6.18525 14.2267C7.04783 13.444 7.84615 12.5933 8.5725 11.6827C10.1025 9.7605 11.0332 7.86525 11.0963 6.18C11.1212 5.4951 11.0078 4.81219 10.7629 4.17209C10.518 3.53198 10.1466 2.9478 9.67087 2.45444C9.19515 1.96109 8.62486 1.56868 7.99409 1.30065C7.36331 1.03263 6.68498 0.894491 5.99963 0.894491C5.31427 0.894491 4.63594 1.03263 4.00516 1.30065C3.37439 1.56868 2.8041 1.96109 2.32838 2.45444C1.85265 2.9478 1.48125 3.53198 1.23634 4.17209C0.991443 4.81219 0.878071 5.4951 0.903 6.18C0.96675 7.86525 1.89825 9.7605 3.4275 11.6827C4.15385 12.5933 4.95217 13.444 5.81475 14.2267C5.89775 14.3018 5.9595 14.3562 6 14.3903L6.18525 14.2267ZM5.4465 15.1005C5.4465 15.1005 0 10.5135 0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 10.5135 6.5535 15.1005 6.5535 15.1005C6.2505 15.3795 5.75175 15.3765 5.4465 15.1005ZM6 8.1C6.55695 8.1 7.0911 7.87875 7.48492 7.48492C7.87875 7.0911 8.1 6.55695 8.1 6C8.1 5.44305 7.87875 4.9089 7.48492 4.51508C7.0911 4.12125 6.55695 3.9 6 3.9C5.44305 3.9 4.9089 4.12125 4.51508 4.51508C4.12125 4.9089 3.9 5.44305 3.9 6C3.9 6.55695 4.12125 7.0911 4.51508 7.48492C4.9089 7.87875 5.44305 8.1 6 8.1ZM6 9C5.20435 9 4.44129 8.68393 3.87868 8.12132C3.31607 7.55871 3 6.79565 3 6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3C6.79565 3 7.55871 3.31607 8.12132 3.87868C8.68393 4.44129 9 5.20435 9 6C9 6.79565 8.68393 7.55871 8.12132 8.12132C7.55871 8.68393 6.79565 9 6 9Z" fill="#8492A6" />
                                                        </svg>
                                                        {candidate?.city}
                                                    </p>
                                                    <div className="applicant_view">
                                                        <svg onClick={() => navigate(`/employer/applicants/${application?.id}`)} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                            <rect width="24" height="24" rx="4" fill="#E2EAFF" />
                                                            <path d="M12 7.66089C7.75537 7.66089 4.40625 12 4.40625 12C4.40625 12 7.75537 16.3397 12 16.3397C15.2456 16.3397 19.5938 12 19.5938 12C19.5938 12 15.2456 7.66089 12 7.66089ZM12 14.7034C10.5094 14.7034 9.29606 13.4906 9.29606 12C9.29606 10.5094 10.5094 9.29608 12 9.29608C13.4906 9.29608 14.7039 10.5094 14.7039 12C14.7039 13.4906 13.4906 14.7034 12 14.7034ZM12 10.4216C11.7903 10.4177 11.5818 10.4556 11.3869 10.5331C11.192 10.6106 11.0144 10.7262 10.8647 10.8732C10.715 11.0201 10.596 11.1954 10.5148 11.3888C10.4336 11.5823 10.3918 11.7899 10.3918 11.9997C10.3918 12.2095 10.4336 12.4172 10.5148 12.6106C10.596 12.8041 10.715 12.9794 10.8647 13.1263C11.0144 13.2732 11.192 13.3888 11.3869 13.4664C11.5818 13.5439 11.7903 13.5818 12 13.5778C12.4134 13.57 12.8072 13.4003 13.0968 13.1052C13.3864 12.8101 13.5486 12.4132 13.5486 11.9997C13.5486 11.5863 13.3864 11.1893 13.0968 10.8942C12.8072 10.5991 12.4134 10.4294 12 10.4216Z" fill="#0146EE" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-jobs">
                                No applicants found.
                            </div>
                        )}
                    </div>
                )}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button disabled={params.page === 1} onClick={() => setParams({ ...params, page: params.page - 1 })}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                <path d="M0.235449 5.40002L4.43545 9.67502C4.73545 9.97502 5.18545 9.97502 5.48545 9.67502C5.78545 9.37502 5.78545 8.92502 5.48545 8.62502L1.81045 4.95002L5.48545 1.27502C5.63545 1.12502 5.71045 0.975023 5.71045 0.750023C5.71045 0.300023 5.41045 2.29144e-05 4.96045 2.29538e-05C4.73545 2.29734e-05 4.58545 0.0750228 4.43545 0.225022L0.160449 4.50002C-0.0645509 4.65002 -0.0645503 5.10002 0.235449 5.40002Z" fill="#6C6969" />
                            </svg>
                        </button>
                        {getPaginationPages().map((p, idx) => (
                            <button
                                key={idx}
                                className={params.page === p ? 'active' : ''}
                                disabled={p === '...'}
                                onClick={() => p !== '...' && setParams({ ...params, page: p })}
                            >
                                {p}
                            </button>
                        ))}
                        <button disabled={params.page >= totalPages} onClick={() => setParams({ ...params, page: params.page + 1 })}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" viewBox="0 0 6 10" fill="none">
                                <path d="M5.475 4.5L1.275 0.225C0.975 -0.075 0.525 -0.075 0.225 0.225C-0.0749998 0.525 -0.0749998 0.975 0.225 1.275L3.9 4.95L0.225 8.625C0.0750001 8.775 0 8.925 0 9.15C0 9.6 0.3 9.9 0.75 9.9C0.975 9.9 1.125 9.825 1.275 9.675L5.55 5.4C5.775 5.25 5.775 4.8 5.475 4.5Z" fill="#6C6969" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Applicants;