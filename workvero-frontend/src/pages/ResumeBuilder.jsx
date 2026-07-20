import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";

function ResumeBuilder() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [resumeBuilderExists, setResumeBuilderExists] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [templateRes, statusRes] = await Promise.all([
                api.get("/candidate/resume-builder/templates"),
                api.get("/candidate/resume-builder/status"),
            ]);

            setTemplates(templateRes.data.templates || []);

            const status = statusRes.data;

            setResumeBuilderExists(status?.exists);

            if (status.exists && status.data.templateId) {
                setSelectedTemplate(status.data.templateId);
            }
        } catch (err) {
            console.log(err)
            toast.error("Failed to load templates.");
            
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = async () => {
        if (!selectedTemplate) {
            toast.error("Please select a template.");
            return;
        }

        try {
            if (resumeBuilderExists) {
                await api.put("/candidate/resume-builder", {
                    templateId: selectedTemplate,
                });
                navigate("/candidate/resumes");
            } else {
                await api.post("/candidate/resume-builder", {
                    templateId: selectedTemplate,
                });
                navigate("/candidate/resumes/builder/edit");
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to save template."
            );
        }
    }
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

    return (
        <>
            {loading && <Loader />}

            <div className={`resume_builder_page ${loading ? "loading" : ""}`}>

                <div className="resume_builder_container">

                    <button
                        className="resume_builder_back"
                        onClick={() => navigate("/candidate/resumes")}
                    >
                        ← Back
                    </button>

                    <div className="resume_builder_header">
                        <h2>Choose a Template</h2>
                        <p>Select a template and start building your resume.</p>
                    </div>

                    <div className="resume_templates">

                        {templates.map(template => (

                            <div
                                key={template.id}
                                className={`resume_template ${selectedTemplate === template.id ? "active" : ""}`}
                                onClick={() => setSelectedTemplate(template.id)}
                            >

                                {selectedTemplate === template.id && (
                                    <div className="resume_template_check">
                                        ✓
                                    </div>
                                )}

                                <div className="resume_template_image">

                                    <img
                                        src={getFileUrl(template.preview)}
                                        alt={template.name}
                                    />

                                </div>

                                <div className="resume_template_name">
                                    {template.name}
                                </div>

                            </div>

                        ))}

                    </div>

                    <div className="resume_builder_footer">
                        <button
                            className="resume_builder_continue"
                            disabled={!selectedTemplate}
                            onClick={handleContinue}
                        >
                            {resumeBuilderExists ? "Update" : selectedTemplate ? "Continue" : "Select a Template"}
                        </button>
                    </div>

                </div>

            </div>
        </>
    );
}

export default ResumeBuilder;