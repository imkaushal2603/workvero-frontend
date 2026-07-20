import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loader from "../components/Loader";

function EditCompanyProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isNew, setIsNew] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalImage, setModalImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fileObjects, setFileObjects] = useState({
        logo: null,
        panDocument: null,
        incorporationCertificate: null,
        govIdProof: null
    });
    const logoInputRef = useRef(null);
    const panInputRef = useRef(null);
    const incorporationInputRef = useRef(null);
    const govIdInputRef = useRef(null);

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
        instagram: '',
        panDocument: '',
        incorporationCertificate: '',
        govIdProof: '',
        gstDocument: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const preloaded = location.state?.profile;
                if (preloaded) {
                    setFormData(prev => ({
                        ...prev,
                        companyName: preloaded.companyName || '',
                        website: preloaded.website || '',
                        description: preloaded.description || '',
                        logo: preloaded.logo || '',
                        email: preloaded.email || '',
                        phone: preloaded.phone || '',
                        industry: preloaded.industry || '',
                        companySize: preloaded.companySize || '',
                        city: preloaded.city || '',
                        address: preloaded.address || '',
                        facebook: preloaded.facebook || '',
                        twitter: preloaded.twitter || '',
                        linkedin: preloaded.linkedin || '',
                        instagram: preloaded.instagram || '',
                        panDocument: preloaded.panDocument || '',
                        incorporationCertificate: preloaded.incorporationCertificate || '',
                        govIdProof: preloaded.govIdProof || '',
                        gstDocument: preloaded.gstDocument || ''
                    }));
                    setIsNew(false);
                    return;
                }
                const [res] = await Promise.all([
                    api.get('/company/me'),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);
                if (res.data.company) {
                    const co = res.data.company;
                    setFormData({
                        companyName: co.companyName || '',
                        website: co.website || '',
                        description: co.description || '',
                        logo: co.logo || '',
                        email: co.email || '',
                        phone: co.phone || '',
                        industry: co.industry || '',
                        companySize: co.companySize || '',
                        city: co.city || '',
                        address: co.address || '',
                        facebook: co.facebook || '',
                        twitter: co.twitter || '',
                        linkedin: co.linkedin || '',
                        instagram: co.instagram || '',
                        panDocument: co.panDocument || '',
                        incorporationCertificate: co.incorporationCertificate || '',
                        govIdProof: co.govIdProof || '',
                        gstDocument: co.gstDocument || ''
                    });
                } else {
                    setIsNew(true);
                }
            } catch {
                setIsNew(true);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDocUpload = (field, ref) => (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 1024 * 1024) {
            toast.error('File size exceeds the 1MB limit.');
            if (ref?.current) ref.current.value = '';
            return;
        }
        const isPdfFile = file.type === 'application/pdf';
        const isImageFile = file.type.startsWith('image/');
        if (!isPdfFile && !isImageFile) {
            toast.error('Only PDF or image files are allowed.');
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
        if (ref?.current) {
            ref.current.value = '';
        }
    };

    const API_BASE = import.meta.env.VITE_API_URL.replace('/api', '');

    const getFileUrl = (file) => {
        if (!file) return '';
        if (file.startsWith('data:')) return file;
        if (file.startsWith('http')) return file;
        return `${API_BASE}${file}`;
    };

    const isPdf = (file) => {
        if (!file) return false;
        if (file.startsWith('data:application/pdf')) return true;
        return file.toLowerCase().endsWith('.pdf');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const data = new FormData();
            const fileFields = ['logo', 'panDocument', 'incorporationCertificate', 'govIdProof'];
            Object.keys(formData).forEach((key) => {
                if (!fileFields.includes(key)) {
                    data.append(key, formData[key]);
                } else {
                    if (!fileObjects[key] && formData[key]) {
                        data.append(key, formData[key]);
                    } else if (!fileObjects[key] && !formData[key]) {
                        data.append(key, '');
                    }
                }
            });
            Object.keys(fileObjects).forEach((key) => {
                if (fileObjects[key]) {
                    data.append(key, fileObjects[key]);
                }
            });
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' }
            };
            if (isNew) {
                await api.post('/company', data, config);
            } else {
                await api.put('/company', data, config);
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
        <>
            {loading && <Loader />}
            <div className={`post_job ${loading ? "loading" : ""}`} style={{ display: 'block' }}>
                <div className="post_job_details" style={{ width: '100%' }}>
                    <h2>Company Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form_card">
                            <h3>Company Information</h3>
                            <div className="form_fields logo_upload">
                                <div className="logo_upload_box">
                                    {formData.logo ? (
                                        <div
                                            className="img_preview_trigger"
                                            onClick={() => setModalImage(getFileUrl(formData.logo))}
                                            style={{ cursor: 'pointer' }}
                                            title="Click to view full image"
                                        >
                                            <img src={getFileUrl(formData.logo)} alt="Company Logo" />
                                        </div>
                                    ) : (
                                        <div
                                            style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
                                            onClick={() => logoInputRef.current.click()}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M12 0C12.1997 0.000124814 12.3969 0.0451206 12.5769 0.131663C12.7569 0.218206 12.9152 0.344084 13.04 0.5L18.3733 7.16667C18.4893 7.30249 18.5768 7.46022 18.6307 7.63052C18.6845 7.80081 18.7036 7.98018 18.6868 8.15798C18.67 8.33579 18.6176 8.50841 18.5328 8.66559C18.448 8.82277 18.3325 8.96132 18.1931 9.073C18.0537 9.18468 17.8933 9.26722 17.7214 9.31572C17.5496 9.36422 17.3697 9.37769 17.1925 9.35534C17.0153 9.33298 16.8444 9.27526 16.6899 9.18559C16.5355 9.09592 16.4006 8.97613 16.2933 8.83333L13.3333 5.13333V14.6667C13.3333 15.0203 13.1929 15.3594 12.9428 15.6095C12.6928 15.8595 12.3536 16 12 16C11.6464 16 11.3072 15.8595 11.0572 15.6095C10.8071 15.3594 10.6667 15.0203 10.6667 14.6667V5.13333L7.70667 8.83467C7.59939 8.97746 7.46453 9.09725 7.31007 9.18692C7.15561 9.27659 6.98471 9.33432 6.80752 9.35667C6.63032 9.37903 6.45044 9.36555 6.27855 9.31705C6.10666 9.26855 5.94627 9.18601 5.80689 9.07433C5.66752 8.96265 5.552 8.82411 5.46719 8.66693C5.38239 8.50974 5.33003 8.33713 5.31322 8.15932C5.29641 7.98151 5.31549 7.80214 5.36934 7.63185C5.42318 7.46156 5.51069 7.30382 5.62667 7.168L10.96 0.501333C11.0847 0.345173 11.2429 0.219041 11.4229 0.132264C11.6029 0.0454871 11.8002 0.000284802 12 0ZM8 14.6667V13.3333H2.66667C1.95942 13.3333 1.28115 13.6143 0.781048 14.1144C0.280951 14.6145 0 15.2928 0 16V21.3333C0 22.0406 0.280951 22.7189 0.781048 23.219C1.28115 23.719 1.95942 24 2.66667 24H21.3333C22.0406 24 22.7189 23.719 23.219 23.219C23.719 22.7189 24 22.0406 24 21.3333V16C24 15.2928 23.719 14.6145 23.219 14.1144C22.7189 13.6143 22.0406 13.3333 21.3333 13.3333H16V14.6667C16 15.7275 15.5786 16.7449 14.8284 17.4951C14.0783 18.2452 13.0609 18.6667 12 18.6667C10.9391 18.6667 9.92172 18.2452 9.17157 17.4951C8.42143 16.7449 8 15.7275 8 14.6667ZM18.6667 17.3333C18.313 17.3333 17.9739 17.4738 17.7239 17.7239C17.4738 17.9739 17.3333 18.313 17.3333 18.6667C17.3333 19.0203 17.4738 19.3594 17.7239 19.6095C17.9739 19.8595 18.313 20 18.6667 20H18.68C19.0336 20 19.3728 19.8595 19.6228 19.6095C19.8729 19.3594 20.0133 19.0203 20.0133 18.6667C20.0133 18.313 19.8729 17.9739 19.6228 17.7239C19.3728 17.4738 19.0336 17.3333 18.68 17.3333H18.6667Z" fill="#6D17E1" />
                                            </svg>
                                            <span>Upload Logo</span>
                                        </div>
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
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                                            <button
                                                type="button"
                                                className="logo_upload_box_reclick"
                                                onClick={() => logoInputRef.current.click()}
                                                style={{ padding: '6px 12px', background: '#F0F4FF', color: '#6D17E1', border: '1px solid #E2EAFF', borderRadius: '6px', fontSize: '13px', fontWeight: '500', cursor: 'pointer' }}
                                            >
                                                Change Logo
                                            </button>
                                        </div>
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
                                        <label htmlFor="industry">Industry<span>*</span></label>
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
                                        <label htmlFor="companySize">Company Size<span>*</span></label>
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
                                        <label htmlFor="city">City<span>*</span></label>
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
                        <div className='form_card'>
                            <h3>KYC Documents</h3>
                            <div className='form_fields form_fields_kyc'>
                                <div className='form_fielset'>
                                    <div className='form_field'>
                                        <label htmlFor="panDocument">TAN OR PAN<span>*</span></label>
                                        <div className='doc_upload_box'>
                                            {formData.panDocument ? (
                                                <div className='doc_preview'>
                                                    {isPdf(formData.panDocument) ? (
                                                        <a
                                                            href={getFileUrl(formData.panDocument)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="pdf_link"
                                                        >
                                                            <span>View PDF</span>
                                                        </a>
                                                    ) : (
                                                        <div
                                                            className="img_preview_trigger"
                                                            onClick={() => setModalImage(getFileUrl(formData.panDocument))}
                                                            style={{ cursor: 'pointer' }}
                                                            title="Click to expand view"
                                                        >
                                                            <img src={getFileUrl(formData.panDocument)} alt="PAN preview" />
                                                        </div>
                                                    )}
                                                    <button type="button" onClick={() => handleRemoveFile('panDocument', panInputRef)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#E2EAFF"></rect><path d="M31.9999 33.3333C31.9999 34.3942 31.5785 35.4116 30.8283 36.1618C30.0782 36.9119 29.0608 37.3333 27.9999 37.3333H18.6666C17.6057 37.3333 16.5883 36.9119 15.8382 36.1618C15.088 35.4116 14.6666 34.3942 14.6666 33.3333V17.3333H13.3333V13.3333H19.3333L20.6666 12H25.9999L27.3333 13.3333H33.3333V17.3333H31.9999V33.3333ZM15.9999 17.3333V33.3333C15.9999 34.0406 16.2809 34.7189 16.781 35.219C17.2811 35.719 17.9593 36 18.6666 36H27.9999C28.7072 36 29.3854 35.719 29.8855 35.219C30.3856 34.7189 30.6666 34.0406 30.6666 33.3333V17.3333H15.9999ZM31.9999 16V14.6667H26.6666L25.3333 13.3333H21.3333L19.9999 14.6667H14.6666V16H31.9999ZM18.6666 20H19.9999V33.3333H18.6666V20ZM26.6666 20H27.9999V33.3333H26.6666V20Z" fill="#6D17E1"></path></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <label htmlFor="panDocumentUpload" className='doc_upload_label'>
                                                    + Upload PAN/TAN (PDF or Image)
                                                </label>
                                            )}
                                            <input
                                                ref={panInputRef}
                                                id="panDocumentUpload"
                                                type="file"
                                                accept=".pdf,image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleDocUpload('panDocument', panInputRef)}
                                            />
                                        </div>
                                    </div>
                                    <div className='form_field'>
                                        <label htmlFor="incorporationCertificate">Incorporation Certificate<span>*</span></label>
                                        <div className='doc_upload_box'>
                                            {formData.incorporationCertificate ? (
                                                <div className='doc_preview'>
                                                    {isPdf(formData.incorporationCertificate) ? (
                                                        <a
                                                            href={getFileUrl(formData.incorporationCertificate)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="pdf_link"
                                                        >
                                                            <span>View PDF</span>
                                                        </a>
                                                    ) : (
                                                        <div
                                                            className="img_preview_trigger"
                                                            onClick={() => setModalImage(getFileUrl(formData.incorporationCertificate))}
                                                            style={{ cursor: 'pointer' }}
                                                            title="Click to expand view"
                                                        >
                                                            <img src={getFileUrl(formData.incorporationCertificate)} alt="Certificate preview" />
                                                        </div>
                                                    )}
                                                    <button type="button" onClick={() => handleRemoveFile('incorporationCertificate', incorporationInputRef)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#E2EAFF"></rect><path d="M31.9999 33.3333C31.9999 34.3942 31.5785 35.4116 30.8283 36.1618C30.0782 36.9119 29.0608 37.3333 27.9999 37.3333H18.6666C17.6057 37.3333 16.5883 36.9119 15.8382 36.1618C15.088 35.4116 14.6666 34.3942 14.6666 33.3333V17.3333H13.3333V13.3333H19.3333L20.6666 12H25.9999L27.3333 13.3333H33.3333V17.3333H31.9999V33.3333ZM15.9999 17.3333V33.3333C15.9999 34.0406 16.2809 34.7189 16.781 35.219C17.2811 35.719 17.9593 36 18.6666 36H27.9999C28.7072 36 29.3854 35.719 29.8855 35.219C30.3856 34.7189 30.6666 34.0406 30.6666 33.3333V17.3333H15.9999ZM31.9999 16V14.6667H26.6666L25.3333 13.3333H21.3333L19.9999 14.6667H14.6666V16H31.9999ZM18.6666 20H19.9999V33.3333H18.6666V20ZM26.6666 20H27.9999V33.3333H26.6666V20Z" fill="#6D17E1"></path></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <label htmlFor="incorporationUpload" className='doc_upload_label'>
                                                    + Upload Certificate (PDF or Image)
                                                </label>
                                            )}
                                            <input
                                                ref={incorporationInputRef}
                                                id="incorporationUpload"
                                                type="file"
                                                accept=".pdf,image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleDocUpload('incorporationCertificate', incorporationInputRef)}
                                            />
                                        </div>
                                    </div>
                                    <div className='form_field'>
                                        <label htmlFor="govIdProof">Government ID Proof<span>*</span></label>
                                        <div className='doc_upload_box'>
                                            {formData.govIdProof ? (
                                                <div className='doc_preview'>
                                                    {isPdf(formData.govIdProof) ? (
                                                        <a
                                                            href={getFileUrl(formData.govIdProof)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="pdf_link"
                                                        >
                                                            <span>View PDF</span>
                                                        </a>
                                                    ) : (
                                                        <div
                                                            className="img_preview_trigger"
                                                            onClick={() => setModalImage(getFileUrl(formData.govIdProof))}
                                                            style={{ cursor: 'pointer' }}
                                                            title="Click to expand view"
                                                        >
                                                            <img src={getFileUrl(formData.govIdProof)} alt="ID preview" />
                                                        </div>
                                                    )}
                                                    <button type="button" onClick={() => handleRemoveFile('govIdProof', govIdInputRef)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none"><rect width="48" height="48" rx="12" fill="#E2EAFF"></rect><path d="M31.9999 33.3333C31.9999 34.3942 31.5785 35.4116 30.8283 36.1618C30.0782 36.9119 29.0608 37.3333 27.9999 37.3333H18.6666C17.6057 37.3333 16.5883 36.9119 15.8382 36.1618C15.088 35.4116 14.6666 34.3942 14.6666 33.3333V17.3333H13.3333V13.3333H19.3333L20.6666 12H25.9999L27.3333 13.3333H33.3333V17.3333H31.9999V33.3333ZM15.9999 17.3333V33.3333C15.9999 34.0406 16.2809 34.7189 16.781 35.219C17.2811 35.719 17.9593 36 18.6666 36H27.9999C28.7072 36 29.3854 35.719 29.8855 35.219C30.3856 34.7189 30.6666 34.0406 30.6666 33.3333V17.3333H15.9999ZM31.9999 16V14.6667H26.6666L25.3333 13.3333H21.3333L19.9999 14.6667H14.6666V16H31.9999ZM18.6666 20H19.9999V33.3333H18.6666V20ZM26.6666 20H27.9999V33.3333H26.6666V20Z" fill="#6D17E1"></path></svg>
                                                    </button>
                                                </div>
                                            ) : (
                                                <label htmlFor="govIdUpload" className='doc_upload_label'>
                                                    + Upload ID Proof (PDF or Image)
                                                </label>
                                            )}
                                            <input
                                                ref={govIdInputRef}
                                                id="govIdUpload"
                                                type="file"
                                                accept=".pdf,image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleDocUpload('govIdProof', govIdInputRef)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className='form_fielset'>
                                    <div className="form_field">
                                        <label htmlFor="gstDocument">GST Number</label>
                                        <input id="gstDocument" name="gstDocument" value={formData.gstDocument} onChange={handleChange} placeholder="Enter GST Number" />
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
                {modalImage && (
                    <div className="image_modal_overlay" onClick={() => setModalImage(null)}>
                        <div className="image_modal_content" onClick={(e) => e.stopPropagation()}>
                            <button className="close_modal_btn" onClick={() => setModalImage(null)}>×</button>
                            <img src={modalImage} alt="Document Context Expanded Preview" />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default EditCompanyProfile;