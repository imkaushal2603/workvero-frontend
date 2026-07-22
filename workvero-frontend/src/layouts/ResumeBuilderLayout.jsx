import { GraduationCap, BriefcaseBusiness, LibraryBig, Lightbulb, Summary, PanelsTopLeft, ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";
function ResumeBuilderSidebar({ activeSection, setActiveSection, }) {
    const navigate = useNavigate();

    const sections = [
        {
            key: "basic",
            label: "Basic Info",
            icon: <LibraryBig />,
        },
        {
            key: "education",
            label: "Education",
            icon: <GraduationCap />,
        },
        {
            key: "experience",
            label: "Experience",
            icon: <BriefcaseBusiness />,
        },
        {
            key: "skills",
            label: "Skills",
            icon: <Lightbulb />,
        },
        {
            key: "summary",
            label: "Summary",
            icon: <Summary />,
        },
        {
            key: "preview",
            label: "Preview",
            icon: <PanelsTopLeft />,
        },
    ];

    return (


        <div className="resume_builder_sidebar">
            <button className="resume_builder_sidebar_button back" onClick={() => navigate("/candidate/dashboard")}>
                <ArrowLeft size={16}/> Back to Dashboard
            </button>

            {sections.map(section => (

                <button
                    key={section.key}
                    className={`resume_builder_sidebar_button ${activeSection === section.key ? "active" : ""}`}
                    onClick={() =>
                        setActiveSection(section.key)
                    }
                >
                    {section.icon} {section.label}
                </button>

            ))}

        </div>

    );
}

export default ResumeBuilderSidebar;