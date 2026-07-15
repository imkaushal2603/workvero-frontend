import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loader from "../components/Loader";

function Settings() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: ''
    });

    const userRole = localStorage.getItem('role');
    const rolePrefix = userRole === 'candidate' ? 'candidate' : 'employer';

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const [res] = await Promise.all([
                    api.get('/auth/me'),
                    new Promise(resolve => setTimeout(resolve, 800))
                ]);
                if (res.data.user) {
                    setFormData({
                        name: res.data.user.name || '',
                        phone: res.data.user.phone || '',
                        email: res.data.user.email || '',
                    });
                }
            } catch (err) {
                toast.error('Failed to load profile');
                navigate(
                    rolePrefix === 'candidate'
                        ? '/candidate/candidate-profile/edit'
                        : '/employer/company-profile/edit'
                );
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const sanitizedValue = value.replace(/[^0-9+\s-]/g, '');
            setFormData({ ...formData, [name]: sanitizedValue });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await Promise.all([
                api.put('/auth/me', formData),
                new Promise(resolve => setTimeout(resolve, 600))
            ]);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {loading && <Loader />}
            <div className={`settings ${loading ? "loading" : ""}`}>
                <h2>Account Settings</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form_card">
                        <h3>Edit & Update</h3>
                        <div className="form_fields">
                            <div className="form_fielset">
                                <div className="form_field">
                                    <label htmlFor="name">Name<span>*</span></label>
                                    <input id="name" name="name" required value={formData.name} onChange={handleChange} placeholder="Enter Name" />
                                </div>
                                <div className="form_field">
                                    <label htmlFor="phone">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Phone Number" />
                                </div>
                            </div>
                            <div className="form_full">
                                <div className="form_field">
                                    <label htmlFor="email">Email</label>
                                    <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" />
                                </div>
                            </div>
                            <div className="form_change_password">
                                <button type="button" onClick={() => navigate(`/${rolePrefix}/settings/change-password`)}>Change Password</button>
                            </div>
                        </div>
                    </div>
                    <div className="form_buttons">
                        <button type="submit" className="submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className="cancel-btn" onClick={() => navigate(`/${rolePrefix}/dashboard`)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Settings;