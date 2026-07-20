import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

import ResumeSection from "../../components/resume-builder/ResumeSection";
import MonthSelect from "./MonthSelect";

function Experience({ setActiveSection }) {

    const emptyExperience = {
        jobTitle: "",
        companyName: "",
        employmentType: "",
        location: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        description: "",
    };

    const [experiences, setExperiences] = useState([]);

    useEffect(() => {
        fetchExperience();
    }, []);

    const fetchExperience = async () => {

        try {

            const res = await api.get(
                "/candidate/me/experience"
            );

            setExperiences(
                res.data.experience || []
            );

        } catch (error) {

            toast.error(
                "Failed to load experience."
            );

        }

    };

    const saveExperience = async (experience, index) => {

        try {

            if (experience.id) {

                await api.put(
                    `/candidate/me/experience/${experience.id}`,
                    experience
                );

            } else {

                const res = await api.post(
                    "/candidate/me/experience",
                    experience
                );

                setExperiences(prev => {

                    const data = [...prev];

                    data[index] = res.data.experience;

                    return data;

                });

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to save experience."
            );

        }

    };

    const deleteExperience = async (experience) => {

        try {

            if (experience.id) {

                await api.delete(
                    `/candidate/me/experience/${experience.id}`
                );

            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete experience."
            );

        }

    };

    return (

        <ResumeSection
            title="Experience"
            items={experiences}
            setItems={setExperiences}
            emptyItem={emptyExperience}
            renderTitle={(item) => item.jobTitle}
            renderSummary={(item) => (

                <><p className="resume_company">

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <path d="M5 21V10H19V21" stroke="currentColor" strokeWidth="2" />
                        <path d="M12 3L3 8H21L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                        <path d="M9 14V21M15 14V21" stroke="currentColor" strokeWidth="2" />
                    </svg>

                    <span>{item.companyName}</span>

                </p>

                    {item.employmentType && (

                        <p className="resume_type">

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                                <path d="M8 3V7M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>

                            <span>{item.employmentType}</span>

                        </p>

                    )}

                    <p className="resume_year">

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 3V7M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>

                        <span>

                            {item.startMonth} {item.startYear}

                            {" - "}

                            {item.endYear
                                ? `${item.endMonth} ${item.endYear}`
                                : "Present"}

                        </span>

                    </p>

                    {item.location && (

                        <p className="resume_address">

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 21C12 21 19 15 19 9.5C19 5.36 15.87 2 12 2C8.13 2 5 5.36 5 9.5C5 15 12 21 12 21Z" stroke="currentColor" strokeWidth="2" />
                                <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                            </svg>

                            <span>{item.location}</span>

                        </p>

                    )}

                    {item.description && (

                        <p className="resume_description">

                            {item.description}

                        </p>

                    )}

                </>

            )}
            renderForm={({ item, index, items, setItems }) => {

                const handleChange = (e) => {

                    const { name, value } = e.target;

                    const data = [...items];

                    data[index][name] =
                        name === "startYear" || name === "endYear"
                            ? value.replace(/\D/g, "").slice(0, 4)
                            : value;

                    setItems(data);

                };

                return (

                    <>

                        <div className="form_fields">

                            <div className="form_fielset">
                                <div className="form_field">

                                    <label>Job Title</label>

                                    <input
                                        type="text"
                                        name="jobTitle"
                                        value={item.jobTitle}
                                        onChange={handleChange}
                                        placeholder="Job Title"
                                    />

                                </div>

                                <div className="form_field">

                                    <label>Company Name</label>

                                    <input
                                        type="text"
                                        name="companyName"
                                        value={item.companyName}
                                        onChange={handleChange}
                                        placeholder="Company Name"
                                    />

                                </div>

                                <div className="form_field">

                                    <label>Employment Type</label>

                                    <div className="form_select_field">

                                        <select
                                            name="employmentType"
                                            value={item.employmentType}
                                            onChange={handleChange}
                                        >

                                            <option value="">Choose An Option</option>
                                            <option value="Full Time">Full Time</option>
                                            <option value="Part Time">Part Time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                            <option value="Freelance">Freelance</option>
                                            <option value="Temporary">Temporary</option>
                                            <option value="Volunteer">Volunteer</option>

                                        </select>

                                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="8" viewBox="0 0 15 8" fill="none">
                                            <path d="M0 0L7.16883 7.16883L14.3377 0H0Z" fill="#200E63" />
                                        </svg>

                                    </div>

                                </div>

                                <div className="form_field">

                                    <label>Location</label>

                                    <input
                                        type="text"
                                        name="location"
                                        value={item.location}
                                        onChange={handleChange}
                                        placeholder="Location"
                                    />

                                </div>

                                <div className="form_field">

                                    <label>Start Month</label>

                                    <MonthSelect
                                        name="startMonth"
                                        value={item.startMonth}
                                        onChange={handleChange}
                                    />

                                </div>

                                <div className="form_field">

                                    <label>Start Year</label>

                                    <input
                                        type="text"
                                        name="startYear"
                                        value={item.startYear}
                                        onChange={handleChange}
                                        maxLength={4}
                                        placeholder="E.g. 2022"
                                    />

                                </div>

                                <div className="form_field">

                                    <label>End Month</label>

                                    <MonthSelect
                                        name="endMonth"
                                        value={item.endMonth}
                                        onChange={handleChange}
                                        placeholder="Present"
                                    />

                                </div>

                                <div className="form_field">

                                    <label>End Year</label>

                                    <input
                                        type="text"
                                        name="endYear"
                                        value={item.endYear}
                                        onChange={handleChange}
                                        maxLength={4}
                                        placeholder="Leave empty if current"
                                    />

                                </div>


                            </div>
                            <div className="form_fielset">
                                <div className="form_field full_width">

                                    <label>Description</label>

                                    <textarea
                                        name="description"
                                        value={item.description}
                                        onChange={handleChange}
                                        rows={15}
                                        placeholder="Describe your responsibilities and achievements..."
                                    />

                                </div>
                            </div>

                        </div>

                    </>

                );

            }}
            onSave={saveExperience}
            onDelete={deleteExperience}
            onBack={() => setActiveSection("education")}
            onNext={() => setActiveSection("skills")}
            addButtonText="Add Experience"

        />

    );

}

export default Experience;