import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

function CandidateSavedJobs() {
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [params, setParams] = useState({ page: 1, limit: 4, q: '', jobType: 'All Jobs' });
    const [totalPages, setTotalPages] = useState(0);

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

    const fetchSavedJobs = async () => {
        setLoading(true);
        try {
            const res = await api.get('/candidate/me/saved-jobs', {
                params: {
                    offset: params.page,
                    limit: params.limit
                }
            });

            const list = res.data.savedJobs?.savedJobs || [];
            setSavedJobs(list);
            setTotalPages(res.data.savedJobs?.totalPages || 0);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch saved jobs', err);
            setError(err.response?.data?.message || 'Failed to fetch saved jobs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedJobs();
    }, [params.page, params.limit]);

    const getFileUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
            return path;
        }
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
        return encodeURI(`${baseUrl}/${path.replace(/^\//, '')}`);
    };

    const filteredJobs = savedJobs.filter(saved => {
        const job = saved.jobs;
        if (!job) return false;

        const matchesSearch = params.q
            ? job.title?.toLowerCase().includes(params.q.toLowerCase()) ||
            job.user?.company_profile?.companyName?.toLowerCase().includes(params.q.toLowerCase())
            : true;

        const matchesType = params.jobType === 'All Jobs' || job.jobType === params.jobType;

        return matchesSearch && matchesType;
    });

    const handleUnsave = async (jobId) => {
        const loadingToast = toast.loading('Removing job...');
        try {
            await api.delete(`/candidate/me/saved-jobs/${jobId}`);
            setSavedJobs(prev => prev.filter(item => item.jobId !== jobId));
            toast.dismiss(loadingToast);
            toast.success('Removed from saved jobs');
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error(err.response?.data?.message || 'Failed to remove job');
        }
    };

    const getSavedDateLabel = (dateStr) => {
        if (!dateStr) return 'N/A';
        const saved = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now - saved) / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays} Days Ago`;
    };

    return (
        <div className="manage-jobs-container">
            <div className="manage-jobs-header">
                <h2>Saved Job</h2>
                <div className="controls">
                    <div className="search-bar">
                        <input
                            placeholder="Search Saved Jobs..."
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
                </div>
            </div>
            {loading ? <div>Loading...</div> : error ? <div className="error">{error}</div> : (
                <div className="jobs_table jobs_candidate_view">
                    <div className="jobs_table_header">
                        <div className='jobs_table_heading'>Company</div>
                        <div className='jobs_table_heading'>Position</div>
                        <div className='jobs_table_heading'>Type</div>
                        <div className='jobs_table_heading'>Salary</div>
                        <div className='jobs_table_heading'>Status</div>
                        <div className='jobs_table_heading'>Saved Date</div>
                        <div className='jobs_table_heading'>Action</div>
                    </div>
                    {filteredJobs.length > 0 ? filteredJobs.map(saved => {
                        const job = saved.jobs;
                        const company = job?.user?.company_profile;

                        return (
                            <div className="jobs_table_body" key={saved.id}>
                                <div className="jobs_table_row">
                                    <div className='jobs_table_img'>
                                        {company?.logo ? (
                                            <img src={getFileUrl(company.logo)} alt={company?.companyName} />
                                        ) : (
                                            <img />
                                        )}
                                    </div>
                                    <div className='jobs_table_title'>
                                        <h6>{company?.companyName || 'N/A'}</h6>
                                        {company?.city && (
                                            <p>{company.city}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="jobs_table_row">
                                    <p>{job?.title || 'N/A'}</p>
                                </div>
                                <div className="jobs_table_row">
                                    <p>{job?.jobType || 'N/A'}</p>
                                </div>
                                <div className="jobs_table_row">
                                    <p>{job?.salary || 'N/A'}</p>
                                </div>
                                <div className="jobs_table_row">
                                    <span className="status-badge saved">Saved</span>
                                </div>
                                <div className="jobs_table_row">
                                    <p>{getSavedDateLabel(saved.createdAt)}</p>
                                </div>
                                <div className="jobs_table_row">
                                    <svg
                                        onClick={() => navigate(`/candidate/browse-jobs/${saved.jobId}`)}
                                        style={{ cursor: 'pointer' }}
                                        xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <rect width="32" height="32" rx="4" fill="#E2EAFF" />
                                        <path fillRule="evenodd" clipRule="evenodd" d="M24.3571 16L24.8907 15.7326V15.73L24.8869 15.7261L24.8791 15.7107L24.8521 15.6593L24.7493 15.4741C24.6238 15.2576 24.4904 15.0458 24.3494 14.839C23.879 14.1485 23.3383 13.5086 22.7359 12.9297C21.2881 11.5411 19.06 10.1243 16 10.1243C12.9426 10.1243 10.7131 11.5398 9.26542 12.9297C8.66302 13.5086 8.12227 14.1485 7.65185 14.839C7.46097 15.1206 7.28418 15.4115 7.12214 15.7107L7.11442 15.7261L7.11185 15.73V15.7313C7.11185 15.7313 7.11057 15.7326 7.64414 16L7.11057 15.7313C7.06931 15.8146 7.04785 15.9063 7.04785 15.9993C7.04785 16.0923 7.06931 16.1841 7.11057 16.2674L7.10928 16.27L7.11314 16.2738L7.12085 16.2893C7.16094 16.3696 7.20383 16.4485 7.24942 16.5258C7.80305 17.4611 8.4803 18.3174 9.26285 19.0716C10.7119 20.4601 12.94 21.8744 16 21.8744C19.0587 21.8744 21.2881 20.4601 22.7371 19.0703C23.3384 18.4906 23.8787 17.8509 24.3494 17.161C24.5297 16.8955 24.6975 16.6218 24.8521 16.3407L24.8791 16.2893L24.8869 16.2738L24.8894 16.27V16.2687C24.8894 16.2687 24.8907 16.2674 24.3571 16ZM24.3571 16L24.8907 16.2687C24.932 16.1854 24.9534 16.0936 24.9534 16.0006C24.9534 15.9076 24.932 15.8159 24.8907 15.7326L24.3571 16ZM15.9229 14.0251C15.3991 14.0251 14.8968 14.2332 14.5264 14.6035C14.1561 14.9739 13.948 15.4762 13.948 16C13.948 16.5237 14.1561 17.0261 14.5264 17.3964C14.8968 17.7668 15.3991 17.9748 15.9229 17.9748C16.4466 17.9748 16.9489 17.7668 17.3193 17.3964C17.6896 17.0261 17.8977 16.5237 17.8977 16C17.8977 15.4762 17.6896 14.9739 17.3193 14.6035C16.9489 14.2332 16.4466 14.0251 15.9229 14.0251ZM12.7574 16C12.7574 15.1598 13.0912 14.354 13.6853 13.7599C14.2794 13.1658 15.0852 12.832 15.9254 12.832C16.7656 12.832 17.5714 13.1658 18.1655 13.7599C18.7597 14.354 19.0934 15.1598 19.0934 16C19.0934 16.8402 18.7597 17.646 18.1655 18.2401C17.5714 18.8342 16.7656 19.168 15.9254 19.168C15.0852 19.168 14.2794 18.8342 13.6853 18.2401C13.0912 17.646 12.7574 16.8402 12.7574 16Z" fill="#0146EE" />
                                    </svg>
                                    <svg
                                        onClick={() => handleUnsave(saved.jobId)}
                                        style={{ cursor: 'pointer' }}
                                        xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <rect width="32" height="32" rx="4" fill="#E2EAFF" />
                                        <path d="M12.25 22.75C11.8375 22.75 11.4845 22.6033 11.191 22.3097C10.8975 22.0162 10.7505 21.663 10.75 21.25V11.5H10V10H13.75V9.25H18.25V10H22V11.5H21.25V21.25C21.25 21.6625 21.1033 22.0157 20.8097 22.3097C20.5162 22.6038 20.163 22.7505 19.75 22.75H12.25ZM19.75 11.5H12.25V21.25H19.75V11.5ZM13.75 19.75H15.25V13H13.75V19.75ZM16.75 19.75H18.25V13H16.75V19.75Z" fill="#0146EE" />
                                    </svg>
                                </div>
                            </div>
                        );
                    }) : <div className="no-jobs">No saved jobs found.</div>}
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

export default CandidateSavedJobs;