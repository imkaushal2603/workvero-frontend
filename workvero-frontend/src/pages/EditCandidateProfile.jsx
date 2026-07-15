import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loader from "../components/Loader";

function EditCandidateProfile() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState({
        basic: false,
        address: false,
        social: false,
    });
    const [fileObjects, setFileObjects] = useState({ logo: null });
    const logoInputRef = useRef(null);

    const [formData, setFormData] = useState({
        logo: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        currentPosition: '',
        description: '',
        dateOfBirth: '',
        gender: '',
        qualification: '',
        currentSalary: '',
        expectedSalary: '',
        country: '',
        city: '',
        state: '',
        zipCode: '',
        linkedin: '',
        github: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [res] = await Promise.all([
                    api.get('/candidate/me'),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);
                if (res.data.profile) {
                    const c = res.data.profile;
                    setFormData(prev => ({
                        ...prev,
                        logo: c.photoUrl || '',
                        firstName: c.firstName || '',
                        lastName: c.lastName || '',
                        email: c.email || '',
                        phone: c.phone || '',
                        currentPosition: c.currentPosition || '',
                        description: c.description || '',
                        dateOfBirth: c.dob ? c.dob.split('T')[0] : '',
                        gender: c.gender || '',
                        qualification: c.qualification || '',
                        currentSalary: c.currentSalary || '',
                        expectedSalary: c.expectedSalary || '',
                        country: c.country || '',
                        city: c.city || '',
                        state: c.state || '',
                        zipCode: c.zipCode || '',
                        linkedin: c.linkedin || '',
                        github: c.github || ''
                    }));
                }
            } catch (err) {
                console.error('Failed to fetch candidate profile', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const sanitizedValue = value.replace(/[^0-9+\s-]/g, '');
            setFormData({ ...formData, [name]: sanitizedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDocUpload = (field, ref) => (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 1024 * 1024) {
            toast.error('File size exceeds the 1MB limit.');
            if (ref?.current) ref.current.value = '';
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Only image files are allowed.');
            e.target.value = '';
            return;
        }

        setFileObjects(prev => ({ ...prev, [field]: file }));

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, [field]: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveFile = (field, ref) => {
        setFormData(prev => ({ ...prev, [field]: '' }));
        setFileObjects(prev => ({ ...prev, [field]: null }));
        if (ref?.current) ref.current.value = '';
    };

    const API_BASE = import.meta.env.VITE_API_URL.replace(/\/api$/, '');

    const getFileUrl = (file) => {
        if (!file) return '';
        if (file.startsWith('data:')) return file;
        if (file.startsWith('http')) return file;
        return `${API_BASE}/${file.replace(/^\//, '')}`;
    };

    const handleBasicInfoSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(prev => ({ ...prev, basic: true }));
        try {
            const isoDob = formData.dateOfBirth
                ? new Date(formData.dateOfBirth).toISOString()
                : null;
            await Promise.all([
                (async () => {
                    await api.patch('/candidate/me/basic-info', {
                        firstName: formData.firstName,
                        lastName: formData.lastName,
                        email: formData.email,
                        phone: formData.phone,
                        currentPosition: formData.currentPosition,
                        description: formData.description,
                        dob: isoDob,
                        gender: formData.gender,
                        qualification: formData.qualification,
                        currentSalary: formData.currentSalary,
                        expectedSalary: formData.expectedSalary
                    });
                    if (fileObjects.logo) {
                        const avatarData = new FormData();
                        avatarData.append('avatar', fileObjects.logo);
                        const avatarRes = await api.post(
                            '/candidate/me/avatar',
                            avatarData,
                            {
                                headers: {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }
                        );
                        if (avatarRes.data.candidate?.photoUrl) {
                            setFormData(prev => ({
                                ...prev,
                                logo: avatarRes.data.candidate.photoUrl
                            }));
                            setFileObjects(prev => ({
                                ...prev,
                                logo: null
                            }));
                        }
                    } else if (!fileObjects.logo && !formData.logo) {
                        await api.delete('/candidate/me/avatar');
                    }
                })(),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
            toast.success('Basic info saved successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save. Please try again.');
        } finally {
            setSubmitting(prev => ({ ...prev, basic: false }));
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(prev => ({ ...prev, address: true }));
        try {
            await Promise.all([
                api.patch('/candidate/me/address', {
                    country: formData.country,
                    city: formData.city,
                    state: formData.state,
                    zipCode: formData.zipCode
                }),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
            toast.success('Address saved successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save. Please try again.');
        } finally {
            setSubmitting(prev => ({ ...prev, address: false }));
        }
    };

    const handleSocialSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(prev => ({ ...prev, social: true }));
        try {
            await Promise.all([
                api.patch('/candidate/me/social', {
                    linkedin: formData.linkedin,
                    github: formData.github
                }),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
            toast.success('Social links saved successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save. Please try again.');
        } finally {
            setSubmitting(prev => ({ ...prev, social: false }));
        }
    };

    return (
        <>
            {loading && <Loader />}
            <div className={`edit_candidate_profile ${loading ? "loading" : ""}`}>
                <h2>My Profile</h2>
                <div className="edit_candidate_section">
                    <div className="edit_candidate_basic">
                        <form onSubmit={handleBasicInfoSubmit}>
                            <div className="form_card">
                                <h3>Basic Info</h3>
                                <div className="form_fields logo_upload">
                                    <div
                                        className="logo_upload_box"
                                        onClick={() => document.getElementById('logoUpload').click()}
                                    >
                                        {formData.logo ? (
                                            <img src={getFileUrl(formData.logo)} alt="Profile Photo" />
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M12 0C12.1997 0.000124814 12.3969 0.0451206 12.5769 0.131663C12.7569 0.218206 12.9152 0.344084 13.04 0.5L18.3733 7.16667C18.4893 7.30249 18.5768 7.46022 18.6307 7.63052C18.6845 7.80081 18.7036 7.98018 18.6868 8.15798C18.67 8.33579 18.6176 8.50841 18.5328 8.66559C18.448 8.82277 18.3325 8.96132 18.1931 9.073C18.0537 9.18468 17.8933 9.26722 17.7214 9.31572C17.5496 9.36422 17.3697 9.37769 17.1925 9.35534C17.0153 9.33298 16.8444 9.27526 16.6899 9.18559C16.5355 9.09592 16.4006 8.97613 16.2933 8.83333L13.3333 5.13333V14.6667C13.3333 15.0203 13.1929 15.3594 12.9428 15.6095C12.6928 15.8595 12.3536 16 12 16C11.6464 16 11.3072 15.8595 11.0572 15.6095C10.8071 15.3594 10.6667 15.0203 10.6667 14.6667V5.13333L7.70667 8.83467C7.59939 8.97746 7.46453 9.09725 7.31007 9.18692C7.15561 9.27659 6.98471 9.33432 6.80752 9.35667C6.63032 9.37903 6.45044 9.36555 6.27855 9.31705C6.10666 9.26855 5.94627 9.18601 5.80689 9.07433C5.66752 8.96265 5.552 8.82411 5.46719 8.66693C5.38239 8.50974 5.33003 8.33713 5.31322 8.15932C5.29641 7.98151 5.31549 7.80214 5.36934 7.63185C5.42318 7.46156 5.51069 7.30382 5.62667 7.168L10.96 0.501333C11.0847 0.345173 11.2429 0.219041 11.4229 0.132264C11.6029 0.0454871 11.8002 0.000284802 12 0ZM8 14.6667V13.3333H2.66667C1.95942 13.3333 1.28115 13.6143 0.781048 14.1144C0.280951 14.6145 0 15.2928 0 16V21.3333C0 22.0406 0.280951 22.7189 0.781048 23.219C1.28115 23.719 1.95942 24 2.66667 24H21.3333C22.0406 24 22.7189 23.719 23.219 23.219C23.719 22.7189 24 22.0406 24 21.3333V16C24 15.2928 23.719 14.6145 23.219 14.1144C22.7189 13.6143 22.0406 13.3333 21.3333 13.3333H16V14.6667C16 15.7275 15.5786 16.7449 14.8284 17.4951C14.0783 18.2452 13.0609 18.6667 12 18.6667C10.9391 18.6667 9.92172 18.2452 9.17157 17.4951C8.42143 16.7449 8 15.7275 8 14.6667ZM18.6667 17.3333C18.313 17.3333 17.9739 17.4738 17.7239 17.7239C17.4738 17.9739 17.3333 18.313 17.3333 18.6667C17.3333 19.0203 17.4738 19.3594 17.7239 19.6095C17.9739 19.8595 18.313 20 18.6667 20H18.68C19.0336 20 19.3728 19.8595 19.6228 19.6095C19.8729 19.3594 20.0133 19.0203 20.0133 18.6667C20.0133 18.313 19.8729 17.9739 19.6228 17.7239C19.3728 17.4738 19.0336 17.3333 18.68 17.3333H18.6667Z" fill="#6D17E1" />
                                                </svg>
                                                <span>Upload New Photo</span>
                                            </>
                                        )}
                                        <input
                                            ref={logoInputRef}
                                            id="logoUpload"
                                            type="file"
                                            accept=".jpg,.png"
                                            style={{ display: 'none' }}
                                            onChange={handleDocUpload('logo', logoInputRef)}
                                        />
                                    </div>
                                    <div className="logo_upload_info">
                                        {formData.logo && (
                                            <button
                                                type="button"
                                                className="logo_delete_btn"
                                                onClick={() => handleRemoveFile('logo', logoInputRef)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                                    <rect width="48" height="48" rx="12" fill="#E2EAFF" />
                                                    <path d="M31.9999 33.3333C31.9999 34.3942 31.5785 35.4116 30.8283 36.1618C30.0782 36.9119 29.0608 37.3333 27.9999 37.3333H18.6666C17.6057 37.3333 16.5883 36.9119 15.8382 36.1618C15.088 35.4116 14.6666 34.3942 14.6666 33.3333V17.3333H13.3333V13.3333H19.3333L20.6666 12H25.9999L27.3333 13.3333H33.3333V17.3333H31.9999V33.3333ZM15.9999 17.3333V33.3333C15.9999 34.0406 16.2809 34.7189 16.781 35.219C17.2811 35.719 17.9593 36 18.6666 36H27.9999C28.7072 36 29.3854 35.719 29.8855 35.219C30.3856 34.7189 30.6666 34.0406 30.6666 33.3333V17.3333H15.9999ZM31.9999 16V14.6667H26.6666L25.3333 13.3333H21.3333L19.9999 14.6667H14.6666V16H31.9999ZM18.6666 20H19.9999V33.3333H18.6666V20ZM26.6666 20H27.9999V33.3333H26.6666V20Z" fill="#6D17E1" />
                                                </svg>
                                            </button>
                                        )}
                                        <p>Max file size is 1MB. Minimum dimension: 330x300 And Suitable files are .jpg & .png</p>
                                    </div>
                                </div>
                                <div className="form_fields">
                                    <div className="form_fielset">
                                        <div className="form_field">
                                            <label htmlFor="firstName">First Name<span>*</span></label>
                                            <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter Your Name" required />
                                        </div>
                                        <div className="form_field">
                                            <label htmlFor="lastName">Last Name<span>*</span></label>
                                            <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter Your Last Name" required />
                                        </div>
                                    </div>
                                    <div className="form_fielset">
                                        <div className="form_field">
                                            <label htmlFor="email">Email Address<span>*</span></label>
                                            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter Your Email" required />
                                        </div>
                                        <div className="form_field">
                                            <label htmlFor="phone">Phone Number<span>*</span></label>
                                            <input type='tel' id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Your Number" required />
                                        </div>
                                    </div>
                                    <div className="form_fielset">
                                        <div className="form_field">
                                            <label htmlFor="currentPosition">Current Position</label>
                                            <input id="currentPosition" name="currentPosition" value={formData.currentPosition} onChange={handleChange} placeholder="Front-End Developer" />
                                        </div>
                                        <div className="form_field">
                                            <label htmlFor="qualification">Qualification</label>
                                            <div className="form_select_field">
                                                <select id="qualification" name="qualification" value={formData.qualification} onChange={handleChange}>
                                                    <option value="">Choose An Option</option>
                                                    <option value="High School">High School</option>
                                                    <option value="Diploma">Diploma</option>
                                                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                                                    <option value="Master's Degree">Master's Degree</option>
                                                    <option value="PhD">PhD</option>
                                                    <option value="Professional Certification">Professional Certification</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form_full">
                                        <div className="form_field">
                                            <label htmlFor="description">Description</label>
                                            <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Tell about yourself..." />
                                        </div>
                                    </div>
                                    <div className="form_fielset">
                                        <div className="form_field">
                                            <label htmlFor="dateOfBirth">Date of Birth</label>
                                            <input type="date" id="dateOfBirth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} placeholder="MM/DD/YYYY" />
                                        </div>
                                        <div className="form_field">
                                            <label htmlFor="gender">Gender</label>
                                            <div className="form_select_field">
                                                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                                                    <option value="">Choose An Option</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form_fielset">
                                        <div className="form_field">
                                            <label htmlFor="currentSalary">Current Salary</label>
                                            <div className="form_select_field">
                                                <select id="currentSalary" name="currentSalary" value={formData.currentSalary} onChange={handleChange}>
                                                    <option value="">Choose An Option</option>
                                                    <option value="Below ₹3 LPA">Below ₹3 LPA</option>
                                                    <option value="₹3-6 LPA">₹3-6 LPA</option>
                                                    <option value="₹6-10 LPA">₹6-10 LPA</option>
                                                    <option value="₹10-15 LPA">₹10-15 LPA</option>
                                                    <option value="₹15-25 LPA">₹15-25 LPA</option>
                                                    <option value="₹25+ LPA">₹25+ LPA</option>
                                                </select>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                            </div>
                                        </div>
                                        <div className="form_field">
                                            <label htmlFor="expectedSalary">Expected Salary</label>
                                            <div className="form_select_field">
                                                <select id="expectedSalary" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange}>
                                                    <option value="">Choose An Option</option>
                                                    <option value="Below ₹3 LPA">Below ₹3 LPA</option>
                                                    <option value="₹3-6 LPA">₹3-6 LPA</option>
                                                    <option value="₹6-10 LPA">₹6-10 LPA</option>
                                                    <option value="₹10-15 LPA">₹10-15 LPA</option>
                                                    <option value="₹15-25 LPA">₹15-25 LPA</option>
                                                    <option value="₹25+ LPA">₹25+ LPA</option>
                                                </select>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="submit" className="submit-btn" disabled={submitting.basic}>
                                        {submitting.basic ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        </form>
                        <form onSubmit={handleAddressSubmit}>
                            <div className="form_card">
                                <h3>Address</h3>
                                <div className="form_fields">
                                    <div className="form_fielset">
                                        <div className="form_field">
                                            <label htmlFor="country">Country<span>*</span></label>
                                            <input id="country" name="country" value={formData.country} onChange={handleChange} placeholder="Enter Country" required />
                                        </div>
                                        <div className="form_field">
                                            <label htmlFor="city">City<span>*</span></label>
                                            <input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Enter City" required />
                                        </div>
                                    </div>
                                    <div className="form_fielset">
                                        <div className="form_field">
                                            <label htmlFor="zipCode">Zip Code<span>*</span></label>
                                            <input id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="Enter Zip Code" required />
                                        </div>
                                        <div className="form_field">
                                            <label htmlFor="state">State<span>*</span></label>
                                            <input id="state" name="state" value={formData.state} onChange={handleChange} placeholder="Enter State" required />
                                        </div>
                                    </div>
                                    <button type="submit" className="submit-btn" disabled={submitting.address}>
                                        {submitting.address ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="edit_candidate_social">
                        <form onSubmit={handleSocialSubmit}>
                            <div className="form_card">
                                <h3>Social Network</h3>
                                <div className="form_fields">
                                    <div className="form_full">
                                        <div className="form_field">
                                            <label htmlFor="linkedin">LinkedIn</label>
                                            <input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://www.linkedin.com/" />
                                        </div>
                                        <div className="form_field">
                                            <label htmlFor="github">GitHub</label>
                                            <input id="github" name="github" value={formData.github} onChange={handleChange} placeholder="https://www.github.com/" />
                                        </div>
                                    </div>
                                    <button type="submit" className="submit-btn" disabled={submitting.social}>
                                        {submitting.social ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EditCandidateProfile;