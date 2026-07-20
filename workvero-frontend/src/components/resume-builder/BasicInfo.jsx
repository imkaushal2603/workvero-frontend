import { useEffect, useState } from "react";
import api from "../../services/api";
import toast from "react-hot-toast";

function BasicInfo({ setActiveSection }) {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        photoUrl: "",

        country: "",
        state: "",
        city: "",
        zipCode: "",

        linkedin: "",
        github: "",
    });
    const [avatarFile, setAvatarFile] = useState(null);
    const [removeAvatar, setRemoveAvatar] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get("/candidate/me");

            const profile = res.data.profile;

            setFormData({
                firstName: profile.firstName || "",
                lastName: profile.lastName || "",
                phone: profile.phone || "",
                photoUrl: profile.photoUrl || "",

                country: profile.country || "",
                state: profile.state || "",
                city: profile.city || "",
                zipCode: profile.zipCode || "",

                linkedin: profile.linkedin || "",
                github: profile.github || "",
            });
        } catch (err) {
            toast.error("Failed to load profile.");
        }
    };

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

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone' || name === 'zipCode') {
            const sanitizedValue = value.replace(/[^0-9+\s-]/g, '');
            setFormData({ ...formData, [name]: sanitizedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };
    const handleAvatarChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
        ];

        if (file.size > 1024 * 1024) {
            toast.error("File size exceeds the 1MB limit.");
            e.target.value = "";
            return;
        }

        if (!allowedTypes.includes(file.type)) {
            toast.error("Only JPG and PNG images are allowed.");
            e.target.value = "";
            return;
        }

        setAvatarFile(file);

        const reader = new FileReader();

        reader.onloadend = () => {

            setFormData(prev => ({
                ...prev,
                photoUrl: reader.result,
            }));

        };

        reader.readAsDataURL(file);

    };

    const handleSave = async (next = false) => {
        try {
            if (removeAvatar) {

                await api.delete("/candidate/me/avatar");

            }
            else if (avatarFile) {

                const data = new FormData();

                data.append("avatar", avatarFile);

                const res = await api.post(
                    "/candidate/me/avatar",
                    data,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
            }
            await Promise.all([
                api.patch("/candidate/me/basic-info", {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    phone: formData.phone,
                }),

                api.patch("/candidate/me/address", {
                    country: formData.country,
                    state: formData.state,
                    city: formData.city,
                    zipCode: formData.zipCode,
                }),

                api.patch("/candidate/me/social", {
                    linkedin: formData.linkedin,
                    github: formData.github,
                }),
            ]);

            if (next) {
                setActiveSection("education");
            }
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                "Failed to save profile."
            );
        }
    };
    return (
        <div className="edit_candidate_basic">
            <form onSubmit={(e) => { e.preventDefault(); handleSave(true); }}>

                <div className="form_card resume_section">

                    <h3>Basic Info</h3>

                    <div className="form_fields logo_upload">

                        <div className="logo_upload_box">

                            <label htmlFor="avatar" className="logo_preview">

                                {formData.photoUrl ? (
                                    <img src={getFileUrl(formData.photoUrl)} alt="Avatar" />
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M12 0C12.1997 0.000124814 12.3969 0.0451206 12.5769 0.131663C12.7569 0.218206 12.9152 0.344084 13.04 0.5L18.3733 7.16667C18.4893 7.30249 18.5768 7.46022 18.6307 7.63052C18.6845 7.80081 18.7036 7.98018 18.6868 8.15798C18.67 8.33579 18.6176 8.50841 18.5328 8.66559C18.448 8.82277 18.3325 8.96132 18.1931 9.073C18.0537 9.18468 17.8933 9.26722 17.7214 9.31572C17.5496 9.36422 17.3697 9.37769 17.1925 9.35534C17.0153 9.33298 16.8444 9.27526 16.6899 9.18559C16.5355 9.09592 16.4006 8.97613 16.2933 8.83333L13.3333 5.13333V14.6667C13.3333 15.0203 13.1929 15.3594 12.9428 15.6095C12.6928 15.8595 12.3536 16 12 16C11.6464 16 11.3072 15.8595 11.0572 15.6095C10.8071 15.3594 10.6667 15.0203 10.6667 14.6667V5.13333L7.70667 8.83467C7.59939 8.97746 7.46453 9.09725 7.31007 9.18692C7.15561 9.27659 6.98471 9.33432 6.80752 9.35667C6.63032 9.37903 6.45044 9.36555 6.27855 9.31705C6.10666 9.26855 5.94627 9.18601 5.80689 9.07433C5.66752 8.96265 5.552 8.82411 5.46719 8.66693C5.38239 8.50974 5.33003 8.33713 5.31322 8.15932C5.29641 7.98151 5.31549 7.80214 5.36934 7.63185C5.42318 7.46156 5.51069 7.30382 5.62667 7.168L10.96 0.501333C11.0847 0.345173 11.2429 0.219041 11.4229 0.132264C11.6029 0.0454871 11.8002 0.000284802 12 0ZM8 14.6667V13.3333H2.66667C1.95942 13.3333 1.28115 13.6143 0.781048 14.1144C0.280951 14.6145 0 15.2928 0 16V21.3333C0 22.0406 0.280951 22.7189 0.781048 23.219C1.28115 23.719 1.95942 24 2.66667 24H21.3333C22.0406 24 22.7189 23.719 23.219 23.219C23.719 22.7189 24 22.0406 24 21.3333V16C24 15.2928 23.719 14.6145 23.219 14.1144C22.7189 13.6143 22.0406 13.3333 21.3333 13.3333H16V14.6667C16 15.7275 15.5786 16.7449 14.8284 17.4951C14.0783 18.2452 13.0609 18.6667 12 18.6667C10.9391 18.6667 9.92172 18.2452 9.17157 17.4951C8.42143 16.7449 8 15.7275 8 14.6667ZM18.6667 17.3333C18.313 17.3333 17.9739 17.4738 17.7239 17.7239C17.4738 17.9739 17.3333 18.313 17.3333 18.6667C17.3333 19.0203 17.4738 19.3594 17.7239 19.6095C17.9739 19.8595 18.313 20 18.6667 20H18.68C19.0336 20 19.3728 19.8595 19.6228 19.6095C19.8729 19.3594 20.0133 19.0203 20.0133 18.6667C20.0133 18.313 19.8729 17.9739 19.6228 17.7239C19.3728 17.4738 19.0336 17.3333 18.68 17.3333H18.6667Z" fill="#6D17E1" />
                                        </svg>
                                        <span>Upload Photo</span>
                                    </>
                                )}

                            </label>

                            <input
                                id="avatar"
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleAvatarChange}
                            />

                        </div>

                        <div className="logo_upload_info">

                            {formData.photoUrl && (
                                <button type="button" className="logo_delete_btn" onClick={() => {
                                    setAvatarFile(null); setRemoveAvatar(true);
                                    setFormData(prev => ({
                                        ...prev,
                                        photoUrl: "",
                                    }));
                                }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <rect width="48" height="48" rx="12" fill="#E2EAFF" />
                                        <path d="M31.9999 33.3333C31.9999 34.3942 31.5785 35.4116 30.8283 36.1618C30.0782 36.9119 29.0608 37.3333 27.9999 37.3333H18.6666C17.6057 37.3333 16.5883 36.9119 15.8382 36.1618C15.088 35.4116 14.6666 34.3942 14.6666 33.3333V17.3333H13.3333V13.3333H19.3333L20.6666 12H25.9999L27.3333 13.3333H33.3333V17.3333H31.9999V33.3333ZM15.9999 17.3333V33.3333C15.9999 34.0406 16.2809 34.7189 16.781 35.219C17.2811 35.719 17.9593 36 18.6666 36H27.9999C28.7072 36 29.3854 35.719 29.8855 35.219C30.3856 34.7189 30.6666 34.0406 30.6666 33.3333V17.3333H15.9999ZM31.9999 16V14.6667H26.6666L25.3333 13.3333H21.3333L19.9999 14.6667H14.6666V16H31.9999ZM18.6666 20H19.9999V33.3333H18.6666V20ZM26.6666 20H27.9999V33.3333H26.6666V20Z" fill="#6D17E1" />
                                    </svg>
                                </button>
                            )}
                            <p>Max file size is 1MB. Minimum dimension: 330x300 And Suitable files are .jpg & .png</p>
                        </div>

                    </div>

                    <div className="form_fields">
                        <div className="form_fielset">

                            <div className="form_field">
                                <label>First Name</label>
                                <input
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                />
                            </div>

                            <div className="form_field">
                                <label>Last Name</label>
                                <input
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                />
                            </div>

                            <div className="form_field">
                                <label>Phone</label>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone Number"
                                    type="tel"
                                />
                            </div>
                            <div className="form_field">
                                <label>Country</label>
                                <input
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    placeholder="Country"
                                />
                            </div>

                            <div className="form_field">
                                <label>State</label>
                                <input
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                />
                            </div>

                            <div className="form_field">
                                <label>City</label>
                                <input
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                />
                            </div>
                            <div className="form_field">
                                <label>Zip Code</label>
                                <input
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    placeholder="Zip Code"
                                />
                            </div>

                            <div className="form_field">
                                <label>LinkedIn</label>
                                <input
                                    name="linkedin"
                                    value={formData.linkedin}
                                    onChange={handleChange}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div className="form_field">
                                <label>GitHub</label>
                                <input
                                    name="github"
                                    value={formData.github}
                                    onChange={handleChange}
                                    placeholder="https://github.com/..."
                                />
                            </div>

                        </div>

                        <div className="resume_actions">

                            <button
                                type="submit"
                                className="submit-btn"
                            >
                                Save & Next
                            </button>

                        </div>
                    </div>
                </div>


            </form >
        </div>
    );
}

export default BasicInfo;