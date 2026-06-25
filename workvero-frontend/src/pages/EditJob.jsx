import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function EditJob() {
    const navigate = useNavigate();
    const [companyProfile, setCompanyProfile] = useState(null);
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
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
        skills: [],
        status: 'ACTIVE'
    });

    const [skillInput, setSkillInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await api.get(`/job/${id}`);
                const job = response.data.data;
                setFormData({
                    title: job.title || '',
                    location: job.location || '',
                    jobType: job.jobType || '',
                    workMode: job.workMode || '',
                    experience: job.experience || '',
                    salary: job.salary || '',
                    openings: job.openings || '',
                    deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
                    description: job.description || '',
                    skills: job.skills ? JSON.parse(job.skills) : [],
                    status: job.status || 'ACTIVE'
                });
            } catch (err) {
                alert('Failed to load job');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
        navigate('/employer/manage-jobs');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = {
            ...formData,
            skills: JSON.stringify(formData.skills)
        };

        try {
            const response = await api.put(`/job/update/${id}`, payload);
            if (response.status === 200) {
                alert("Job updated successfully!");
                navigate('/employer/manage-jobs');
            }
        } catch (error) {
            console.error("Update failed:", error);
            setIsSubmitting(false);
            alert(error.response?.data?.message || "Something went wrong.");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className='post_job'>
            <div className='post_job_details'>
                <h2>Edit Job</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form_card">
                        <h3>Basic Information</h3>
                        <div className='form_fields'>
                            <div className='form_fielset'>
                                <div className='form_field'>
                                    <label htmlFor="title">Job Title<span>*</span></label>
                                    <input type='text' id="title" name="title" required placeholder="e.g. Senior Frontend Developer" value={formData.title} onChange={handleChange} />
                                </div>
                                <div className='form_field'>
                                    <label htmlFor="location">Job Location<span>*</span></label>
                                    <input type='text' id="location" name="location" required placeholder="e.g. Mohali, Punjab" value={formData.location} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='form_fielset'>
                                <div className='form_field'>
                                    <label htmlFor="jobType">Job Type<span>*</span></label>
                                    <div className='form_select_field'>
                                        <select id="jobType" name="jobType" required value={formData.jobType} onChange={handleChange}>
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
                                        <select id="workMode" name="workMode" required value={formData.workMode} onChange={handleChange}>
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
                                        <select id="experience" name="experience" required value={formData.experience} onChange={handleChange}>
                                            <option value="">Select Experience</option>
                                            <option value="Entry Level">Entry Level</option>
                                            <option value="Mid Level">Mid Level</option>
                                            <option value="Senior">Senior</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none"><path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63"></path></svg>
                                    </div>
                                </div>
                                <div className='form_field'>
                                    <label htmlFor="salary">Salary Range<span>*</span></label>
                                    <input type="text" id="salary" name="salary" required placeholder="e.g. $4k - $6k" value={formData.salary} onChange={handleChange} />
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
                                    <input id="openings" name="openings" type="number" placeholder="e.g. 2" value={formData.openings} onChange={handleChange} />
                                </div>
                                <div className='form_field'>
                                    <label htmlFor='deadline'>Application Deadline</label>
                                    <input id="deadline" name="deadline" type="date" value={formData.deadline} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='form_fielset'>
                                <div className='form_field'>
                                    <label htmlFor="status">Status</label>
                                    <div className='form_select_field'>
                                        <select
                                            value={formData.status}
                                            id="status"
                                            name="status"
                                            onChange={handleChange}
                                        >
                                            <option value="ACTIVE">Active</option>
                                            <option value="CLOSED">Closed</option>
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
                            <div className='form_full'>
                                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)} />
                                <button type="button" onClick={handleAddSkill}>+ Add Skills</button>
                            </div>
                            <div className='form_full'>
                                <label htmlFor='description'>Job Description</label>
                                <textarea name="description" id="description" placeholder="Job Description" value={formData.description} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                    <div className='form_buttons'>
                        <button type="submit" className='submit-btn' disabled={isSubmitting}>
                            {isSubmitting ? "Updating..." : "Update & Publish"}
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

export default EditJob;