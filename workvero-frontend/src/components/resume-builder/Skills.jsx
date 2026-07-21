import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../services/api";

function Skills({ setActiveSection }) {

    const [skillName, setSkillName] = useState("");
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {

        try {

            const res = await api.get("/candidate/me/skills");

            setSkills(res.data.skills || []);

        } catch (error) {

            toast.error("Failed to load skills.");

        }

    };

    const addSkill = async () => {

        if (!skillName.trim()) {
            return toast.error("Please enter a skill.");
        }

        try {

            const res = await api.post(
                "/candidate/me/skills",
                {
                    skillName: skillName.trim(),
                }
            );

            setSkills(prev => [
                ...prev,
                res.data.skill,
            ]);

            setSkillName("");

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to add skill."
            );

        }

    };

    const deleteSkill = async (skill) => {

        try {

            await api.delete(
                `/candidate/me/skills/${skill.id}`
            );

            setSkills(prev =>
                prev.filter(
                    item => item.id !== skill.id
                )
            );

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Failed to delete skill."
            );

        }

    };

    return (

        <div className="edit_candidate_basic">
            <div className="form_card resume_section">

                <div className="resume_section_header">

                    <h3>Skills</h3>



                </div>


                <div className="skill_form_fields">
                    <div className="form_fielset">

                        <div className="form_field">
                            <label>Skill Name</label>
                            <input type="text" value={skillName}
                                onChange={(e) =>
                                    setSkillName(e.target.value)
                                }
                                placeholder="E.g. React.js"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addSkill();
                                    }
                                }}
                            />

                        </div>
                    </div>
                    <button type="button" className="add_section" onClick={addSkill}> + Skill</button>
                </div>
                <div className="skill_list">

                    {skills.length > 0 ? (
                        skills.map((skill) => (
                            <div key={skill.id} className="skill_chip">
                                <button type="button" onClick={() => deleteSkill(skill)}>× </button>
                                <span>{skill.skillName}</span>
                                
                            </div>
                        ))
                    ) : (
                        <p className="no_data"> No skills added yet.</p>
                    )}

                </div>
                <div className="resume_footer form_fields">
                    <button type="button" className="outline-btn" onClick={() => setActiveSection("experience")}>Back</button>
                    <button type="button" className="submit-btn" onClick={() => setActiveSection("summary")}>Next</button>
                </div>

            </div>

        </div>

    );

}

export default Skills;