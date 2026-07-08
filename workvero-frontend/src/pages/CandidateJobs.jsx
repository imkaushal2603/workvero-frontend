import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

function CandidateJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [savedJobIds, setSavedJobIds] = useState(new Set());
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [params, setParams] = useState({ page: 1, limit: 4, q: '', jobType: 'All Jobs', workMode: 'All Modes' });
    const [totalPages, setTotalPages] = useState(0);
    const [selectedLocation, setSelectedLocation] = useState('All Locations');
    const [availableLocations, setAvailableLocations] = useState([]);

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
                const response = await api.get('/job', {
                    params: {
                        offset: params.page,
                        limit: params.limit,
                        q: params.q,
                        jobType: params.jobType,
                        workMode: params.workMode,
                        status: 'OPEN'
                    }
                });

                const fetchedJobs = response.data.data.jobs || [];
                setJobs(fetchedJobs);
                setTotalPages(response.data.data.totalPages);
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
                console.error('Error fetching jobs:', err);
                setError(err.response?.data?.message || 'Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [params]);

    useEffect(() => {
        const fetchSavedAndApplied = async () => {
            try {
                const [savedRes, appliedRes] = await Promise.all([
                    api.get('/candidate/me/saved-jobs'),
                    api.get('/candidate/me/applications')
                ]);

                const savedList = savedRes.data.savedJobs?.savedJobs || [];
                const appliedList = appliedRes.data.applications?.applications || [];

                setSavedJobIds(new Set(savedList.map(item => Number(item.jobId))));
                setAppliedJobIds(new Set(appliedList.map(item => Number(item.jobId))));
            } catch (err) {
                console.error('Failed to fetch saved/applied jobs', err);
            }
        };
        fetchSavedAndApplied();
    }, []);

    const getFileUrl = (path) => {
        if (!path) return null;

        if (
            path.startsWith('http://') ||
            path.startsWith('https://') ||
            path.startsWith('data:')
        ) {
            return path;
        }

        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

        return encodeURI(`${baseUrl}/${path.replace(/^\//, '')}`);
    };

    const displayedJobs = jobs.filter(job => {
        const matchesLocation = selectedLocation === 'All Locations' || job.location?.trim() === selectedLocation;
        const matchesJobType = params.jobType === 'All Jobs' || job.jobType === params.jobType;
        const matchesWorkMode = params.workMode === 'All Modes' || job.workMode === params.workMode;
        return matchesLocation && matchesJobType && matchesWorkMode;
    });

    const handleSaveToggle = async (jobId) => {
        const isSaved = savedJobIds.has(jobId);
        try {
            if (isSaved) {
                await api.delete(`/candidate/me/saved-jobs/${jobId}`);
                setSavedJobIds(prev => {
                    const next = new Set(prev);
                    next.delete(jobId);
                    return next;
                });
                toast.success('Removed from saved jobs');
            } else {
                await api.post(`/candidate/me/saved-jobs/${jobId}`);
                setSavedJobIds(prev => new Set(prev).add(jobId));
                toast.success('Job saved!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update saved jobs');
        }
    };

    const parseSkills = (skills) => {
        try {
            return typeof skills === 'string' ? JSON.parse(skills) : (skills || []);
        } catch {
            return [];
        }
    };

    return (
        <div className="manage-jobs-container">
            <div className="manage-jobs-header">
                <h2>Browse Jobs</h2>
                <div className="controls">
                    <div className="search-bar">
                        <input
                            placeholder="Search jobs..."
                            onChange={(e) => setParams({ ...params, q: e.target.value, page: 1 })}
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
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
                        <select value={params.workMode} onChange={(e) => setParams({ ...params, workMode: e.target.value, page: 1 })}>
                            <option value="All Modes">All Modes</option>
                            <option value="On-site">On-site</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Remote">Remote</option>
                        </select>
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                    </div>
                </div>
            </div>
            {loading ? <div>Loading...</div> : error ? <div className="error">{error}</div> : (
            <div className='browse_jobs_section'>
                {displayedJobs.length > 0 ? displayedJobs.map(job => {
                    const skillsList = parseSkills(job.skills);
                    const isSaved = savedJobIds.has(job.id);
                    return (
                        <div className='browse_jobs' key={job.id}>
                            <div className='browse_jobs_cards'>
                                <div className='browse_title_save'>
                                    <h3 onClick={() => navigate(`/candidate/browse-jobs/${job.id}`)}>{job.title}</h3>
                                    <svg className={isSaved ? 'saved' : 'unsaved'} onClick={() => handleSaveToggle(job.id)} xmlns="http://www.w3.org/2000/svg" width="22" height="19" viewBox="0 0 22 19" fill="none">
                                        <path fillRule={isSaved ? "nonzero" : "evenodd"} clipRule="evenodd" d="M4.374 1.89038C2.715 2.64838 1.5 4.45238 1.5 6.60338C1.5 8.80038 2.4 10.4944 3.688 11.9464C4.751 13.1424 6.037 14.1344 7.291 15.1004C7.58967 15.3304 7.88467 15.5597 8.176 15.7884C8.702 16.2034 9.171 16.5664 9.624 16.8314C10.077 17.0964 10.44 17.2164 10.75 17.2164C11.06 17.2164 11.424 17.0964 11.876 16.8314C12.329 16.5664 12.798 16.2034 13.324 15.7884C13.6153 15.559 13.9103 15.33 14.209 15.1014C15.463 14.1334 16.749 13.1424 17.812 11.9464C19.101 10.4944 20 8.80038 20 6.60338C20 4.45338 18.785 2.64838 17.126 1.89038C15.514 1.15338 13.348 1.34838 11.29 3.48738C11.22 3.55996 11.1362 3.6177 11.0434 3.65714C10.9506 3.69657 10.8508 3.7169 10.75 3.7169C10.6492 3.7169 10.5494 3.69657 10.4566 3.65714C10.3638 3.6177 10.28 3.55996 10.21 3.48738C8.152 1.34838 5.986 1.15338 4.374 1.89038ZM10.75 1.92638C8.438 -0.143622 5.849 -0.433622 3.75 0.525378C1.536 1.54038 0 3.89238 0 6.60438C0 9.26938 1.11 11.3034 2.567 12.9434C3.733 14.2564 5.16 15.3554 6.421 16.3254C6.70767 16.5454 6.983 16.7594 7.247 16.9674C7.76 17.3714 8.31 17.8014 8.867 18.1274C9.424 18.4534 10.06 18.7174 10.75 18.7174C11.44 18.7174 12.076 18.4524 12.633 18.1274C13.191 17.8014 13.74 17.3714 14.253 16.9674C14.517 16.7594 14.7923 16.5454 15.079 16.3254C16.339 15.3554 17.767 14.2554 18.933 12.9434C20.39 11.3034 21.5 9.26938 21.5 6.60438C21.5 3.89238 19.965 1.54038 17.75 0.527378C15.651 -0.432622 13.062 -0.142622 10.75 1.92638Z" fill="#6C6969" />
                                    </svg>
                                </div>
                                <p>{job.description}</p>
                                <div className='skills'>
                                    {skillsList.map((skill, idx) => (
                                        <span key={idx} className="skill-tag">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <div className='browse_jobs_location'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M6.18525 14.2267C7.04783 13.444 7.84615 12.5933 8.5725 11.6827C10.1025 9.7605 11.0332 7.86525 11.0963 6.18C11.1212 5.4951 11.0078 4.81219 10.7629 4.17209C10.518 3.53198 10.1466 2.9478 9.67087 2.45444C9.19515 1.96109 8.62486 1.56868 7.99409 1.30065C7.36331 1.03263 6.68498 0.894491 5.99963 0.894491C5.31427 0.894491 4.63594 1.03263 4.00516 1.30065C3.37439 1.56868 2.8041 1.96109 2.32838 2.45444C1.85265 2.9478 1.48125 3.53198 1.23634 4.17209C0.991443 4.81219 0.878071 5.4951 0.903 6.18C0.96675 7.86525 1.89825 9.7605 3.4275 11.6827C4.15385 12.5933 4.95217 13.444 5.81475 14.2267C5.89775 14.3018 5.9595 14.3562 6 14.3903L6.18525 14.2267ZM5.4465 15.1005C5.4465 15.1005 0 10.5135 0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 10.5135 6.5535 15.1005 6.5535 15.1005C6.2505 15.3795 5.75175 15.3765 5.4465 15.1005ZM6 8.1C6.55695 8.1 7.0911 7.87875 7.48492 7.48492C7.87875 7.0911 8.1 6.55695 8.1 6C8.1 5.44305 7.87875 4.9089 7.48492 4.51508C7.0911 4.12125 6.55695 3.9 6 3.9C5.44305 3.9 4.9089 4.12125 4.51508 4.51508C4.12125 4.9089 3.9 5.44305 3.9 6C3.9 6.55695 4.12125 7.0911 4.51508 7.48492C4.9089 7.87875 5.44305 8.1 6 8.1ZM6 9C5.20435 9 4.44129 8.68393 3.87868 8.12132C3.31607 7.55871 3 6.79565 3 6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3C6.79565 3 7.55871 3.31607 8.12132 3.87868C8.68393 4.44129 9 5.20435 9 6C9 6.79565 8.68393 7.55871 8.12132 8.12132C7.55871 8.68393 6.79565 9 6 9Z" fill="#8492A6" />
                                    </svg>
                                    {job.location}
                                </div>
                                <button onClick={() => navigate(`/candidate/browse-jobs/${job.id}`)}>See more</button>
                            </div>
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
    );
}

export default CandidateJobs;