import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function CandidateProfile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/candidate/me');
                const hasCompletedProfile = res.data.profile?.firstName && res.data.profile?.lastName && res.data.profile?.phone
                if (!hasCompletedProfile) {
                    navigate('/candidate/candidate-profile/edit');
                } else {
                    setProfile(res.data.profile);
                }
            } catch (err) {
                navigate('/candidate/candidate-profile/edit');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const profileImgSrc = getFileUrl(profile?.photoUrl);
    if (loading) return <div>Loading...</div>;

    return (
        <div className="candidate-profile">
            <h2>My Profile</h2>
            <div className="profile-card">
                <div className="banner-bg"></div>
                <div className="profile-header">
                    <div className="profile-picture-container">
                        <div className="profile-picture">
                            {profileImgSrc ? (
                                <img src={profileImgSrc} alt={`${profile?.firstName || ''} ${profile?.lastName || ''}`} />
                            ) : (
                                <div className="placeholder-logo">
                                    {`${profile?.firstName?.charAt(0).toUpperCase() || ''}${profile?.lastName?.charAt(0).toUpperCase() || ''}`}
                                </div>
                            )}
                        </div>
                        <button onClick={() => navigate('/candidate/candidate-profile/edit')} className="edit-btn">Edit Profile</button>
                    </div>
                    <div className="company-info">
                        <h3>{profile.firstName} {profile.lastName}</h3>
                        <p>{profile.currentPosition}</p>
                    </div>
                </div>
                <div className="info-grid">
                    {profile.email && (
                        <div className="info-item">
                            <div className="logo-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none"><rect width="62" height="62" rx="18" fill="#F0E4FF" /><path d="M38 18.6666H24C22.3203 18.6666 20.7094 19.3339 19.5217 20.5216C18.3339 21.7093 17.6667 23.3203 17.6667 25V37C17.6667 37.8317 17.8305 38.6552 18.1488 39.4236C18.467 40.192 18.9336 40.8902 19.5217 41.4783C20.7094 42.666 22.3203 43.3333 24 43.3333H38C39.6786 43.3298 41.2875 42.6614 42.4745 41.4744C43.6614 40.2874 44.3298 38.6786 44.3333 37V25C44.3298 23.3213 43.6614 21.7125 42.4745 20.5255C41.2875 19.3385 39.6786 18.6701 38 18.6666ZM33.1333 29.76C32.4773 30.1341 31.7352 30.3308 30.98 30.3308C30.2248 30.3308 29.4827 30.1341 28.8267 29.76L19.6933 24.52C19.8114 23.4604 20.316 22.4815 21.1106 21.7706C21.9051 21.0597 22.9338 20.6666 24 20.6666H38C39.0653 20.6695 40.0925 21.0636 40.8864 21.774C41.6804 22.4843 42.1858 23.4615 42.3067 24.52L33.1333 29.76Z" fill="#6D17E1" /></svg>
                            </div>
                            <div className="info-text">
                                <h5>Email</h5>
                                <p>{profile.email}</p>
                            </div>
                        </div>
                    )}
                    {profile.phone && (
                        <div className="info-item">
                            <div className="logo-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none"><rect width="62" height="62" rx="18" fill="#F0E4FF" /><path d="M28.512 29.045L30.658 27.077C31.2453 26.5382 31.6582 25.8363 31.8439 25.0613C32.0296 24.2862 31.9795 23.4734 31.7 22.727L30.783 20.279C30.4412 19.3653 29.7636 18.6165 28.8885 18.1854C28.0134 17.7542 27.0068 17.6733 26.074 17.959C22.642 19.009 20.004 22.199 20.816 25.988C21.35 28.48 22.371 31.608 24.308 34.937C25.931 37.7408 27.9729 40.2801 30.363 42.467C33.233 45.079 37.333 44.426 39.971 41.967C40.6777 41.3074 41.1065 40.4033 41.17 39.4387C41.2336 38.4741 40.9271 37.5216 40.313 36.775L38.632 34.733C38.1254 34.1172 37.4463 33.6669 36.6819 33.4399C35.9174 33.2129 35.1026 33.2196 34.342 33.459L31.566 34.334C31.4587 34.224 31.3367 34.0933 31.2 33.942C30.6291 33.3108 30.1241 32.6228 29.693 31.889C29.2732 31.1486 28.9301 30.3672 28.669 29.557C28.6132 29.3874 28.5608 29.2167 28.512 29.045Z" fill="#6D17E1" /></svg>
                            </div>
                            <div className="info-text">
                                <h5>Phone Number</h5>
                                <p>{profile.phone}</p>
                            </div>
                        </div>
                    )}
                    {profile.dob && (
                        <div className="info-item">
                            <div className="logo-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none"><rect width="62" height="62" rx="18" fill="#F0E4FF" /><path d="M28.512 29.045L30.658 27.077C31.2453 26.5382 31.6582 25.8363 31.8439 25.0613C32.0296 24.2862 31.9795 23.4734 31.7 22.727L30.783 20.279C30.4412 19.3653 29.7636 18.6165 28.8885 18.1854C28.0134 17.7542 27.0068 17.6733 26.074 17.959C22.642 19.009 20.004 22.199 20.816 25.988C21.35 28.48 22.371 31.608 24.308 34.937C25.931 37.7408 27.9729 40.2801 30.363 42.467C33.233 45.079 37.333 44.426 39.971 41.967C40.6777 41.3074 41.1065 40.4033 41.17 39.4387C41.2336 38.4741 40.9271 37.5216 40.313 36.775L38.632 34.733C38.1254 34.1172 37.4463 33.6669 36.6819 33.4399C35.9174 33.2129 35.1026 33.2196 34.342 33.459L31.566 34.334C31.4587 34.224 31.3367 34.0933 31.2 33.942C30.6291 33.3108 30.1241 32.6228 29.693 31.889C29.2732 31.1486 28.9301 30.3672 28.669 29.557C28.6132 29.3874 28.5608 29.2167 28.512 29.045Z" fill="#6D17E1" /></svg>
                            </div>
                            <div className="info-text">
                                <h5>Date of Birth</h5>
                                <p>{profile.dob ? new Date(profile.dob).toLocaleDateString() : ''}</p>
                            </div>
                        </div>
                    )}
                    {profile.gender && (
                        <div className="info-item">
                            <div className="logo-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none"><rect width="62" height="62" rx="18" fill="#F0E4FF" /><path d="M28.512 29.045L30.658 27.077C31.2453 26.5382 31.6582 25.8363 31.8439 25.0613C32.0296 24.2862 31.9795 23.4734 31.7 22.727L30.783 20.279C30.4412 19.3653 29.7636 18.6165 28.8885 18.1854C28.0134 17.7542 27.0068 17.6733 26.074 17.959C22.642 19.009 20.004 22.199 20.816 25.988C21.35 28.48 22.371 31.608 24.308 34.937C25.931 37.7408 27.9729 40.2801 30.363 42.467C33.233 45.079 37.333 44.426 39.971 41.967C40.6777 41.3074 41.1065 40.4033 41.17 39.4387C41.2336 38.4741 40.9271 37.5216 40.313 36.775L38.632 34.733C38.1254 34.1172 37.4463 33.6669 36.6819 33.4399C35.9174 33.2129 35.1026 33.2196 34.342 33.459L31.566 34.334C31.4587 34.224 31.3367 34.0933 31.2 33.942C30.6291 33.3108 30.1241 32.6228 29.693 31.889C29.2732 31.1486 28.9301 30.3672 28.669 29.557C28.6132 29.3874 28.5608 29.2167 28.512 29.045Z" fill="#6D17E1" /></svg>
                            </div>
                            <div className="info-text">
                                <h5>Gender</h5>
                                <p>{profile.gender}</p>
                            </div>
                        </div>
                    )}
                    {(profile.city || profile.address) && (
                        <div className="info-item">
                            <div className="logo-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none"><rect width="62" height="62" rx="18" fill="#F0E4FF" /><path d="M31 30.3333C30.1159 30.3333 29.2681 29.9821 28.6429 29.357C28.0178 28.7319 27.6666 27.884 27.6666 27C27.6666 26.1159 28.0178 25.2681 28.6429 24.6429C29.2681 24.0178 30.1159 23.6666 31 23.6666C31.884 23.6666 32.7319 24.0178 33.357 24.6429C33.9821 25.2681 34.3333 26.1159 34.3333 27C34.3333 27.4377 34.2471 27.8712 34.0796 28.2756C33.912 28.68 33.6665 29.0475 33.357 29.357C33.0475 29.6665 32.68 29.912 32.2756 30.0796C31.8712 30.2471 31.4377 30.3333 31 30.3333ZM31 17.6666C28.5246 17.6666 26.1506 18.65 24.4003 20.4003C22.65 22.1506 21.6666 24.5246 21.6666 27C21.6666 34 31 44.3333 31 44.3333C31 44.3333 40.3333 34 40.3333 27C40.3333 24.5246 39.35 22.1506 37.5996 20.4003C35.8493 18.65 33.4753 17.6666 31 17.6666Z" fill="#6D17E1" /></svg>
                            </div>
                            <div className="info-text">
                                <h5>Address</h5>
                                <p>{[profile.city, profile.zipCode, profile.state, profile.country].filter(Boolean).join(', ')}</p>
                            </div>
                        </div>
                    )}
                    {(profile.qualification) && (
                        <div className="info-item">
                            <div className="logo-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none"><rect width="62" height="62" rx="18" fill="#F0E4FF" /><path d="M31 30.3333C30.1159 30.3333 29.2681 29.9821 28.6429 29.357C28.0178 28.7319 27.6666 27.884 27.6666 27C27.6666 26.1159 28.0178 25.2681 28.6429 24.6429C29.2681 24.0178 30.1159 23.6666 31 23.6666C31.884 23.6666 32.7319 24.0178 33.357 24.6429C33.9821 25.2681 34.3333 26.1159 34.3333 27C34.3333 27.4377 34.2471 27.8712 34.0796 28.2756C33.912 28.68 33.6665 29.0475 33.357 29.357C33.0475 29.6665 32.68 29.912 32.2756 30.0796C31.8712 30.2471 31.4377 30.3333 31 30.3333ZM31 17.6666C28.5246 17.6666 26.1506 18.65 24.4003 20.4003C22.65 22.1506 21.6666 24.5246 21.6666 27C21.6666 34 31 44.3333 31 44.3333C31 44.3333 40.3333 34 40.3333 27C40.3333 24.5246 39.35 22.1506 37.5996 20.4003C35.8493 18.65 33.4753 17.6666 31 17.6666Z" fill="#6D17E1" /></svg>
                            </div>
                            <div className="info-text">
                                <h5>Qualification</h5>
                                <p>{profile.qualification}</p>
                            </div>
                        </div>
                    )}
                    {(profile.currentSalary) && (
                        <div className="info-item">
                            <div className="logo-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none"><rect width="62" height="62" rx="18" fill="#F0E4FF" /><path d="M31 30.3333C30.1159 30.3333 29.2681 29.9821 28.6429 29.357C28.0178 28.7319 27.6666 27.884 27.6666 27C27.6666 26.1159 28.0178 25.2681 28.6429 24.6429C29.2681 24.0178 30.1159 23.6666 31 23.6666C31.884 23.6666 32.7319 24.0178 33.357 24.6429C33.9821 25.2681 34.3333 26.1159 34.3333 27C34.3333 27.4377 34.2471 27.8712 34.0796 28.2756C33.912 28.68 33.6665 29.0475 33.357 29.357C33.0475 29.6665 32.68 29.912 32.2756 30.0796C31.8712 30.2471 31.4377 30.3333 31 30.3333ZM31 17.6666C28.5246 17.6666 26.1506 18.65 24.4003 20.4003C22.65 22.1506 21.6666 24.5246 21.6666 27C21.6666 34 31 44.3333 31 44.3333C31 44.3333 40.3333 34 40.3333 27C40.3333 24.5246 39.35 22.1506 37.5996 20.4003C35.8493 18.65 33.4753 17.6666 31 17.6666Z" fill="#6D17E1" /></svg>
                            </div>
                            <div className="info-text">
                                <h5>Current Salary</h5>
                                <p>{profile.currentSalary}</p>
                            </div>
                        </div>
                    )}
                    {(profile.expectedSalary) && (
                        <div className="info-item">
                            <div className="logo-container">
                                <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none"><rect width="62" height="62" rx="18" fill="#F0E4FF" /><path d="M31 30.3333C30.1159 30.3333 29.2681 29.9821 28.6429 29.357C28.0178 28.7319 27.6666 27.884 27.6666 27C27.6666 26.1159 28.0178 25.2681 28.6429 24.6429C29.2681 24.0178 30.1159 23.6666 31 23.6666C31.884 23.6666 32.7319 24.0178 33.357 24.6429C33.9821 25.2681 34.3333 26.1159 34.3333 27C34.3333 27.4377 34.2471 27.8712 34.0796 28.2756C33.912 28.68 33.6665 29.0475 33.357 29.357C33.0475 29.6665 32.68 29.912 32.2756 30.0796C31.8712 30.2471 31.4377 30.3333 31 30.3333ZM31 17.6666C28.5246 17.6666 26.1506 18.65 24.4003 20.4003C22.65 22.1506 21.6666 24.5246 21.6666 27C21.6666 34 31 44.3333 31 44.3333C31 44.3333 40.3333 34 40.3333 27C40.3333 24.5246 39.35 22.1506 37.5996 20.4003C35.8493 18.65 33.4753 17.6666 31 17.6666Z" fill="#6D17E1" /></svg>
                            </div>
                            <div className="info-text">
                                <h5>Expected Salary</h5>
                                <p>{profile.expectedSalary}</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {profile.description && (
                <div className="section">
                    <h4>About Company</h4>
                    <p>{profile.description}</p>
                </div>
            )}
            {(profile.linkedin || profile.instagram) && (
                <div className="section">
                    <h4>Social Network</h4>
                    <div className="social-grid">
                        {profile.linkedin && (
                            <div className="social-item">
                                <div className="logo-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none"><rect width="62" height="62" rx="18" fill="#F0E4FF" /><g clipPath="url(#clip0_747_947)"><path d="M31 15.6399C22.5168 15.6399 15.64 22.5167 15.64 30.9999C15.64 39.4831 22.5168 46.3599 31 46.3599C39.4832 46.3599 46.36 39.4831 46.36 30.9999C46.36 22.5167 39.4832 15.6399 31 15.6399ZM27.24 37.3663H24.1296V27.3567H27.24V37.3663ZM25.6656 26.1279C24.6832 26.1279 24.048 25.4319 24.048 24.5711C24.048 23.6927 24.7024 23.0175 25.7056 23.0175C26.7088 23.0175 27.3232 23.6927 27.3424 24.5711C27.3424 25.4319 26.7088 26.1279 25.6656 26.1279ZM38.6 37.3663H35.4896V31.8191C35.4896 30.5279 35.0384 29.6511 33.9136 29.6511C33.0544 29.6511 32.544 30.2447 32.3184 30.8159C32.2352 31.0191 32.2144 31.3071 32.2144 31.5935V37.3647H29.1024V30.5487C29.1024 29.2991 29.0624 28.2543 29.0208 27.3551H31.7232L31.8656 28.7455H31.928C32.3376 28.0927 33.3408 27.1295 35.0192 27.1295C37.0656 27.1295 38.6 28.5007 38.6 31.4479V37.3663Z" fill="#6D17E1" /></g><defs><clipPath id="clip0_747_947"><rect width="32" height="32" fill="white" transform="translate(15 15)" /></clipPath></defs></svg>
                                </div>
                                <div className="info-text">
                                    <h5>LinkedIn</h5>
                                    <p><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com</a></p>
                                </div>
                            </div>
                        )}
                        {profile.github && (
                            <div className="social-item">
                                <div className="logo-container">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="62" height="62" viewBox="0 0 62 62" fill="none"><rect width="62" height="62" rx="18" fill="#F0E4FF" /><g clipPath="url(#clip0_747_947)"><path d="M31 15.6399C22.5168 15.6399 15.64 22.5167 15.64 30.9999C15.64 39.4831 22.5168 46.3599 31 46.3599C39.4832 46.3599 46.36 39.4831 46.36 30.9999C46.36 22.5167 39.4832 15.6399 31 15.6399ZM27.24 37.3663H24.1296V27.3567H27.24V37.3663ZM25.6656 26.1279C24.6832 26.1279 24.048 25.4319 24.048 24.5711C24.048 23.6927 24.7024 23.0175 25.7056 23.0175C26.7088 23.0175 27.3232 23.6927 27.3424 24.5711C27.3424 25.4319 26.7088 26.1279 25.6656 26.1279ZM38.6 37.3663H35.4896V31.8191C35.4896 30.5279 35.0384 29.6511 33.9136 29.6511C33.0544 29.6511 32.544 30.2447 32.3184 30.8159C32.2352 31.0191 32.2144 31.3071 32.2144 31.5935V37.3647H29.1024V30.5487C29.1024 29.2991 29.0624 28.2543 29.0208 27.3551H31.7232L31.8656 28.7455H31.928C32.3376 28.0927 33.3408 27.1295 35.0192 27.1295C37.0656 27.1295 38.6 28.5007 38.6 31.4479V37.3663Z" fill="#6D17E1" /></g><defs><clipPath id="clip0_747_947"><rect width="32" height="32" fill="white" transform="translate(15 15)" /></clipPath></defs></svg>
                                </div>
                                <div className="info-text">
                                    <h5>GitHub</h5>
                                    <p><a href={profile.github} target="_blank" rel="noopener noreferrer">github.com</a></p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CandidateProfile;