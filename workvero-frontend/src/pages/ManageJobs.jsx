import { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

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
                const response = await api.get('/job/my-jobs', {
                    params: {
                        page: params.page,
                        limit: params.limit,
                        q: params.q,
                        jobType: params.jobType,
                        status: params.status,
                        sponsorshipType: params.sponsorshipType
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
                console.error("Error fetching jobs:", err);
                setError(err.response?.data?.message || 'Failed to fetch jobs');
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [params]);

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const res = await api.get('/company/me');
                setCompanyProfile(res.data.company);
            } catch (err) {
                console.error('Failed to fetch company profile');
            }
        };
        fetchCompany();
    }, []);

    useEffect(() => {
        return () => {
            toast.dismiss();
        };
    }, []);

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

    return (
        <div className="manage-jobs-container">
            <div className="manage-jobs-header">
                <h2>Manage Jobs</h2>
                <div className="controls">
                    <div className="add-job-button">
                        <button onClick={() => navigate('/employer/post-job')}>
                            Add Job
                        </button>
                    </div>
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
                        <select value={params.limit} onChange={(e) => setParams({ ...params, limit: Number(e.target.value), page: 1 })}
                        >
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
            {loading ? <div>Loading...</div> : error ? <div className="error">{error}</div> : (
                <div className="jobs_table">
                    <div className="jobs_table_header">
                        <div className='jobs_table_heading'>Job</div>
                        <div className='jobs_table_heading'>Applicants</div>
                        <div className='jobs_table_heading'>Type</div>
                        <div className='jobs_table_heading'>Salary</div>
                        <div className='jobs_table_heading'>Status</div>
                        <div className='jobs_table_heading'>Sponsorship</div>
                        <div className='jobs_table_heading'>Date Posted</div>
                        <div className='jobs_table_heading'>Action</div>
                    </div>
                    {displayedJobs.length > 0 ? displayedJobs.map(job => (
                        <div className="jobs_table_body" key={job.id}>
                            <div className="jobs_table_row">
                                <div className='jobs_table_img'>
                                    {companyProfile?.logo ? (
                                        <img src={companyProfile.logo} alt="company logo" />
                                    ) : (
                                        <img />
                                    )}
                                </div>
                                <div className='jobs_table_title'>
                                    <h6>{job.title}</h6>
                                    {companyProfile?.companyName.length > 0 && (
                                        <p>{companyProfile?.companyName || ''}</p>
                                    )}
                                </div>
                            </div>
                            <div className="jobs_table_row">
                                <p>120</p>
                            </div>
                            <div className="jobs_table_row">
                                <p>{job.jobType}</p>
                            </div>
                            <div className="jobs_table_row">
                                <p>{job.salary}</p>
                            </div>
                            <div className={`jobs_table_row ${job.status ? job.status.toLowerCase() : ''}`}>
                                <p>{job.status}</p>
                            </div>
                            <div className="jobs_table_row">
                                <p>{job.sponsorshipType}</p>
                            </div>
                            <div className="jobs_table_row">
                                <p>{job.deadline ? new Date(job.deadline).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="jobs_table_row">
                                <svg onClick={() => handleEdit(job.id)} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <rect width="32" height="32" rx="4" fill="#E2EAFF" />
                                    <path d="M19.304 9.84436L22.156 12.6964M12 12.0004H9C8.73478 12.0004 8.48043 12.1057 8.29289 12.2933C8.10536 12.4808 8 12.7351 8 13.0004V23.0004C8 23.2656 8.10536 23.5199 8.29289 23.7075C8.48043 23.895 8.73478 24.0004 9 24.0004H20C20.2652 24.0004 20.5196 23.895 20.7071 23.7075C20.8946 23.5199 21 23.2656 21 23.0004V18.5004M23.409 8.59036C23.5964 8.77767 23.745 9.00005 23.8464 9.24481C23.9478 9.48958 24 9.75192 24 10.0169C24 10.2818 23.9478 10.5441 23.8464 10.7889C23.745 11.0337 23.5964 11.2561 23.409 11.4434L16.565 18.2874L13 19.0004L13.713 15.4354L20.557 8.59136C20.7442 8.4039 20.9664 8.25517 21.2111 8.1537C21.4558 8.05223 21.7181 8 21.983 8C22.2479 8 22.5102 8.05223 22.7549 8.1537C22.9996 8.25517 23.2218 8.4039 23.409 8.59136V8.59036Z" stroke="#0146EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <svg onClick={() => handleDelete(job.id)} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                    <rect width="32" height="32" rx="4" fill="#E2EAFF" />
                                    <path d="M12.25 22.75C11.8375 22.75 11.4845 22.6033 11.191 22.3097C10.8975 22.0162 10.7505 21.663 10.75 21.25V11.5H10V10H13.75V9.25H18.25V10H22V11.5H21.25V21.25C21.25 21.6625 21.1033 22.0157 20.8097 22.3097C20.5162 22.6038 20.163 22.7505 19.75 22.75H12.25ZM19.75 11.5H12.25V21.25H19.75V11.5ZM13.75 19.75H15.25V13H13.75V19.75ZM16.75 19.75H18.25V13H16.75V19.75Z" fill="#0146EE" />
                                </svg>
                            </div>
                        </div>
                    )) : <div className="no-jobs">No jobs found.</div>}
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

export default ManageJobs;