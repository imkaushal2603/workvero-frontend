import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from "../components/Loader";

function ManageJobs() {
    const navigate = useNavigate();
    const [companyProfile, setCompanyProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [params, setParams] = useState({ page: 1, limit: 4, q: '', jobType: 'All Jobs', status: 'All Status', sponsorshipType: 'All' });
    const [totalPages, setTotalPages] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState('All Locations');
    const [availableLocations, setAvailableLocations] = useState([]);
    const [searchInput, setSearchInput] = useState('');

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
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const [jobsRes, companyRes] = await Promise.all([
                    api.get('/job/my-jobs', {
                        params: {
                            page: params.page,
                            limit: params.limit,
                            q: params.q,
                            jobType: params.jobType,
                            status: params.status,
                            sponsorshipType: params.sponsorshipType
                        }
                    }),
                    api.get('/company/me'),
                    new Promise(resolve => setTimeout(resolve, 600))
                ]);
                const fetchedJobs = jobsRes.data.data.jobs || [];
                setJobs(fetchedJobs);
                setTotalPages(jobsRes.data.data.totalPages);
                setCompanyProfile(companyRes.data.company);
                setError(null);
                const uniqueLocations = [
                    ...new Set(
                        fetchedJobs
                            .map(job => job.location?.trim())
                            .filter(loc => loc)
                    )
                ];
                setAvailableLocations(uniqueLocations);
            } catch (err) {
                console.error("Error fetching jobs:", err);
                setError(err.response?.data?.message || 'Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [params]);

    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, []);

    const getFileUrl = (path) => {
        if (!path) return null;

        if (
            path.startsWith("http://") ||
            path.startsWith("https://") ||
            path.startsWith("data:")
        ) {
            return path;
        }

        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, "");

        return encodeURI(
            `${baseUrl}/${path.replace(/^\//, "")}`
        );
    };

    const displayedJobs = selectedLocation === 'All Locations'
        ? jobs
        : jobs.filter(job => job.location?.trim() === selectedLocation);

    const handleDelete = async (jobId) => {
        toast((t) => (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span>Are you sure you want to <b>delete</b> this job?</span>
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                    <button
                        onClick={async () => {
                            toast.dismiss(t.id);
                            const loadingToast = toast.loading('Deleting job...');
                            try {
                                await api.delete(`/job/${jobId}`);
                                setJobs(jobs.filter(job => job.id !== jobId));
                                toast.dismiss(loadingToast);
                                toast.success('Job deleted successfully');
                            } catch (err) {
                                toast.dismiss(loadingToast);
                                toast.error(err.response?.data?.message || 'Failed to delete job');
                            }
                        }}
                        style={{ background: '#ff4b4b', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Confirm
                    </button>
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        style={{ background: '#ccc', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        ), { duration: Infinity });
    };

    const handleEdit = (jobId) => {
        navigate(`/employer/manage-jobs/${jobId}`);
    };

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

    const executeSearch = () => {
        setParams(prev => ({ ...prev, q: searchInput, page: 1 }));
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            executeSearch();
        }
    };

    return (
        <>
            {loading && <Loader />}
            <div className={`manage-jobs-container ${loading ? "loading" : ""}`}>
                <div className="manage-jobs-header jobs_candidate">
                    <h2>Manage Jobs</h2>
                    <div className="controls">
                        <div className="add-job-button">
                            <button onClick={() => navigate('/employer/post-job')}>+ Add Job</button>
                        </div>
                        <div className="search-bar">
                            <input placeholder="Search Jobs..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearchKeyDown} />
                            <svg onClick={executeSearch} style={{ cursor: 'pointer' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M9.375 8.25H8.7825L8.5725 8.0475C9.33296 7.16555 9.75089 6.03953 9.75 4.875C9.75 3.91082 9.46409 2.96829 8.92842 2.1666C8.39274 1.36491 7.63137 0.740067 6.74058 0.371089C5.84979 0.00211226 4.86959 -0.094429 3.92394 0.0936739C2.97828 0.281777 2.10964 0.746075 1.42786 1.42786C0.746075 2.10964 0.281777 2.97828 0.0936739 3.92394C-0.094429 4.86959 0.00211226 5.84979 0.371089 6.74058C0.740067 7.63137 1.36491 8.39274 2.1666 8.92842C2.96829 9.46409 3.91082 9.75 4.875 9.75C6.0825 9.75 7.1925 9.3075 8.0475 8.5725L8.25 8.7825V9.375L12 13.1175L13.1175 12L9.375 8.25ZM4.875 8.25C3.0075 8.25 1.5 6.7425 1.5 4.875C1.5 3.0075 3.0075 1.5 4.875 1.5C6.7425 1.5 8.25 3.0075 8.25 4.875C8.25 6.7425 6.7425 8.25 4.875 8.25Z" fill="#696969" />
                            </svg>
                        </div>
                        <div className="select-wrapper">
                            <select value={params.limit} onChange={(e) => setParams({ ...params, limit: Number(e.target.value), page: 1 })}>
                                <option value={4}>4 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                        </div>
                        <div className="select-wrapper">
                            <select value={params.jobType} onChange={(e) => setParams({ ...params, jobType: e.target.value, page: 1 })}>
                                <option value="All Jobs">All Jobs</option>
                                <option value="Remote">Remote</option>
                                <option value="Full Time">Full Time</option>
                                <option value="Part Time">Part Time</option>
                                <option value="Hybrid">Hybrid</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                        </div>
                        <div className="select-wrapper">
                            <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                                <option value="All Locations">All Locations</option>
                                {availableLocations.map((location, index) => (
                                    <option key={index} value={location}>
                                        {location}
                                    </option>
                                ))}
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                        </div>
                        <div className="select-wrapper">
                            <select value={params.status} onChange={(e) => setParams({ ...params, status: e.target.value, page: 1 })}>
                                <option value="All Status">All Status</option>
                                <option value="OPEN">Open</option>
                                <option value="PAUSED">Paused</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                        </div>
                        <div className="select-wrapper">
                            <select value={params.sponsorshipType} onChange={(e) => setParams({ ...params, sponsorshipType: e.target.value, page: 1 })}>
                                <option value="All">All Types</option>
                                <option value="Free">Free</option>
                                <option value="Sponsored">Sponsored</option>
                            </select>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                        </div>
                    </div>
                </div>
                {error ? <div className="error">{error}</div> : (
                    <div className='applied_jobs_view'>
                        {displayedJobs.length > 0 ? displayedJobs.map(job => {
                            return (
                                <div className='applied_jobs_section' key={job.id}>
                                    <div className='browse_title_save'>
                                        <div className='browse_title_company'>
                                            <h3 onClick={() => handleEdit(job.id)}>{job.title}</h3>
                                            {companyProfile?.companyName.length > 0 && (
                                                <span>{companyProfile?.companyName || ''}</span>
                                            )}
                                            <p>{job.sponsorshipType} Plan</p>
                                        </div>
                                        <div className='applied_jobs_status'>
                                            {companyProfile?.logo ? (
                                                <img src={getFileUrl(companyProfile.logo)} alt={companyProfile.companyName} />
                                            ) : (
                                                <img />
                                            )}
                                            <span className={`status-badge ${job.status ? job.status.toLowerCase() : ''}`}><p>{job.status.toLowerCase()}</p></span>
                                            <svg onClick={() => handleDelete(job.id)} style={{ cursor: 'pointer' }}
                                                xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                                <rect width="32" height="32" rx="4" fill="#E2EAFF" />
                                                <path d="M12.25 22.75C11.8375 22.75 11.4845 22.6033 11.191 22.3097C10.8975 22.0162 10.7505 21.663 10.75 21.25V11.5H10V10H13.75V9.25H18.25V10H22V11.5H21.25V21.25C21.25 21.6625 21.1033 22.0157 20.8097 22.3097C20.5162 22.6038 20.163 22.7505 19.75 22.75H12.25ZM19.75 11.5H12.25V21.25H19.75V11.5ZM13.75 19.75H15.25V13H13.75V19.75ZM16.75 19.75H18.25V13H16.75V19.75Z" fill="#0146EE" />
                                            </svg>
                                        </div>
                                    </div>
                                    {(job?.location || job?.createdAt) && (
                                        <div className='browse_jobs_location'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="16" viewBox="0 0 12 16" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M6.18525 14.2267C7.04783 13.444 7.84615 12.5933 8.5725 11.6827C10.1025 9.7605 11.0332 7.86525 11.0963 6.18C11.1212 5.4951 11.0078 4.81219 10.7629 4.17209C10.518 3.53198 10.1466 2.9478 9.67087 2.45444C9.19515 1.96109 8.62486 1.56868 7.99409 1.30065C7.36331 1.03263 6.68498 0.894491 5.99963 0.894491C5.31427 0.894491 4.63594 1.03263 4.00516 1.30065C3.37439 1.56868 2.8041 1.96109 2.32838 2.45444C1.85265 2.9478 1.48125 3.53198 1.23634 4.17209C0.991443 4.81219 0.878071 5.4951 0.903 6.18C0.96675 7.86525 1.89825 9.7605 3.4275 11.6827C4.15385 12.5933 4.95217 13.444 5.81475 14.2267C5.89775 14.3018 5.9595 14.3562 6 14.3903L6.18525 14.2267ZM5.4465 15.1005C5.4465 15.1005 0 10.5135 0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 10.5135 6.5535 15.1005 6.5535 15.1005C6.2505 15.3795 5.75175 15.3765 5.4465 15.1005ZM6 8.1C6.55695 8.1 7.0911 7.87875 7.48492 7.48492C7.87875 7.0911 8.1 6.55695 8.1 6C8.1 5.44305 7.87875 4.9089 7.48492 4.51508C7.0911 4.12125 6.55695 3.9 6 3.9C5.44305 3.9 4.9089 4.12125 4.51508 4.51508C4.12125 4.9089 3.9 5.44305 3.9 6C3.9 6.55695 4.12125 7.0911 4.51508 7.48492C4.9089 7.87875 5.44305 8.1 6 8.1ZM6 9C5.20435 9 4.44129 8.68393 3.87868 8.12132C3.31607 7.55871 3 6.79565 3 6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3C6.79565 3 7.55871 3.31607 8.12132 3.87868C8.68393 4.44129 9 5.20435 9 6C9 6.79565 8.68393 7.55871 8.12132 8.12132C7.55871 8.68393 6.79565 9 6 9Z" fill="#8492A6" />
                                            </svg>
                                            {job?.location && <span>{job.location}</span>}
                                            {job?.location && job?.createdAt && <span> - </span>}
                                            {job?.createdAt && <span>Posted {getRelativeTime(job.createdAt)}</span>}
                                        </div>
                                    )}
                                    {(job?.experience || job?.salary) && (
                                        <div className='browse_exp_salary'>
                                            {job?.experience && (
                                                <div className='browse_jobs_exp'>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                                    </svg>
                                                    <span>{job.experience}</span>
                                                </div>
                                            )}
                                            {job?.salary && (
                                                <div className='browse_jobs_salary'>
                                                    <span>-</span>
                                                    <span>{job.salary}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {job?.applicantsCount > 0 && (
                                        <div className='browse_jobs_applied'>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                                                <g stroke="#696969" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10}>
                                                    <path d="M10.1 3.48A1.9 1.9 0 0 1 12 1.58a1.9 1.9 0 0 1 1.9 1.9" />
                                                    <path d="M13.9 4.43a1.9 1.9 0 0 1 1.9-1.9 1.9 1.9 0 0 1 1.9 1.9" />
                                                    <path d="M17.7 12V7.28a1.9 1.9 0 0 1 1.9-1.9 1.9 1.9 0 0 1 1.9 1.9v7.6a9.81 9.81 0 0 1-.71 3.66l-.48 1.22a9.81 9.81 0 0 0-.71 3.66" />
                                                    <path d="M6.3 14.87V4.43a1.9 1.9 0 0 1 1.9-1.9 1.9 1.9 0 0 1 1.9 1.9V12" />
                                                    <path d="M10.1 12.02V3.48" />
                                                    <path d="M13.9 12.02V3.48" />
                                                    <path d="M17.7 12.02V4.43" />
                                                    <path d="M6.3 23.42A4.59 4.59 0 0 0 5 20.18l-1.39-1.34A3.81 3.81 0 0 1 2.5 16.15v-3.51a2.51 2.51 0 0 1 1.3-2.26 2.39 2.39 0 0 1 2.5.22" />
                                                </g>
                                            </svg>
                                            <span>Applied by {job.applicantsCount ?? 0} Applicants</span>
                                        </div>
                                    )}
                                    <button onClick={() => handleEdit(job.id)}>Read more</button>
                                </div>
                            );
                        }) : <div className="no-jobs">No jobs found.</div>}
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
                                style={{ margin: '0 5px', fontWeight: params.page === p ? 'bold' : 'normal' }}
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

export default ManageJobs;