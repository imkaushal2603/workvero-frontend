import { useState } from "react";

import ResumeBuilderSidebar from "../components/resume-builder/ResumeBuilderSidebar";
import DashboardHeader from "../components/DashboardHeader";    

import BasicInfo from "../components/resume-builder/BasicInfo";
import Education from "../components/resume-builder/Education";
import Experience from "../components/resume-builder/Experience";
import Skills from "../components/resume-builder/Skills";
import Summary from "../components/resume-builder/Summary";

function ResumeBuilderEdit() {
    const [activeSection, setActiveSection] = useState("basic");

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

                    {activeSection === "summary" && (<Summary />)}

                </div>


            </div >
        </>
    );
}

export default ResumeBuilderEdit;