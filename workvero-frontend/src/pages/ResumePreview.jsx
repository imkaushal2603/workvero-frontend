import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function ResumePreview() {
    const navigate = useNavigate();

    const [previewHtml, setPreviewHtml] = useState("");
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [resumeName, setResumeName] = useState("resume");

    useEffect(() => {
        fetchPreview();
    }, []);

    const fetchPreview = async () => {
        try {
            const res = await api.get("/candidate/resume-builder/preview");
            setPreviewHtml(res.data.html);
            setResumeName(res.data.resumeName || "resume");
        } catch (error) {
            navigate("/candidate")
            setLoading(false);
            // toast.error("Failed to load resume preview.");
        } finally {
            setLoading(false);
        }
    };
    const downloadResume = async () => {
        if (downloading) return;
        try {
            setDownloading(true);
            const res = await api.get("/candidate/resume-builder/download",
                {
                    responseType: "blob",
                }
            );

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = `${resumeName}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

        } catch (error) {
            toast.error("Failed to download resume.");
        }
        finally {
            setDownloading(false);
        }
    };
    return (

        <div className="resume_preview_page">
            <header className="resume_preview_header">
                <button className="preview_back_btn" onClick={() => navigate("/candidate/resumes")}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                    <span> Back to Resumes</span>
                </button>
                <h2> Resume Preview</h2>
                <div className="action_btn">
                    <button className="btn_secondary" onClick={() => navigate("/candidate/resumes/builder/edit")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        <span> Edit Resume</span>
                    </button>
                    <button className="btn_secondary" onClick={() => navigate("/candidate/resume-builder")}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                        </svg>
                        <span> Edit Template</span>
                    </button>
                    <button className="btn_primary" onClick={downloadResume} disabled={downloading}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <path d="M7 10l5 5 5-5" />
                            <path d="M12 15V3" />
                        </svg>
                        <span>Download PDF</span>
                    </button>

                </div>

            </header>

            <div className="resume_preview_body">
                <div className="resume_preview_card">
                    {loading ? (
                        <Loader />
                    ) : (
                        <iframe title="Resume Preview" srcDoc={previewHtml} className="resume_preview_iframe" />)}
                </div>
            </div>
        </div>

    );

}

export default ResumePreview;