import { useState } from "react";

import ResumeBuilderSidebar from "../layouts/ResumeBuilderLayout";
import DashboardHeader from "../components/DashboardHeader";
import BasicInfo from "../components/resume-builder/BasicInfo";
import Education from "../components/resume-builder/Education";
import Experience from "../components/resume-builder/Experience";
import Skills from "../components/resume-builder/Skills";
import Summary from "../components/resume-builder/Summary";
import ResumePreview from "../components/resume-builder/ResumePreview";
import { useLocation } from "react-router-dom";


function ResumeBuilderEdit() {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState(location.state?.tab ?? "basic");

    return (
        <>
            <DashboardHeader />
            <div className="resume_builder_edit">

                <ResumeBuilderSidebar activeSection={activeSection} setActiveSection={setActiveSection} />

                <div className="resume_builder_content dashboard-main">

                    {activeSection === "basic" && (<BasicInfo setActiveSection={setActiveSection} />)}

                    {activeSection === "education" && (<Education setActiveSection={setActiveSection} />)}

                    {activeSection === "experience" && (<Experience setActiveSection={setActiveSection} />)}

                    {activeSection === "skills" && (<Skills setActiveSection={setActiveSection} />)}

                    {activeSection === "summary" && (<Summary setActiveSection={setActiveSection}/>)}

                    {activeSection === "preview" && (<ResumePreview />)}

                </div>


            </div >
        </>
    );
}

export default ResumeBuilderEdit;