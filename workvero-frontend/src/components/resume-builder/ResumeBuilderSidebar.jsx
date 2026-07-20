function ResumeBuilderSidebar({ activeSection, setActiveSection, }) {

    const sections = [
        {
            key: "basic",
            label: "Basic Info",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <circle cx="9" cy="10" r="2" />
                <path d="M6.5 15c.7-1.3 2-2 3.5-2s2.8.7 3.5 2" />
                <path d="M16 9h2M16 13h2" />
            </svg>),
        },
        {
            key: "education",
            label: "Education",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 10L12 5 2 10l10 5 10-5z" />
                <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5" />
            </svg>),
        },
        {
            key: "experience",
            label: "Experience",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="7" width="18" height="13" rx="2" />
                <path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>),
        },
        {
            key: "skills",
            label: "Skills",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a5 5 0 015 5c0 2-1 3.2-2 4v2h-6v-2c-1-.8-2-2-2-4a5 5 0 015-5z" />
                <path d="M9 17h6M10 21h4" />
            </svg>),
        },
        {
            key: "summary",
            label: "Summary",
            icon: (<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 2h9l5 5v15H6z" />
                <path d="M15 2v5h5" />
                <path d="M9 10h6M9 14h6M9 18h6" />
            </svg>),
        },
    ];

    return (


        <div className="resume_builder_sidebar">

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