import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

function Summary({ setActiveSection }) {

    const [formData, setFormData] = useState({
        name: "",
        summary: "",
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchSummary();
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const fetchSummary = async () => {
        try {
            const res = await api.get("/candidate/resume-builder");

            setFormData({
                name: res.data.resume?.resume_builder?.name || "",
                summary: res.data.resume?.resume_builder?.summary || "",
            });
        } catch (error) {
            toast.error("Failed to load resume.");
        }
    };

    const saveSummary = async () => {

        try {

            await api.put("/candidate/resume-builder", formData 
            );

            navigate("/candidate/resumes/builder/preview");

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to save summary.");
        }

    };

    return (

        <div className="edit_candidate_basic">
            <div className="form_card resume_section">

                <div className="resume_section_header">
                    <h3>Professional Summary</h3>
                </div>
                <div className="resume_section">

                    <div className="form_fields">
                        <div className="form_fielset">
                            <div className="form_field">
                                <label>Resume Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Resume Name"
                                />
                            </div>
                        </div>
                        <div className="form_fielset">
                            <div className="form_field full_width">

                                <label> Summary</label>
                                <textarea
                                    rows={8}
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleChange}
                                    placeholder="Write your professional summary..."
                                />

                            </div>

                        </div>

                    </div>
                    <div className="resume_footer form_fields">
                        <button type="button" className="outline-btn" onClick={() => setActiveSection("skills")}>Back</button>
                        <button type="button" className="submit-btn" onClick={saveSummary}>Preview</button>
                    </div>

                </div>

            </div>

        </div>

    );

}

export default Summary;