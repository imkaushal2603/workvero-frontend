import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import api from "../services/api";
import Loader from "../components/Loader";
import toast from 'react-hot-toast';

function ApplicantsView() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [applicantData, setApplicantData] = useState(null);
    const [status, setStatus] = useState("review");
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplicantDetails = async () => {
            setLoading(true);
            try {
                const [res] = await Promise.all([
                    api.get(`/company/me/applicants/${id}`),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);
                setApplicantData(res.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching applicant details:", err);
                setError("Failed to load applicant profile data.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchApplicantDetails();
        }
    }, [id]);

    useEffect(() => {
        if (applicantData?.status) {
            setStatus(applicantData.status);
        }
    }, [applicantData]);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        const previousStatus = status;

        setStatus(newStatus);
        setUpdatingStatus(true);

        try {
            await api.patch(`/company/me/applicants/${id}`, { status: newStatus });
            toast.success('Application Status updated successfully!');
        } catch (err) {
            console.error("Failed to update applicant status:", err);
            setStatus(previousStatus);
        } finally {
            setUpdatingStatus(false);
        }
    };

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
        return encodeURI(`${baseUrl}/${path.replace(/^\//, "")}`);
    };

    const profile = applicantData?.user?.candidate_profile;
    const userEmail = applicantData?.user?.email;
    const appliedJobsList = applicantData?.appliedJobs || [];
    const cvFile = applicantData?.user?.candidate_profile?.cv_files;

    return (
        <>
            {loading && <Loader />}
            <div className={`applicants_view ${loading ? "loading" : ""}`}>
                <div className="header-row">
                    <button onClick={() => navigate('/employer/applicants')} className="back-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M11.7071 4.29289C12.0976 4.68342 12.0976 5.31658 11.7071 5.70711L6.41421 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H6.41421L11.7071 18.2929C12.0976 18.6834 12.0976 19.3166 11.7071 19.7071C11.3166 20.0976 10.6834 20.0976 10.2929 19.7071L3.29289 12.7071C3.10536 12.5196 3 12.2652 3 12C3 11.7348 3.10536 11.4804 3.29289 11.2929L10.2929 4.29289C10.6834 3.90237 11.3166 3.90237 11.7071 4.29289Z" fill="#000000" />
                        </svg>
                    </button>
                </div>
                <div className="profile-card job_detailed_info">
                    <div className='job_info'>
                        <div className="company-info">
                            <div className="applicant_img">
                                {profile?.photoUrl ? (
                                    <img src={getFileUrl(profile.photoUrl)} alt={`${profile?.firstName} ${profile?.lastName}`} />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {profile?.firstName?.[0]}{profile?.lastName?.[0]}
                                    </div>
                                )}
                            </div>
                            <div className="applicant_info">
                                <h2>{profile?.firstName} {profile?.lastName}</h2>
                                <span>{profile?.email}</span>
                            </div>
                        </div>
                        {profile?.description?.length > 0 && (
                            <div className="job_description">
                                <span>Summary</span>
                                <p>{profile?.description}</p>
                            </div>
                        )}
                        <div className='job_related_details'>
                            {profile?.qualification?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg width="24px" height="24px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="48" height="48" fill="white" fillOpacity="0.01"></rect> <path d="M2 17.4L23.0222 9L44.0444 17.4L23.0222 25.8L2 17.4Z" fill="#fff" stroke="#000000" strokeWidth="4" strokeLinejoin="round"></path> <path d="M44.0444 17.5101V26.7333" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M11.5555 21.8253V34.2667C11.5555 34.2667 16.3656 39 23.0222 39C29.6788 39 34.4889 34.2667 34.4889 34.2667V21.8253" stroke="#000000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{profile?.qualification}</h6>
                                        <p>Qualification</p>
                                    </div>
                                </div>
                            )}
                            {profile?.currentPosition?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg fill="#000000" height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 480 480" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <g> <path d="M399.67,60.827h-35.62V10c0-5.523-4.478-10-10-10c-5.522,0-10,4.477-10,10v50.827H135.951V10c0-5.523-4.478-10-10-10 c-5.522,0-10,4.477-10,10v50.827H80.33c-5.522,0-10,4.477-10,10V470c0,5.523,4.478,10,10,10h319.34c5.523,0,10-4.477,10-10 V70.827C409.67,65.304,405.192,60.827,399.67,60.827z M90.33,460V80.827h299.34V460H90.33z"></path> <path d="M354.05,383.967H141.157c-5.522,0-10,4.477-10,10s4.478,10,10,10H354.05c5.522,0,10-4.477,10-10 S359.572,383.967,354.05,383.967z"></path> <path d="M308.43,414.38H186.777c-5.522,0-10,4.477-10,10s4.478,10,10,10H308.43c5.522,0,10-4.477,10-10 S313.952,414.38,308.43,414.38z"></path> <path d="M323.636,358.347h30.413c5.522,0,10-4.477,10-10V116.446c0-5.523-4.478-10-10-10H125.951c-5.522,0-10,4.477-10,10 v231.901c0,5.523,4.478,10,10,10h30.412H323.636z M227.127,338.348h-60.764v-19.543c0-14.776,8.854-31.789,23.685-45.509 c8.739-8.086,18.628-14.227,28.459-17.917c0.796,0.204,1.626,0.324,2.485,0.324h6.135V338.348z M313.637,338.347h-66.51v-82.645 h11.881c0.161,0,0.318-0.017,0.478-0.024c10.022,3.776,20.218,9.902,29.131,17.773c15.666,13.832,25.02,30.787,25.02,45.353 V338.347z M344.05,126.445v211.902h-10.413v-19.543c0-34.153-30.871-66.784-63.918-80.538 c19.764-10.752,33.207-31.705,33.207-55.739c0-24.294-13.735-45.432-33.842-56.082H344.05z M282.926,182.528 c0,23.936-19.48,43.409-43.423,43.409c-23.932-0.001-43.401-19.474-43.401-43.409c0-23.946,19.47-43.427,43.401-43.427 C263.446,139.101,282.926,158.582,282.926,182.528z M146.362,338.348H135.95V126.446h0.001h73.98 c-20.1,10.65-33.83,31.787-33.83,56.082c0,23.733,13.113,44.451,32.466,55.319c-11.295,4.677-22.367,11.762-32.102,20.768 c-19.131,17.699-30.103,39.637-30.103,60.19V338.348z"></path> </g> </g> </g> </g></svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{profile?.currentPosition}</h6>
                                        <p>Designation</p>
                                    </div>
                                </div>
                            )}
                            {profile?.currentSalary?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg fill="#000000" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 256 240" enableBackground="new 0 0 256 240" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M84.635,20.256c18.383,0,33.286,14.903,33.286,33.286s-14.903,33.286-33.286,33.286S51.349,71.925,51.349,53.542 S66.251,20.256,84.635,20.256z M31.002,145.011c0-2.499,1.606-4.194,4.194-4.194s4.194,1.606,4.194,4.194v92.986h91.469v-92.986 c0-2.499,1.606-4.194,4.194-4.194c2.499,0,4.194,1.606,4.194,4.194v92.986h29.092V136.623c0-22.934-18.74-41.585-41.585-41.585 h-8.388l-24.451,38.015l-2.945-28.467l4.016-9.638H76.96l4.016,9.638l-3.123,28.645L53.401,95.038h-9.816 C20.651,95.038,2,113.778,2,136.623v101.375h29.092v-92.986H31.002z M224.674,82.529c-4.562-1.862-6.61-2.793-6.61-4.934 c0-1.862,1.583-3.445,5.12-3.445c3.445,0,6.051,0.931,7.355,1.583l1.769-6.424c-1.676-0.652-3.631-1.303-6.331-1.583v-5.213h-9.123 v6.051c-4.562,1.583-7.262,5.213-7.262,9.682c0,5.12,3.724,8.379,9.775,10.52c4.282,1.49,5.865,2.793,5.865,4.934 c0,2.327-1.955,3.724-5.586,3.724c-3.445,0-6.703-1.21-8.844-2.141l-1.583,6.61c1.583,0.931,4.469,1.676,7.541,1.955v5.12h9.124 v-5.958c5.12-1.862,7.541-5.586,7.541-10.054C233.798,87.928,230.912,84.763,224.674,82.529z M201.68,34.77h39.473v6.61H201.68 V34.77z M201.68,21.643h39.473v6.61H201.68V21.643z M254,19.688c-0.186-9.403-7.634-16.851-16.757-17.502 c-0.279,0-0.745-0.093-1.024-0.093c0,0-58.186-0.093-58.465-0.093c-3.724,0-7.262,1.117-10.054,3.072 c-2.421,1.676-4.469,3.91-5.772,6.61c-1.303,2.421-2.048,5.213-2.048,8.193c0,0.093,0,0.186,0,0.279c0,0.093,0,0.093,0,0.186 c0,9.775,7.913,17.781,17.781,17.781c4.282,0,8.193-1.583,11.265-4.096v6.237v30.536v6.61v22.995v19.737H254V21.643 C254,20.992,254,20.247,254,19.688z M247.483,21.643v12.103v79.784h-52.041c0,0,0.093-93.097,0.093-93.562 c0-4.189-1.583-8.193-4.096-11.265h45.059c6.237,1.117,10.892,6.517,10.892,12.94H247.483z M201.68,47.897h39.473v6.61H201.68 V47.897z"></path> </g></svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{profile?.currentSalary}</h6>
                                        <p>Current Salary</p>
                                    </div>
                                </div>
                            )}
                            {profile?.expectedSalary?.length > 0 && (
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
                                        <h6>{profile?.expectedSalary}</h6>
                                        <p>Expected Salary</p>
                                    </div>
                                </div>
                            )}
                            {profile?.phone?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg width="24px" height="24px" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 5V1H7V5L4.5 7.5L8.5 11.5L11 9H15V15H11C5.47715 15 1 10.5228 1 5Z" fill="#000000"></path> </g></svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{profile?.phone}</h6>
                                        <p>Phone Number</p>
                                    </div>
                                </div>
                            )}
                            {(profile?.city?.length > 0 || profile?.country?.length > 0) && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6>{[profile?.city, profile?.country].filter(Boolean).join(', ')}</h6>
                                        <p>Location</p>
                                    </div>
                                </div>
                            )}
                            {profile?.github?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg width="24px" height="24px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>github [#142]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="#000000"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]"> </path> </g> </g> </g> </g></svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6><a href={profile?.github} target="_blank" rel="noopener noreferrer">github.com</a></h6>
                                        <p>GitHub</p>
                                    </div>
                                </div>
                            )}
                            {profile?.linkedin?.length > 0 && (
                                <div className='job_related_card'>
                                    <div className='job_related_icon'>
                                        <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18.72 3.99997H5.37C5.19793 3.99191 5.02595 4.01786 4.86392 4.07635C4.70189 4.13484 4.55299 4.22471 4.42573 4.34081C4.29848 4.45692 4.19537 4.59699 4.12232 4.75299C4.04927 4.909 4.0077 5.07788 4 5.24997V18.63C4.01008 18.9901 4.15766 19.3328 4.41243 19.5875C4.6672 19.8423 5.00984 19.9899 5.37 20H18.72C19.0701 19.9844 19.4002 19.8322 19.6395 19.5761C19.8788 19.32 20.0082 18.9804 20 18.63V5.24997C20.0029 5.08247 19.9715 4.91616 19.9078 4.76122C19.8441 4.60629 19.7494 4.466 19.6295 4.34895C19.5097 4.23191 19.3672 4.14059 19.2108 4.08058C19.0544 4.02057 18.8874 3.99314 18.72 3.99997ZM9 17.34H6.67V10.21H9V17.34ZM7.89 9.12997C7.72741 9.13564 7.5654 9.10762 7.41416 9.04768C7.26291 8.98774 7.12569 8.89717 7.01113 8.78166C6.89656 8.66615 6.80711 8.5282 6.74841 8.37647C6.6897 8.22474 6.66301 8.06251 6.67 7.89997C6.66281 7.73567 6.69004 7.57169 6.74995 7.41854C6.80986 7.26538 6.90112 7.12644 7.01787 7.01063C7.13463 6.89481 7.2743 6.80468 7.42793 6.74602C7.58157 6.68735 7.74577 6.66145 7.91 6.66997C8.07259 6.66431 8.2346 6.69232 8.38584 6.75226C8.53709 6.8122 8.67431 6.90277 8.78887 7.01828C8.90344 7.13379 8.99289 7.27174 9.05159 7.42347C9.1103 7.5752 9.13699 7.73743 9.13 7.89997C9.13719 8.06427 9.10996 8.22825 9.05005 8.3814C8.99014 8.53456 8.89888 8.6735 8.78213 8.78931C8.66537 8.90513 8.5257 8.99526 8.37207 9.05392C8.21843 9.11259 8.05423 9.13849 7.89 9.12997ZM17.34 17.34H15V13.44C15 12.51 14.67 11.87 13.84 11.87C13.5822 11.8722 13.3313 11.9541 13.1219 12.1045C12.9124 12.2549 12.7546 12.4664 12.67 12.71C12.605 12.8926 12.5778 13.0865 12.59 13.28V17.34H10.29V10.21H12.59V11.21C12.7945 10.8343 13.0988 10.5225 13.4694 10.3089C13.84 10.0954 14.2624 9.98848 14.69 9.99997C16.2 9.99997 17.34 11 17.34 13.13V17.34Z" fill="#000000"></path> </g></svg>
                                    </div>
                                    <div className='job_related_content'>
                                        <h6><a href={profile?.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com</a></h6>
                                        <p>LinkedIn</p>
                                    </div>
                                </div>
                            )}
                        </div>
                        {appliedJobsList?.length > 0 && (
                            <div className='job_skills'>
                                <h4>Applied for role</h4>
                                <div className='job_skill_section'>
                                    <span className="skill-tag">{appliedJobsList[0]?.jobTitle || "N/A"}</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='job_btns_info'>
                        <div className='job_btn_sticky'>
                            <div className='job_btns'>
                                <button
                                    className="apply-btn resume-btn"
                                    disabled={!cvFile?.[0]?.fileUrl}
                                    onClick={() => {
                                        if (cvFile?.[0]?.fileUrl) {
                                            window.open(getFileUrl(cvFile[0].fileUrl), '_blank', 'noopener,noreferrer');
                                        }
                                    }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                    {cvFile?.[0]?.fileUrl ? "View Resume" : "No Resume"}
                                </button>
                                <div className="application_status">
                                    <label htmlFor="applicant-status">Application Status</label>
                                    <div className="form_select_field">
                                        <select id="applicant-status" value={status} onChange={handleStatusChange} disabled={updatingStatus}>
                                            <option value="APPLIED">Applied</option>
                                            <option value="INTERVIEW">Interview</option>
                                            <option value="HIRED">Hired</option>
                                            <option value="REJECTED">Rejected</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ApplicantsView;