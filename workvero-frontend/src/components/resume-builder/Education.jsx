import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

import ResumeSection from "../../components/resume-builder/ResumeSection";

function Education({ setActiveSection }) {

    const emptyEducation = {
        courseDegree: "",
        instituteName: "",
        educationLevel: "",
        startYear: "",
        passingYear: "",
        currentlyStudying: false,
        grade: "",
        address: "",
    };

    const [educations, setEducations] = useState([]);

    useEffect(() => {
        fetchEducation();
    }, []);

    const fetchEducation = async () => {

        try {

            const res = await api.get(
                "/candidate/me/education"
            );

            setEducations(
                res.data.education || []
            );

        } catch (error) {

            toast.error(
                "Failed to load education."
            );

        }

    };

    const saveEducation = async (education, index) => {
        try {
            if (education.id) {
                console.log("Updating education:", education);
                await api.put(`/candidate/me/education/${education.id}`, education);
            } else {
                const res = await api.post("/candidate/me/education", education);

                setEducations(prev => {
                    const data = [...prev];
                    data[index] = res.data.education;
                    return data;
                });
            }

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save education.");

        }

    };

    const deleteEducation = async (education) => {

        try {
            if (education.id) {
                await api.delete(`/candidate/me/education/${education.id}`);
            }

        } catch (error) {

            toast.error(error.response?.data?.message || "Failed to delete education.");

        }

    };


    return (

        <ResumeSection
            title="Education"
            items={educations}
            setItems={setEducations}
            emptyItem={emptyEducation}
            renderTitle={(item) => item.courseDegree}
            renderSummary={(item) => (

                <>

                    <p className="resume_institute">

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M5 21V10H19V21" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 3L3 8H21L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                            <path d="M9 14V21M15 14V21" stroke="currentColor" strokeWidth="2" />
                        </svg>

                        <span>{item.instituteName}</span>

                    </p>

                    <p className="resume_level">

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M22 9L12 4L2 9L12 14L22 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M6 11V15C6 16.5 8.5 18 12 18C15.5 18 18 16.5 18 15V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                        <span>{item.educationLevel}</span>

                    </p>

                    <p className="resume_year">

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                            <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                            <path d="M8 3V7M16 3V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>

                        <span>

                            {item.startYear}

                            {" - "}

                            {item.currentlyStudying
                                ? "Present"
                                : item.passingYear}

                        </span>

                    </p>

                    {item.grade && (

                        <p className="resume_grade">

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="8" r="5" stroke="currentColor" strokeWidth="2" />
                                <path d="M9 13L8 21L12 19L16 21L15 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>

                            <span>{item.grade}</span>

                        </p>

                    )}

                    {item.address && (

                        <p className="resume_address">

                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M12 21C12 21 19 15 19 9.5C19 5.36 15.87 2 12 2C8.13 2 5 5.36 5 9.5C5 15 12 21 12 21Z" stroke="currentColor" strokeWidth="2" />
                                <circle cx="12" cy="9.5" r="2.5" stroke="currentColor" strokeWidth="2" />
                            </svg>

                            <span>{item.address}</span>

                        </p>

                    )}

                </>

            )}
            renderForm={({ item, index, items, setItems }) => {
                const handleChange = (e) => {
                    const { name, value, type, checked } = e.target;
                    const data = [...items];
                    if (type === "checkbox") {
                        data[index][name] = checked;
                        if (checked) {
                            data[index].passingYear = "";
                        }
                    } else {
                        data[index][name] =
                            name === "startYear" || name === "passingYear"
                                ? value.replace(/\D/g, "").slice(0, 4)
                                : value;
                    }
                    setItems(data);

                };
                return (
                    <>
                        <div className="form_fields">
                            <div className="form_fielset">
                                <div className="form_field">
                                    <label>Course / Degree</label>
                                    <input
                                        type="text"
                                        name="courseDegree"
                                        value={item.courseDegree}
                                        onChange={handleChange}
                                        placeholder="Course / Degree"
                                    />
                                </div>

                                <div className="form_field">
                                    <label>Institute</label>
                                    <input
                                        type="text"
                                        name="instituteName"
                                        value={item.instituteName}
                                        onChange={handleChange}
                                        placeholder="Institute"
                                    />
                                </div>


                                <div className="form_field">
                                    <label>Education Level</label>
                                    <div className="form_select_field">
                                        <select name="educationLevel" value={item.educationLevel} onChange={handleChange}>
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

                                <div className="form_field">
                                    <label>Start Year</label>
                                    <input
                                        type="text"
                                        name="startYear"
                                        value={item.startYear}
                                        onChange={handleChange}
                                        maxLength={4}
                                        placeholder="E.g. 2018"
                                    />
                                </div>

                                <div className="form_field">
                                    <label>Passing Year</label>
                                    <input
                                        type="text"
                                        name="passingYear"
                                        value={item.passingYear}
                                        onChange={handleChange}
                                        maxLength={4}
                                        placeholder="E.g. 2022"
                                        disabled={item.currentlyStudying}
                                    />
                                </div>
                                <div className="form_field checkbox_field">

                                    <label>
                                        Currently Studying

                                    </label>
                                    <input
                                        type="checkbox"
                                        name="currentlyStudying"
                                        checked={item.currentlyStudying}
                                        onChange={handleChange}
                                    />

                                </div>
                                <div className="form_field">

                                    <label>Grade / CGPA / Percentage</label>

                                    <input
                                        type="text"
                                        name="grade"
                                        value={item.grade}
                                        onChange={handleChange}
                                        placeholder="E.g. 8.5 CGPA"
                                    />

                                </div>
                                <div className="form_field">

                                    <label>Institute Address</label>

                                    <input
                                        type="text"
                                        name="address"
                                        value={item.address}
                                        onChange={handleChange}
                                        placeholder="Institute Address"
                                    />

                                </div>
                            </div>
                        </div>
                    </>
                );
            }}
            onSave={saveEducation}
            onDelete={deleteEducation}
            onBack={() => setActiveSection("basic")}
            onNext={() => setActiveSection("experience")}
            addButtonText="Add Education"

        />

    );

}

export default Education;