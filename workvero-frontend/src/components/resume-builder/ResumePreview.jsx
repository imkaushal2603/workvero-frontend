import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";
import Loader from "../Loader";
import { useNavigate } from "react-router-dom";
import useDownload from "../../services/API/fileDownload";
import { Eye, PencilLine, EllipsisVertical, Trash2, FileText, FileType2, FilePen } from "lucide-react";

function ResumePreview() {
    const navigate = useNavigate();

    const [previewHtml, setPreviewHtml] = useState("");
    const [loading, setLoading] = useState(true);
    const [resumeName, setResumeName] = useState("resume");
    const { downloading, download } = useDownload();

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
    const downloadResume = ({ format = "pdf" }) => {
        download({
            url: "/candidate/resume-builder/download",
            params: { format },
            fileName: `${resumeName}.${format}`,
        });
    };
    return (

        <div className="form_card resume_section">
            <header className="resume_section_header">
                <h3> Resume Preview
                    <div className="action_btn">
                        <button className="action_icon_btn dots_action_icon">
                            <EllipsisVertical />
                            <div className="dots_menu">
                                <button className="action_icon_btn edit" onClick={() => navigate("/candidate/resumes/resume-builder")}>
                                    <FilePen />
                                    Edit Template
                                </button>
                                <button className="action_icon_btn download" disabled={downloading} onClick={downloadResume}>
                                    <FileType2 /> Download as PDF
                                </button>
                                {/* <button className="action_icon_btn download">
                                    <FileText /> Download as Word (.docx)
                                </button> */}
                            </div>
                        </button>


                    </div>
                </h3>


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