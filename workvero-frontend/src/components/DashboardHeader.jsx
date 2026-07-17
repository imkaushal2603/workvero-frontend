import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../assets/logo.png';
import api from '../services/api';

const SEEN_KEY_PREFIX = 'seen_notifications_';

function DashboardHeader() {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [notifLoading, setNotifLoading] = useState(false);
    const [seenIds, setSeenIds] = useState([]);

    const userRole = localStorage.getItem('role');
    const seenStorageKey = `${SEEN_KEY_PREFIX}${userRole}`;

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                let endpoint = '';
                if (userRole === 'recruiter') {
                    endpoint = '/company/me';
                } else if (userRole === 'candidate') {
                    endpoint = '/candidate/me';
                } else {
                    endpoint = '/admin/me';
                }

                const res = await api.get(endpoint);
                if (userRole === 'recruiter' && res.data.company) {
                    setProfile(res.data.company);
                } else if (userRole === 'candidate' && res.data.profile) {
                    setProfile(res.data.profile);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    useEffect(() => {
        try {
            const stored = JSON.parse(localStorage.getItem(seenStorageKey) || '[]');
            setSeenIds(stored);
        } catch {
            setSeenIds([]);
        }
    }, [seenStorageKey]);

    useEffect(() => {
        fetchNotifications();
    }, [userRole]);

    const fetchNotifications = async () => {
        setNotifLoading(true);
        try {
            if (userRole === 'recruiter') {
                const res = await api.get('/company/me/applicants', {
                    params: { page: 1, pageSize: 3 }
                });
                setNotifications(res.data?.applications || []);
            } else if (userRole === 'candidate') {
                const res = await api.get('/candidate/me/applications', {
                    params: { offset: 1, limit: 3 }
                });
                setNotifications(res.data?.applications?.applications || []);
            } else {
                setNotifications([]);
            }
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setNotifications([]);
        } finally {
            setNotifLoading(false);
        }
    };

    const getFileUrl = (path) => {
        if (!path) return null;
        if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
            return path;
        }
        const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, "");
        return encodeURI(`${baseUrl}/${path.replace(/^\//, "")}`);
    };

    const markAsSeen = (id) => {
        setSeenIds(prev => {
            if (prev.includes(id)) return prev;
            const updated = [...prev, id];
            localStorage.setItem(seenStorageKey, JSON.stringify(updated));
            return updated;
        });
    };

    // Correctly closes profile menu when notifications open
    const toggleNotifications = () => {
        const opening = !isNotifOpen;
        setIsNotifOpen(opening);
        setIsDropdownOpen(false);
        if (opening) fetchNotifications();
    };

    // Correctly closes notifications menu when profile dropdown opens
    const toggleAccountDropdown = () => {
        const opening = !isDropdownOpen;
        setIsDropdownOpen(opening);
        setIsNotifOpen(false);
    };

    const STATUS_LABEL_MAP = {
        APPLIED: 'In Review',
        INTERVIEW: 'Interview',
        HIRED: 'Selected',
        REJECTED: 'Rejected',
    };

    const handleNotificationClick = (item) => {
        markAsSeen(item.id);
        setIsNotifOpen(false);
        if (userRole === 'recruiter') {
            navigate(`/employer/applicants/${item.id}`);
        } else if (userRole === 'candidate') {
            navigate(`/candidate/browse-jobs/${item.jobs?.id}`);
        }
    };

    const handleReadMore = () => {
        const allIds = notifications.map(n => n.id);
        const updated = Array.from(new Set([...seenIds, ...allIds]));
        localStorage.setItem(seenStorageKey, JSON.stringify(updated));
        setSeenIds(updated);
        setIsNotifOpen(false);
        if (userRole === 'recruiter') {
            navigate('/employer/applicants');
        } else if (userRole === 'candidate') {
            navigate('/candidate/applied-jobs');
        }
    };

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        try {
            await api.post('/auth/logout');
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('role');

            if (typeof setIsLoggedIn === 'function') {
                setIsLoggedIn(false);
            }
            window.dispatchEvent(new Event('authChange'));

            navigate('/');
        }
    };

    const profileImgPath = profile?.logo || profile?.photoUrl;
    const profileImgSrc = getFileUrl(profileImgPath);
    const profileAltText = profile?.companyName ? profile.companyName : `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim() || 'User Profile';
    const unreadCount = notifications.filter(n => !seenIds.includes(n.id)).length;

    return (
        <div className={`dashboard_header ${isSticky ? 'sticky' : ''}`}>
            <div className="content-wrapper">
                <div className="dashboard_header_section">
                    <div className="dashboard_header_logo">
                        <Link to="/">
                            <img src={Logo} alt={profile?.companyName} />
                        </Link>
                    </div>
                    <div className="dashboard_header_content">
                        <div className="dashboard_header_notifications">
                            <button onClick={toggleNotifications}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="20" viewBox="0 0 16 20" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.58165 1C8.58165 0.734784 8.47629 0.48043 8.28875 0.292893C8.10122 0.105357 7.84686 0 7.58165 0C7.31643 0 7.06208 0.105357 6.87454 0.292893C6.687 0.48043 6.58165 0.734784 6.58165 1V1.75H6.02465C4.95268 1.74993 3.92097 2.15839 3.13957 2.89224C2.35817 3.62608 1.8858 4.63014 1.81865 5.7L1.59765 9.234C1.51221 10.5812 1.05989 11.8794 0.289646 12.988C0.130279 13.2171 0.0329033 13.4835 0.00698854 13.7613C-0.0189262 14.0392 0.0275022 14.319 0.141758 14.5736C0.256015 14.8281 0.43421 15.0488 0.659014 15.2142C0.883818 15.3795 1.14758 15.4838 1.42465 15.517L4.83165 15.925V17C4.83165 17.7293 5.12138 18.4288 5.6371 18.9445C6.15283 19.4603 6.8523 19.75 7.58165 19.75C8.31099 19.75 9.01046 19.4603 9.52619 18.9445C10.0419 18.4288 10.3316 17.7293 10.3316 17V15.925L13.7386 15.516C14.0156 15.4827 14.2791 15.3784 14.5038 15.2131C14.7285 15.0478 14.9066 14.8273 15.0208 14.5729C15.135 14.3184 15.1815 14.0388 15.1557 13.7611C15.1299 13.4834 15.0328 13.2171 14.8736 12.988C14.1034 11.8794 13.6511 10.5812 13.5656 9.234L13.3446 5.701C13.2777 4.63096 12.8055 3.62665 12.024 2.8926C11.2426 2.15855 10.2108 1.74995 9.13865 1.75H8.58165V1ZM6.02465 3.25C5.33422 3.24992 4.66972 3.51297 4.16642 3.98561C3.66313 4.45825 3.35889 5.10493 3.31565 5.794L3.09565 9.328C2.99283 10.9487 2.44851 12.5105 1.52165 13.844C1.51011 13.8606 1.50306 13.8798 1.50118 13.8999C1.4993 13.92 1.50265 13.9403 1.5109 13.9587C1.51915 13.9771 1.53203 13.9931 1.54828 14.005C1.56454 14.017 1.58361 14.0246 1.60365 14.027L5.34065 14.476C6.82965 14.654 8.33365 14.654 9.82265 14.476L13.5596 14.027C13.5797 14.0246 13.5988 14.017 13.615 14.005C13.6313 13.9931 13.6441 13.9771 13.6524 13.9587C13.6606 13.9403 13.664 13.92 13.6621 13.8999C13.6602 13.8798 13.6532 13.8606 13.6416 13.844C12.7151 12.5104 12.1712 10.9486 12.0686 9.328L11.8476 5.794C11.8044 5.10493 11.5002 4.45825 10.9969 3.98561C10.4936 3.51297 9.82907 3.24992 9.13865 3.25H6.02465ZM7.58165 18.25C6.89165 18.25 6.33165 17.69 6.33165 17V16.25H8.83165V17C8.83165 17.69 8.27165 18.25 7.58165 18.25Z" fill="#6C6969" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="notif_badge">{unreadCount}</span>
                                )}
                            </button>
                            {isNotifOpen && (
                                <div className="notification_dropdown">
                                    <h4>{userRole === 'recruiter' ? 'Recent Applicants' : 'Your Applications'}</h4>
                                    {notifLoading ? (
                                        <div style={{ padding: '15px' }}>Loading...</div>
                                    ) : notifications.length > 0 ? (
                                        <>
                                            {notifications.map((item) => {
                                                const isUnread = !seenIds.includes(item.id);
                                                if (userRole === 'recruiter') {
                                                    const candidate = item.user?.candidate_profile;
                                                    return (
                                                        <div key={item.id} className="notification_item" onClick={() => handleNotificationClick(item)}>
                                                            <h6>{candidate?.firstName} {candidate?.lastName}</h6>
                                                            <p>{item.appliedJobs?.[0]?.jobTitle || "N/A"}</p>
                                                        </div>
                                                    );
                                                }
                                                const jobTitle = item.jobs?.title || "N/A";
                                                const companyName = item.jobs?.user?.company_profile?.companyName || "";
                                                return (
                                                    <div key={item.id} className="notification_item" onClick={() => handleNotificationClick(item)}>
                                                        <h6>{jobTitle}</h6>
                                                        <p>{companyName}</p>
                                                    </div>
                                                );
                                            })}
                                            <button onClick={handleReadMore}>Read More</button>
                                        </>
                                    ) : (
                                        <div style={{ padding: '15px' }}>
                                            {userRole === 'recruiter' ? 'No applicants yet.' : 'No applications yet.'}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="account_dropdown">
                            <button
                                className="transparent_btn"
                                onClick={toggleAccountDropdown}
                            >
                                <div className="dashboard_header_profile">
                                    {loading ? (
                                        <div className="profile-skeleton" />
                                    ) : profileImgSrc ? (
                                        <img src={profileImgSrc} alt={profileAltText} />
                                    ) : (
                                        <img />
                                    )}
                                </div>
                                My Account
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="8" viewBox="0 0 13 8" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.65703 7.071L2.66411e-05 1.414L1.41403 -4.94551e-07L6.36403 4.95L11.314 -6.18079e-08L12.728 1.414L7.07103 7.071C6.8835 7.25847 6.62919 7.36379 6.36403 7.36379C6.09886 7.36379 5.84455 7.25847 5.65703 7.071Z" fill="#0146EE" />
                                </svg>
                            </button>
                            {isDropdownOpen && (
                                <div className="dropdown_menu">
                                    <button onClick={handleLogout}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
                                            <path d="M7.5 15C3.35775 15 0 11.6423 0 7.5C0 3.35775 3.35775 9.38841e-07 7.5 9.38841e-07C8.66444 -0.000581937 9.81299 0.27025 10.8545 0.791004C11.896 1.31176 12.8018 2.0681 13.5 3H11.4675C10.6014 2.23632 9.53338 1.73877 8.39154 1.56705C7.24969 1.39533 6.08255 1.55674 5.03017 2.03191C3.97778 2.50708 3.08486 3.27582 2.45855 4.24589C1.83224 5.21596 1.49915 6.34615 1.49925 7.50083C1.49934 8.65552 1.83262 9.78565 2.4591 10.7556C3.08557 11.7256 3.97861 12.4942 5.03108 12.9692C6.08354 13.4442 7.25071 13.6054 8.39253 13.4335C9.53434 13.2616 10.6023 12.7638 11.4683 12H13.5008C12.8025 12.932 11.8966 13.6884 10.8549 14.2092C9.81327 14.7299 8.66457 15.0007 7.5 15ZM12.75 10.5V8.25H6.75V6.75H12.75V4.5L16.5 7.5L12.75 10.5Z" fill="#6D17E1" />
                                        </svg>
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardHeader;