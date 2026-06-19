import React, { useState } from "react";

function JobForm({ jobTitle = "Business Development" }) {
    const [formData, setFormData] = useState({
        fullName: "",
        emailAddress: "",
        phoneNumber: "",
        currentLocation: "",
        linkedinProfile: "",
        portfolioWebsite: "",
        resume: null,
        coverLetter: "",
        experienceLevel: "",
        currentSalary: "",
        expectedSalary: "",
        noticePeriod: "",
        whyHireYou: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const dataToSend = new FormData();
        dataToSend.append("jobAppliedFor", jobTitle);

        Object.keys(formData).forEach((key) => {
            dataToSend.append(key, formData[key]);
        });

        try {
            const response = await fetch("https://your-api.com/admin/applications", {
                method: "POST",
                body: dataToSend,
            });

            if (response.ok) {
                alert("Application submitted successfully to the administrator!");
            } else {
                alert("Failed to submit application. Please try again.");
            }
        } catch (error) {
            console.error("Submission Error:", error);
            alert("An error occurred while sending the data.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="job_form_container">
            <div className="content-wrapper">
                <div className="job_form_section">
                    <h2>Apply Job</h2>

                    <form onSubmit={handleSubmit} className="job_form_content">
                        <div className="form_sections">
                            <h3 className="section_title">Personal Information</h3>
                            <div className="form_grid dynamic_three_col">
                                <div className="input_group">
                                    <label>Full Name <span className="required">*</span></label>
                                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter your full name" required />
                                </div>
                                <div className="input_group">
                                    <label>Email Address <span className="required">*</span></label>
                                    <input type="email" name="emailAddress" value={formData.emailAddress} onChange={handleChange} placeholder="Enter your email address" required />
                                </div>
                                <div className="input_group">
                                    <label>Phone Number <span className="required">*</span></label>
                                    <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Enter your mobile number" required />
                                </div>
                            </div>
                            <div className="form_grid dynamic_three_col">
                                <div className="input_group">
                                    <label>Current Location <span className="required">*</span></label>
                                    <input type="text" name="currentLocation" value={formData.currentLocation} onChange={handleChange} placeholder="Enter your current city and state" required />
                                </div>
                                <div className="input_group">
                                    <label>LinkedIn Profile (Optional)</label>
                                    <input type="url" name="linkedinProfile" value={formData.linkedinProfile} onChange={handleChange} placeholder="Paste your LinkedIn profile URL" />
                                </div>
                                <div className="input_group">
                                    <label>Portfolio / Website (Optional)</label>
                                    <input type="url" name="portfolioWebsite" value={formData.portfolioWebsite} onChange={handleChange} placeholder="Share your portfolio or personal website" />
                                </div>
                            </div>
                            <div className="input_group full_width">
                                <label>Resume / CV <span className="required">*</span></label>
                                <div className="file_upload_zone">
                                    <input type="file" id="resume_upload" name="resume" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
                                    <label htmlFor="resume_upload" className="upload_label">
                                        <span className="upload_icon">📤</span>
                                        <span>{formData.resume ? formData.resume.name : "Upload Your Resume"}</span>
                                    </label>
                                </div>
                                <small className="hint_text">Upload your updated resume in PDF, DOC, or DOCX format.</small>
                            </div>
                            <div className="input_group full_width">
                                <label>Cover Letter (Optional)</label>
                                <textarea name="coverLetter" value={formData.coverLetter} onChange={handleChange} placeholder="Write a short cover letter..." rows="4"></textarea>
                            </div>
                        </div>
                        <div className="form_sections">
                            <h3 className="section_title">Additional Information</h3>
                            <div className="form_grid dynamic_three_col">
                                <div className="input_group">
                                    <label>Experience Level</label>
                                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange}>
                                        <option value="">Select your experience level</option>
                                        <option value="entry">Entry Level / Freshers</option>
                                        <option value="mid">Mid Level</option>
                                        <option value="senior">Senior Level</option>
                                    </select>
                                </div>
                                <div className="input_group">
                                    <label>Current Salary (Optional)</label>
                                    <input type="text" name="currentSalary" value={formData.currentSalary} onChange={handleChange} placeholder="Enter your current salary" />
                                </div>
                                <div className="input_group">
                                    <label>Expected Salary</label>
                                    <input type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} placeholder="Enter your expected salary" />
                                </div>
                            </div>
                            <div className="input_group full_width">
                                <label>Notice Period</label>
                                <select name="noticePeriod" value={formData.noticePeriod} onChange={handleChange}>
                                    <option value="">Select your notice period</option>
                                    <option value="immediate">Immediate</option>
                                    <option value="15_days">15 Days</option>
                                    <option value="1_month">1 Month</option>
                                    <option value="2_months">2 Months</option>
                                </select>
                            </div>
                            <div className="input_group full_width">
                                <label>Why Should We Hire You? (Optional)</label>
                                <textarea name="whyHireYou" value={formData.whyHireYou} onChange={handleChange} placeholder="Tell us about your skills..." rows="4"></textarea>
                            </div>
                        </div>
                        <div className="form_actions">
                            <button type="submit" disabled={isSubmitting} className="submit_btn">
                                {isSubmitting ? "Submitting..." : "Submit Application"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default JobForm;