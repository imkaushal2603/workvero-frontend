import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

function PostJob() {
    const navigate = useNavigate();
    const [companyProfile, setCompanyProfile] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        jobType: '',
        workMode: '',
        experience: '',
        salary: '',
        openings: '',
        deadline: '',
        description: '',
        sponsorshipType: 'Free',
        skills: []
    });

    const [skillInput, setSkillInput] = useState('');
    const [logoFile, setLogoFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [jobCount, setJobCount] = useState(null);
    const [loadingCount, setLoadingCount] = useState(true);

    useEffect(() => {
        const fetchJobCount = async () => {
            try {
                const res = await api.get('/job/my-jobs', { params: { limit: 100 } });
                const count = res.data.data.total;
                setJobCount(count);
            } catch (err) {
                console.error('Failed to fetch job count');
            } finally {
                setLoadingCount(false);
            }
        };
        fetchJobCount();
    }, []);

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
        if (jobCount === null || jobCount < 2) return;

        toast.error("You've reached the 2 job limit. Upgrade your plan in the billing to post more jobs.", { duration: 4000 });

        const timer = setTimeout(() => {
            navigate('/employer/billing');
        }, 3000);

        return () => clearInterval(timer);
    }, [jobCount, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setLogoFile(e.target.files[0]);
    };

    const handleAddSkill = () => {
        if (skillInput && !formData.skills.includes(skillInput)) {
            setFormData({ ...formData, skills: [...formData.skills, skillInput] });
            setSkillInput('');
        }
    };

    const handleDeleteSkill = (skillToDelete) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter(skill => skill !== skillToDelete)
        });
    };

    const handleCancel = () => {
        navigate('/employer/dashboard');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.sponsorshipType === 'Sponsored') {
            toast.error("Redirecting to Premium Billing setup to activate your Sponsored Plan...");
            setTimeout(() => navigate('/employer/billing'), 2000);
            return;
        }

        if (jobCount >= 2) {
            toast.error("You've reached the 2 job limit. Upgrade your plan to post more jobs.");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            ...formData,
            skills: JSON.stringify(formData.skills)
        };

        try {
            const response = await api.post('/job/create', payload);

            if (response.status === 201) {
                toast.success("Job posted successfully!");
                navigate('/employer/dashboard');
            }
        } catch (error) {
            console.error("Submission failed:", error);
            setIsSubmitting(false);
            toast.error(error.response?.data?.message || "Something went wrong.");
        }
    };

    if (loadingCount) return <div>Loading...</div>;

    return (
        <div className='post_job'>
            <div className='post_job_details'>
                <h2>Post Job</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form_card">
                        <h3>Basic Information</h3>
                        <div className='form_fields'>
                            <div className='form_fielset'>
                                <div className='form_field'>
                                    <label htmlFor="title">Job Title<span>*</span></label>
                                    <input type='text' id="title" name="title" required placeholder="e.g. Senior Frontend Developer" onChange={handleChange} />
                                </div>
                                <div className='form_field'>
                                    <label htmlFor="location">Job Location<span>*</span></label>
                                    <input type='text' id="location" name="location" required placeholder="e.g. Mohali, Punjab" onChange={handleChange} />
                                </div>
                            </div>
                            <div className='form_fielset'>
                                <div className='form_field'>
                                    <label htmlFor="jobType">Job Type<span>*</span></label>
                                    <div className='form_select_field'>
                                        <select id="jobType" name="jobType" required onChange={handleChange}>
                                            <option value="">Select Job Type</option>
                                            <option value="Full Time">Full Time</option>
                                            <option value="Part Time">Part Time</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                    </div>
                                </div>
                                <div className='form_field'>
                                    <label htmlFor="workMode">Work Mode<span>*</span></label>
                                    <div className='form_select_field'>
                                        <select id="workMode" name="workMode" required onChange={handleChange}>
                                            <option value="">Select Work Mode</option>
                                            <option value="Remote">Remote</option>
                                            <option value="On-site">On-site</option>
                                            <option value="Hybrid">Hybrid</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                    </div>
                                </div>
                            </div>
                            <div className='form_fielset'>
                                <div className='form_field'>
                                    <label htmlFor="experience">Experience Level<span>*</span></label>
                                    <div className='form_select_field'>
                                        <select id="experience" name="experience" required onChange={handleChange}>
                                            <option>Select Experience</option>
                                            <option>Entry Level</option>
                                            <option>Mid Level</option>
                                            <option>Senior</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                    </div>
                                </div>
                                <div className='form_field'>
                                    <label htmlFor="salary">Salary Range<span>*</span></label>
                                    <input
                                        type="text"
                                        id="salary"
                                        name="salary"
                                        required
                                        placeholder="e.g. $4k - $6k"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form_card">
                        <h3>Additional Information</h3>
                        <div className='form_fields'>
                            <div className='form_fielset'>
                                <div className='form_field'>
                                    <label htmlFor='openings'>Number of Openings</label>
                                    <input id="openings" name="openings" type="number" placeholder="e.g. 2" onChange={handleChange} />
                                </div>
                                <div className='form_field'>
                                    <label htmlFor='deadline'>Application Deadline</label>
                                    <input id="deadline" name="deadline" type="date" onChange={handleChange} />
                                </div>
                            </div>
                            <div className='form_fielset'>
                                <div className='form_field'>
                                    <label htmlFor='openings'>Sponsorship Type<span>*</span></label>
                                    <div className='form_select_field'>
                                        <select
                                            id="sponsorshipType"
                                            name="sponsorshipType"
                                            value={formData.sponsorshipType}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="Free">Free</option>
                                            <option value="Sponsored">Sponsored</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="form_card">
                        <h3>Skills</h3>
                        <div className='form_fields'>
                            {formData.skills.length > 0 && (
                                <div className='form_skills'>{formData.skills.map((skill, index) => (
                                    <span key={index}>{skill}
                                        <button type="button" onClick={() => handleDeleteSkill(skill)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="9" height="9" viewBox="0 0 9 9" fill="none">
                                                <path d="M1 1L4.33333 4.33333M4.33333 4.33333L7.66667 7.66667M4.33333 4.33333L7.66667 1M4.33333 4.33333L1 7.66667" stroke="#0146EE" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}</div>
                            )}
                            <div className='form_full form_full_skills'>
                                <input name="skills" id="skills" placeholder="Enter Skills" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
                                <button type="button" onClick={handleAddSkill} disabled={!skillInput.trim()}>+ Add Skills</button>
                            </div>
                            <div className='form_full'>
                                <label htmlFor='description'>Job Description</label>
                                <textarea name="description" id="description" placeholder="Job Description" onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div className='form_buttons'>
                        <button type="submit" className='submit-btn' disabled={isSubmitting || jobCount >= 2}>
                            {isSubmitting ? "Posting..." : "Save & Publish"}
                        </button>
                        <button type="button" className="cancel-btn" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
            <aside>
                <div className="card">
                    <h3>Job Preview</h3>
                    <div className='job_preview_company'>
                        <div className='job_preview_logo'>
                            {companyProfile?.logo ? (
                                <img src={companyProfile.logo} alt={`${companyProfile?.companyName || ""} logo`} />
                            ) : (
                                <img style={{ border: '1px dashed #6D17E1' }} />
                            )}
                        </div>
                        <div className='job_preview_title'>
                            <h6>{companyProfile?.companyName || ""}</h6>
                            <p>{formData.title || ""}</p>
                        </div>
                    </div>
                    <div className='job_preview_details'>
                        <h6>Job Title</h6>
                        <div className='job_preview_info'>
                            <ul>
                                <li>Location: {formData.location || ""}</li>
                                <li>Job Type: {formData.jobType || ""}</li>
                                <li>Work Mode: {formData.workMode || ""}</li>
                                <li>Experience: {formData.experience || ""}</li>
                                <li>Salary Range: {formData.salary || ""}</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <h3>Skills</h3>
                    <div className='card_preview_skills'>
                        {formData.skills.length > 0 ? (
                            formData.skills.map((skill, index) => (
                                <p key={index}>{skill}</p>
                            ))
                        ) : (
                            <p>Skills preview...</p>
                        )}
                    </div>
                    <div className='card_preview_description'>
                        <h5>Description</h5>
                        <p>{formData.description || "Description preview..."}</p>
                    </div>
                </div>
            </aside>
        </div>
    );
}

export default PostJob;