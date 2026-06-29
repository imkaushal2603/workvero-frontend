import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

function EditCompanyProfile() {
    const navigate = useNavigate();
    const [isNew, setIsNew] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        companyName: '',
        website: '',
        description: '',
        logo: '',
        email: '',
        phone: '',
        industry: '',
        companySize: '',
        city: '',
        address: '',
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/company/me');
                if (res.data.company) {
                    setFormData({
                        companyName: res.data.company.companyName || '',
                        website: res.data.company.website || '',
                        description: res.data.company.description || '',
                        logo: res.data.company.logo || '',
                        email: res.data.company.email || '',
                        phone: res.data.company.phone || '',
                        industry: res.data.company.industry || '',
                        companySize: res.data.company.companySize || '',
                        city: res.data.company.city || '',
                        address: res.data.company.address || '',
                        facebook: res.data.company.facebook || '',
                        twitter: res.data.company.twitter || '',
                        linkedin: res.data.company.linkedin || '',
                        instagram: res.data.company.instagram || ''
                    });
                } else {
                    setIsNew(true);
                }
            } catch {
                setIsNew(true);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (isNew) {
                await api.post('/company', formData);
            } else {
                await api.put('/company', formData);
            }
            toast.success('Company profile saved successfully!');
            navigate('/employer/company-profile');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="post_job" style={{ display: 'block' }}>
            <div className="post_job_details" style={{ width: '100%' }}>
                <h2>Company Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form_card">
                        <h3>Company Information</h3>
                        <div className="form_fields logo_upload">
                            <div
                                className="logo_upload_box"
                                onClick={() => document.getElementById('logoUpload').click()}
                            >
                                {formData.logo ? (
                                    <img src={formData.logo} alt="logo preview" />
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 0C12.1997 0.000124814 12.3969 0.0451206 12.5769 0.131663C12.7569 0.218206 12.9152 0.344084 13.04 0.5L18.3733 7.16667C18.4893 7.30249 18.5768 7.46022 18.6307 7.63052C18.6845 7.80081 18.7036 7.98018 18.6868 8.15798C18.67 8.33579 18.6176 8.50841 18.5328 8.66559C18.448 8.82277 18.3325 8.96132 18.1931 9.073C18.0537 9.18468 17.8933 9.26722 17.7214 9.31572C17.5496 9.36422 17.3697 9.37769 17.1925 9.35534C17.0153 9.33298 16.8444 9.27526 16.6899 9.18559C16.5355 9.09592 16.4006 8.97613 16.2933 8.83333L13.3333 5.13333V14.6667C13.3333 15.0203 13.1929 15.3594 12.9428 15.6095C12.6928 15.8595 12.3536 16 12 16C11.6464 16 11.3072 15.8595 11.0572 15.6095C10.8071 15.3594 10.6667 15.0203 10.6667 14.6667V5.13333L7.70667 8.83467C7.59939 8.97746 7.46453 9.09725 7.31007 9.18692C7.15561 9.27659 6.98471 9.33432 6.80752 9.35667C6.63032 9.37903 6.45044 9.36555 6.27855 9.31705C6.10666 9.26855 5.94627 9.18601 5.80689 9.07433C5.66752 8.96265 5.552 8.82411 5.46719 8.66693C5.38239 8.50974 5.33003 8.33713 5.31322 8.15932C5.29641 7.98151 5.31549 7.80214 5.36934 7.63185C5.42318 7.46156 5.51069 7.30382 5.62667 7.168L10.96 0.501333C11.0847 0.345173 11.2429 0.219041 11.4229 0.132264C11.6029 0.0454871 11.8002 0.000284802 12 0ZM8 14.6667V13.3333H2.66667C1.95942 13.3333 1.28115 13.6143 0.781048 14.1144C0.280951 14.6145 0 15.2928 0 16V21.3333C0 22.0406 0.280951 22.7189 0.781048 23.219C1.28115 23.719 1.95942 24 2.66667 24H21.3333C22.0406 24 22.7189 23.719 23.219 23.219C23.719 22.7189 24 22.0406 24 21.3333V16C24 15.2928 23.719 14.6145 23.219 14.1144C22.7189 13.6143 22.0406 13.3333 21.3333 13.3333H16V14.6667C16 15.7275 15.5786 16.7449 14.8284 17.4951C14.0783 18.2452 13.0609 18.6667 12 18.6667C10.9391 18.6667 9.92172 18.2452 9.17157 17.4951C8.42143 16.7449 8 15.7275 8 14.6667ZM18.6667 17.3333C18.313 17.3333 17.9739 17.4738 17.7239 17.7239C17.4738 17.9739 17.3333 18.313 17.3333 18.6667C17.3333 19.0203 17.4738 19.3594 17.7239 19.6095C17.9739 19.8595 18.313 20 18.6667 20H18.68C19.0336 20 19.3728 19.8595 19.6228 19.6095C19.8729 19.3594 20.0133 19.0203 20.0133 18.6667C20.0133 18.313 19.8729 17.9739 19.6228 17.7239C19.3728 17.4738 19.0336 17.3333 18.68 17.3333H18.6667Z" fill="#6D17E1" />
                                        </svg>
                                        <span>Upload Logo</span>
                                    </>
                                )}
                                <input
                                    id="logoUpload"
                                    type="file"
                                    accept=".jpg,.png"
                                    style={{ display: 'none' }}
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => {
                                                setFormData({ ...formData, logo: reader.result });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                            </div>
                            <div className="logo_upload_info">
                                {formData.logo && (
                                    <button
                                        type="button"
                                        className="logo_delete_btn"
                                        onClick={() => {
                                            setFormData({ ...formData, logo: '' });
                                            document.getElementById('logoUpload').value = '';
                                        }}
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
                                    <label htmlFor="companyName">Company Name<span>*</span></label>
                                    <input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Enter Company Name" required />
                                </div>
                                <div className="form_field">
                                    <label htmlFor="email">Email<span>*</span></label>
                                    <input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Your Email" required />
                                </div>
                            </div>
                            <div className="form_fielset">
                                <div className="form_field">
                                    <label htmlFor="phone">Phone Number<span>*</span></label>
                                    <input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Your Phone Number" />
                                </div>
                                <div className="form_field">
                                    <label htmlFor="website">Website<span>*</span></label>
                                    <input id="website" name="website" value={formData.website} onChange={handleChange} placeholder="Enter Company Website" />
                                </div>
                            </div>
                            <div className="form_fielset">
                                <div className="form_field">
                                    <label htmlFor="phone">Industry<span>*</span></label>
                                    <div className='form_select_field'>
                                        <select id="industry" name="industry" value={formData.industry} onChange={handleChange}>
                                            <option value="">Select Industry</option>
                                            <option value="Information Technology">Information Technology</option>
                                            <option value="Software Development">Software Development</option>
                                            <option value="Finance & Banking">Finance & Banking</option>
                                            <option value="Healthcare">Healthcare</option>
                                            <option value="Education">Education</option>
                                            <option value="Manufacturing">Manufacturing</option>
                                            <option value="Retail & E-commerce">Retail & E-commerce</option>
                                            <option value="Marketing & Advertising">Marketing & Advertising</option>
                                            <option value="Real Estate">Real Estate</option>
                                            <option value="Construction">Construction</option>
                                            <option value="Transportation & Logistics">Transportation & Logistics</option>
                                            <option value="Media & Entertainment">Media & Entertainment</option>
                                            <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                                            <option value="Legal">Legal</option>
                                            <option value="Consulting">Consulting</option>
                                            <option value="Telecommunications">Telecommunications</option>
                                            <option value="Energy & Utilities">Energy & Utilities</option>
                                            <option value="Government & Public Sector">Government & Public Sector</option>
                                            <option value="Non-Profit">Non-Profit</option>
                                            <option value="Other">Other</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                    </div>
                                </div>
                                <div className="form_field">
                                    <label htmlFor="website">Company Size<span>*</span></label>
                                    <div className='form_select_field'>
                                        <select id="companySize" name="companySize" value={formData.companySize} onChange={handleChange}>
                                            <option value="">Select Company Size</option>
                                            <option value="1-10">1-10</option>
                                            <option value="11-50">11-50</option>
                                            <option value="51-200">51-200</option>
                                            <option value="201-500">201-500</option>
                                            <option value="501+">501+</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div className="form_fielset">
                                <div className="form_field">
                                    <label htmlFor="phone">City<span>*</span></label>
                                    <input id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Enter City" required />
                                </div>
                                <div className="form_field">
                                    <label htmlFor="address">Address<span>*</span></label>
                                    <input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Enter Address" required />
                                </div>
                            </div>
                            <div className="form_full">
                                <div className="form_field">
                                    <label htmlFor="description">About Company</label>
                                    <textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Enter Company Description" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form_card">
                        <h3>Social Network</h3>
                        <div className="form_fields">
                            <div className="form_fielset">
                                <div className="form_field">
                                    <label htmlFor="facebook">Facebook</label>
                                    <input id="facebook" name="facebook" value={formData.facebook} onChange={handleChange} placeholder="https://www.facebook.com" />
                                </div>
                                <div className="form_field">
                                    <label htmlFor="twitter">Twitter</label>
                                    <input id="twitter" name="twitter" value={formData.twitter} onChange={handleChange} placeholder="https://www.twitter.com" />
                                </div>
                            </div>
                            <div className="form_fielset">
                                <div className="form_field">
                                    <label htmlFor="linkedin">LinkedIn</label>
                                    <input id="linkedin" name="linkedin" value={formData.linkedin} onChange={handleChange} placeholder="https://www.linkedin.com/" />
                                </div>
                                <div className="form_field">
                                    <label htmlFor="instagram">Instagram</label>
                                    <input id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} placeholder="https://www.instagram.com" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form_buttons">
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save & Publish'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={() => navigate('/employer/company-profile')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditCompanyProfile;