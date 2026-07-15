import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loader from "../components/Loader";

function CandidateJobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isApplied, setIsApplied] = useState(false);
    const [isApplying, setIsApplying] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const [isPremium, setIsPremium] = useState(false);
    const [applicationCount, setApplicationCount] = useState(0);
    let skillsList = [];

    useEffect(() => {
        const fetchJob = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/job/${id}`);
                await new Promise(resolve => setTimeout(resolve, 800));
                setJob(res.data.data);
                setError(null);
            } catch (err) {
                console.error('Failed to fetch job', err);
                setError(err.response?.data?.message || 'Failed to load job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const [appliedRes, savedRes] = await Promise.all([
                    api.get('/candidate/me/applications'),
                    api.get('/candidate/me/saved-jobs')
                ]);

                const appliedList = appliedRes.data.applications?.applications || [];
                const savedList = savedRes.data.savedJobs?.savedJobs || [];
                setApplicationCount(appliedList.length);
                setIsApplied(appliedList.some(item => item.jobId === Number(id)));
                setIsSaved(savedList.some(item => Number(item.jobId) === Number(id)));
            } catch (err) {
                console.error('Failed to fetch application/saved status', err);
            }
        };
        fetchStatus();
    }, [id]);

    const getFileUrl = (path) => {
        if (!path) return null;
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
            return path;
        }
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
        return encodeURI(`${baseUrl}/${path.replace(/^\//, '')}`);
    };

    const handleApply = async () => {
        if (!isPremium && applicationCount >= 5) {
            toast((t) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'sans-serif' }}>
                    <span style={{ fontSize: '14px', color: '#333' }}>
                        ⚠️ You have used your limit of <b>5 free applications</b>. Please purchase a plan to apply for more jobs!
                    </span>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <button
                            onClick={() => {
                                toast.dismiss(t.id);
                                navigate('/candidate/pricing');
                            }}
                            style={{ background: '#0146EE', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                            View Plans
                        </button>
                        <button
                            onClick={() => toast.dismiss(t.id)}
                            style={{ background: '#ccc', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ), { duration: 6000 });
            return;
        }

        setIsApplying(true);
        try {
            await Promise.all([
                api.post('/candidate/me/applications', {
                    jobId: Number(id),
                }),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
            setIsApplied(true);
            setApplicationCount(prev => prev + 1);
            toast.success('Application submitted!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to apply. Please try again.');
        } finally {
            setIsApplying(false);
        }
    };

    const handleSaveToggle = async () => {
        setIsSaving(true);
        try {
            if (isSaved) {
                await Promise.all([
                    api.delete(`/candidate/me/saved-jobs/${id}`),
                    new Promise(resolve => setTimeout(resolve, 600))
                ]);
                setIsSaved(false);
                toast.success('Removed from saved jobs');
            } else {
                await Promise.all([
                    api.post(`/candidate/me/saved-jobs/${id}`),
                    new Promise(resolve => setTimeout(resolve, 600))
                ]);
                setIsSaved(true);
                toast.success('Job saved!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update saved jobs');
        }
        finally {
            setIsSaving(false);
        }
    };

    if (error) return <div className="error">{error}</div>;

    try {
        skillsList = typeof job?.skills === 'string' ? JSON.parse(job?.skills) : (job?.skills || []);
    } catch {
        skillsList = [];
    }

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

    return (
        <>
            {loading && <Loader />}
            <div className={`job-detail-page ${loading ? "loading" : ""}`}>
                <div className="header-row">
                    <button onClick={() => navigate('/candidate/browse-jobs')} className="back-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#000000" />
                        </svg>
                    </button>
                </div>
                <div className="profile-card job_detailed_info">
                    <div className='job_info'>
                        <div className="company-info">
                            {job?.title?.length > 0 && (
                                <h3>{job?.title}</h3>
                            )}
                            <div className='job_location_time'>
                                <span>Posted {getRelativeTime(job?.createdAt)}</span>
                                {job?.location?.length > 0 && (
                                    <>
                                        <span>-</span>
                                        <div className='job_location'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M6.18525 14.2267C7.04783 13.444 7.84615 12.5933 8.5725 11.6827C10.1025 9.7605 11.0332 7.86525 11.0963 6.18C11.1212 5.4951 11.0078 4.81219 10.7629 4.17209C10.518 3.53198 10.1466 2.9478 9.67087 2.45444C9.19515 1.96109 8.62486 1.56868 7.99409 1.30065C7.36331 1.03263 6.68498 0.894491 5.99963 0.894491C5.31427 0.894491 4.63594 1.03263 4.00516 1.30065C3.37439 1.56868 2.8041 1.96109 2.32838 2.45444C1.85265 2.9478 1.48125 3.53198 1.23634 4.17209C0.991443 4.81219 0.878071 5.4951 0.903 6.18C0.96675 7.86525 1.89825 9.7605 3.4275 11.6827C4.15385 12.5933 4.95217 13.444 5.81475 14.2267C5.89775 14.3018 5.9595 14.3562 6 14.3903L6.18525 14.2267ZM5.4465 15.1005C5.4465 15.1005 0 10.5135 0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 10.5135 6.5535 15.1005 6.5535 15.1005C6.2505 15.3795 5.75175 15.3765 5.4465 15.1005ZM6 8.1C6.55695 8.1 7.0911 7.87875 7.48492 7.48492C7.87875 7.0911 8.1 6.55695 8.1 6C8.1 5.44305 7.87875 4.9089 7.48492 4.51508C7.0911 4.12125 6.55695 3.9 6 3.9C5.44305 3.9 4.9089 4.12125 4.51508 4.51508C4.12125 4.9089 3.9 5.44305 3.9 6C3.9 6.55695 4.12125 7.0911 4.51508 7.48492C4.9089 7.87875 5.44305 8.1 6 8.1ZM6 9C5.20435 9 4.44129 8.68393 3.87868 8.12132C3.31607 7.55871 3 6.79565 3 6C3 5.20435 3.31607 4.44129 3.87868 3.87868C4.44129 3.31607 5.20435 3 6 3C6.79565 3 7.55871 3.31607 8.12132 3.87868C8.68393 4.44129 9 5.20435 9 6C9 6.79565 8.68393 7.55871 8.12132 8.12132C7.55871 8.68393 6.79565 9 6 9Z" fill="#8492A6" />
                                            </svg>
                                            <span>{job?.location}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                        {job?.description?.length > 0 && (
                            <div className='job_description'>
                                <span>Summary</span>
                                <p>{job?.description}</p>
                            </div>
                        )}
                        <div className='job_related_details'>
                            {job?.jobType?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 24 24" width="24" height="24">
                                            <defs>
                                                <image width="24" height="24" id="img1" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0IB2cksfwAAAXpQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkA4EAgAAAH50Uk5TAEWOkEsCIa7UNzKCxDUpxVSAoBXHEIM+HgwfdlVvkeaTtVBX/yBDikL+Tiu92b4qDrbuDamojI2ZmDo70IskVoGrwtvDiZUlB62ha0EW657SKCJHaFmSCVxmn7t5xmQanAHfWGASJ7+3A3yzvHs5ncxAum3BCheHpshJdURbcDqTsgAAAVlJREFUeJxtkN8rQ3EYxp9nv0pK2UptWanRmBaJrJHkxgqXS+2KLEq45G9QLlcS9y4sKVeKlOTXoqQNzXahGaWRZpRZx/ecdTZnPBdvve+n99dDFEVZeZRFJZpYVLYC1MjFF1jIZy2oI5+sj7CRKS2wi4YMLJKOSS1wyKPAgoExDWglr5TETV7+Bu3khZJ0vJrPted2vsXlo9silX84LGcidj+kKgE8YnuBx38+B3oJ6RBa0Ke4cQQvC5JkyspG7AjgU8rbrkbcxUbiTu4PkGkxk0NVYbnTL0bplDeTDXp+G8mx5IEMxmXwKakb9AkGInH4N+BNw+bKrQOjecsqMPmugKkV2E34GjRwGdNkCJjNqGDuBJ4PQ8586uGmFd7rWhX4xKh6GHfd0WHhvWOrSwWYQSiINWB+qVq80lQGC1gM6kum998zsNcD5y3QjJuWsL9kSIITUfwn3Q/q1GlhQS3iwgAAAABJRU5ErkJggg==" />
                                            </defs>
                                            <style>
                                            </style>
                                            <use id="Background" href="#img1" x="0" y="0" />
                                        </svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{job?.jobType}</h6>
                                        <p>Job Type</p>
                                    </div>
                                </div>
                            )}
                            {job?.workMode?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 24 24" width="24" height="24">
                                            <defs>
                                                <image width="22" height="22" id="img2" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAMAAADzapwJAAAAAXNSR0IB2cksfwAAAQ5QTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcVGFvQAAAFp0Uk5TABcWUVJUCgM6PRW0mRQGETNgiBAPoLZoZrUaocSodwmkQ69yDAE4SH2lfkecqpstXXWxrETIp6OmmpY8TrKYH2cIsDepbwUhcYeMhBsiHQJeOV9crqKRTSYE5cCmbAAAASVJREFUeJxdkM9LAkEcxd9bLXEpJYgKEVrJkCLzIGREJF26RtCh/7BjFB2iS3aIkG5qFBS1QvQLTXIjtNqdxt11V/d7mceH77z3ZghvSMvXPg7BDOAwf4FR/AAjlunjCDvuWtTqDpmoJIRieCaxL5kUZy9QESLUBJSxNjHJjoEpOteE8oIEuw3XJGl82md8/GmwYFKa1DErhBjCmp7qRYpHTXdw+vvZxpiX+A42TqjM8FaKhRu3mS0W3QJY6vdnJfgng0Pk3mYe2j6IzRH38jl5mmFZj1Us8wLr/Lje4DlRKEcLJXtxk/bUsifoY7VYxuprozWdqWvH8HBkS+qjbVZyB06kxMUz55N39NTfodskz/eVy7Wr9EQty9apV3Cv1NzdD/b+B2TlWmbomEljAAAAAElFTkSuQmCC" />
                                            </defs>
                                            <style>
                                            </style>
                                            <use id="Background" href="#img2" x="1" y="1" />
                                        </svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{job?.workMode}</h6>
                                        <p>Work Mode</p>
                                    </div>
                                </div>
                            )}
                            {job?.experience?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 24 24" width="24" height="24">
                                            <defs>
                                                <image width="24" height="24" id="img3" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0IB2cksfwAAAbxQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAhygLbQAAAJR0Uk5TAAG8uUYDsAcMLn81SFVMBGl7OVSViGdPtarItLIxnBJLN30Lo7garcLBFw2+Qb+TcZoFBioiSZ1RJaApAsNciSY7KCSuRWxmg3yzoauxFhGiPVpiUG2PL4DGmdheTXhgl5Sox7s8HBkUmO0dU0I4cxA+LBsYPzSWHpFutr0jFc4PDjJ2aHDTH0SsVi2kMwimh4W3ixRXfxUAAAHfSURBVHicY2RAAoxA8AfGRpZgBYqz/sAiwcD5nYvxK4oEIzfQlI+M/B8EGd+hSAgz/uRgfMXK+EscZM8/BmZGoAS7+G+2jwIPFIEij34BuXJ3/jOofWZkYFV6Kgg06Jo20OKbQAkGPcZnDOwijAycGucZjM6BzDO6zAiUMP7KwwhyOAOjrNQJBsvb7PKMR1lBEjaMjOcZWPSAdjj8OuZ4XQvoHsYDYIk3cowMPzgZPRkZ3x1nltHd5c547/Z/kFG/f2gyfOJn9NoGVCTKyLg2BGjuudtAqyIYGc+anGb02v6fwUaBkXGRuwTjI/nH141EGW8ctflwhTFmWRLjbF/Jm3eFLeZEPf+/lyGDkfHXiYdAfzBkP91g+tPurLQA52opsLNFvn/NnsrIYPwieBIDB4e8A+Mm/36gcNHjU7pb2MwYGYqOnmQoZuxhYMj4szqNsat4t8ImiRfloLCqZNznzMjYXLcqnJGxsaHB7gCDxIsENqAEY9MkucCuT3m3bZ5PqeCbfZ+h/eQG6S/QYO+Y/KuEcaHddHA8tjC9FSmBxaBpxOYDDAxBR8uLFX79eJukWYoUtZZh/z+9v7ur63vVhPkXUOLcda/c098MDNxOhz+gJYaGeyY7DBkknnYA2QA2VJ/cu2f2WwAAAABJRU5ErkJggg==" />
                                            </defs>
                                            <style>
                                            </style>
                                            <use id="Background" href="#img3" x="0" y="0" />
                                        </svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{job?.experience}</h6>
                                        <p>Experience</p>
                                    </div>
                                </div>
                            )}
                            {job?.salary?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 24 24" width="24" height="24">
                                            <defs>
                                                <image width="24" height="24" id="img4" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0IB2cksfwAAAaRQTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMalYaAAAAIx0Uk5TAB/BtLq3trOKLZEDBQ+xTS/AFH1XJ6S9q11VcMUBQYvsPFQ9vAkHd3bTu6qhsKULFVipCg0SPzVJXwYcCBHhUJAoZZUbmjgwl50XrogyY+Z0GrgemDFbXKiyljd+n2vG51aHEIFFp0glYUBPbpIO33N8YiGPWoATmdqiFoxCRGApBJs7Ir9neq8khVmpl2ejAAABjklEQVR4nGNkgAFGKPgB5cIlOBkZv/J84WX8hCLBz/j3syDjOwYGYcY3KBKin/kYGd8LgYx6jGqULNj871yMjLdRJNTuqoBl/jEzMl5EljD4KMDIeNaE8TSDGeNJFKMsPj/4ysCrcxyo+ZPSMYSE9UuJIwy2t9Ve3WBgsGc8gJAw4t/PwKAuzci4B8hxZdwFk3Bn3AEkLQV+7QXxvBi3wiR8GDeDnGzIyLgBxNVRXQ+VCDoN9lbwB0HG1UA6jHElA6Ob0OW/NyKXg8StJD+I/wZJRDMuYWCMfb6HLYLx7hEgX+Ol/wpw2LqJASV0OE97ix3/Y8c4F2ir1BywyZayq8ASIpyPGVJPWP67p8o4AyzBF33zFEgiazPI6uRXcoyMB37eYsjb6bHTgxFs1MEvsNgqeirDOEnm5ddSZInyjf8ZAhkZ955kqN4YcABJwsoZ6KnL6xlkk1Yrb4a4yrSBAQEy5mcK1gODpAkYPX9bGu7OhQgbhzC+7gXHRyfjoWv3VNN6X6uDuLf/yd+DqAAARXiASDups4cAAAAASUVORK5CYII=" />
                                            </defs>
                                            <style>
                                            </style>
                                            <use id="Background" href="#img4" x="0" y="0" />
                                        </svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{job?.salary}</h6>
                                        <p>Salary</p>
                                    </div>
                                </div>
                            )}
                            {job?.openings?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.2" viewBox="0 0 24 24" width="24" height="24">
                                            <defs>
                                                <image width="24" height="24" id="img5" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAAXNSR0IB2cksfwAAAL1QTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAguN3MAAAAD90Uk5TABVD1v9C/tUqBxBJy+qDC/kD4T+8S6o68iijOMP6v/ETc9TEMhel6wQwDgnYAX72Y20MkgiY/dNO6A14Bi8u2OE0NAAAARVJREFUeJydkt0vA1EQxee0RUujFivRTWTFSxOKEq0Hf74XxDdJX0QjaZtYrEppfR5zdzeblvViHubOnN/NzNzJhfxhGIqZBFJQwK9fYARGS/H9Jxj7DI706yDIojf+FgmjLzn2QzCBfg5AN9DzJHtZPiuw8KRCAY8BmGJH/SR9iO0bYRq402OWfDCp5UHmPRPNtZxg3Gbx1qR2W3sstEScj6aWEy3jZDQq3pjmLkK70ptLDK1hQKmxqHI9Grek8rVbF5SBS3HzF/FqVroNWSZROddkFacxWOOZ+jLS5u3rOI5BhSfqiepRIthARhKB/APUDhPBJrZxIFLFXgxq3BfZImRH1zrTsbxIt/3CvS55d/CXDNk3u3ZrKxm7bG4AAAAASUVORK5CYII=" />
                                            </defs>
                                            <style>
                                            </style>
                                            <use id="Background" href="#img5" x="0" y="0" />
                                        </svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{job?.openings}</h6>
                                        <p>Openings</p>
                                    </div>
                                </div>
                            )}
                            {job?.deadline?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" viewBox="0 0 24 24" role="img"><path vectorEffect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21a9 9 0 100-18 9 9 0 000 18z"></path><path vectorEffect="non-scaling-stroke" stroke="var(--icon-color, #001e00)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.24 16.24L12 12V6"></path></svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{job?.deadline ? new Date(job?.deadline).toLocaleDateString() : 'N/A'}</h6>
                                        <p>Deadline</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {skillsList?.length > 0 && (
                            <div className='job_skills'>
                                <h4>Skills and Expertise</h4>
                                <div className='job_skill_section'>
                                    {skillsList.map((skill, idx) => (
                                        <span key={idx} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='job_btns_info'>
                        <div className='job_btn_sticky'>
                            <div className='job_btns'>
                                <button onClick={handleApply} disabled={isApplied || isApplying} className="apply-btn">
                                    {isApplying ? "Applying..." : isApplied ? "Applied" : "Apply now"}
                                </button>
                                <button className={`save-btn ${isSaved ? 'saved' : 'unsaved'}`} onClick={handleSaveToggle}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="19" viewBox="0 0 22 19" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M4.374 1.89038C2.715 2.64838 1.5 4.45238 1.5 6.60338C1.5 8.80038 2.4 10.4944 3.688 11.9464C4.751 13.1424 6.037 14.1344 7.291 15.1004C7.58967 15.3304 7.88467 15.5597 8.176 15.7884C8.702 16.2034 9.171 16.5664 9.624 16.8314C10.077 17.0964 10.44 17.2164 10.75 17.2164C11.06 17.2164 11.424 17.0964 11.876 16.8314C12.329 16.5664 12.798 16.2034 13.324 15.7884C13.6153 15.559 13.9103 15.33 14.209 15.1014C15.463 14.1334 16.749 13.1424 17.812 11.9464C19.101 10.4944 20 8.80038 20 6.60338C20 4.45338 18.785 2.64838 17.126 1.89038C15.514 1.15338 13.348 1.34838 11.29 3.48738C11.22 3.55996 11.1362 3.6177 11.0434 3.65714C10.9506 3.69657 10.8508 3.7169 10.75 3.7169C10.6492 3.7169 10.5494 3.69657 10.4566 3.65714C10.3638 3.6177 10.28 3.55996 10.21 3.48738C8.152 1.34838 5.986 1.15338 4.374 1.89038ZM10.75 1.92638C8.438 -0.143622 5.849 -0.433622 3.75 0.525378C1.536 1.54038 0 3.89238 0 6.60438C0 9.26938 1.11 11.3034 2.567 12.9434C3.733 14.2564 5.16 15.3554 6.421 16.3254C6.70767 16.5454 6.983 16.7594 7.247 16.9674C7.76 17.3714 8.31 17.8014 8.867 18.1274C9.424 18.4534 10.06 18.7174 10.75 18.7174C11.44 18.7174 12.076 18.4524 12.633 18.1274C13.191 17.8014 13.74 17.3714 14.253 16.9674C14.517 16.7594 14.7923 16.5454 15.079 16.3254C16.339 15.3554 17.767 14.2554 18.933 12.9434C20.39 11.3034 21.5 9.26938 21.5 6.60438C21.5 3.89238 19.965 1.54038 17.75 0.527378C15.651 -0.432622 13.062 -0.142622 10.75 1.92638Z" fill="#6C6969"></path></svg>
                                    {isSaving ? (isSaved ? "Removing..." : "Saving...") : (isSaved ? "Saved" : "Save now")}
                                </button>
                            </div>
                            {(job?.company?.companyName?.length || job?.company?.industry?.length || job?.company?.companySize?.length) > 0 && (
                                <div className='job_company_info'>
                                    <h4>About the Company</h4>
                                    <div className='job_company_logo'>
                                        {job?.company?.logo ? (
                                            <img src={getFileUrl(job?.company?.logo)} alt={job?.company?.companyName} />
                                        ) : (
                                            <div className="placeholder-logo">
                                                {job?.company?.companyName?.charAt(0).toUpperCase() || 'C'}
                                            </div>
                                        )}
                                    </div>
                                    <div className='job_company_name'>
                                        {job?.company?.companyName && <h5>{job?.company.companyName}</h5>}
                                        {job?.company?.industry && <p>{job?.company.industry}</p>}
                                        {job?.company?.companySize && <p>({job?.company.companySize} Employees)</p>}
                                    </div>
                                    <h6>Member since {job?.company?.createdAt ? new Date(job?.company?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}</h6>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CandidateJobDetail;