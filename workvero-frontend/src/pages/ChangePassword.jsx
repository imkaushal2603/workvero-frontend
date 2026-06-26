import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function ChangePassword() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.new_password !== formData.confirm_password) {
            setError('New passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            const email = localStorage.getItem('email');
            await api.post('/auth/change-password', {
                oldPassword: formData.current_password,
                newPassword: formData.new_password
            });
            alert('Password changed successfully!');
            navigate('/employer/settings');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="change_password">
            <h2>Change Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form_card">
                    <h3>Change Password</h3>
                    <div className="form_fields">
                        <div className="form_full">
                            <div className="form_field">
                                <label htmlFor="current_password">Current Password<span>*</span></label>
                                <input type="password" name="current_password" id="current_password" value={formData.current_password} onChange={handleChange} placeholder="Enter Current Password" required />
                            </div>
                        </div>
                        <div className="form_full">
                            <div className="form_field">
                                <label htmlFor="new_password">New Password<span>*</span></label>
                                <input type="password" name="new_password" id="new_password" value={formData.new_password} onChange={handleChange} placeholder="Enter New Password" required />
                            </div>
                        </div>
                        <div className="form_full">
                            <div className="form_field">
                                <label htmlFor="confirm_password">Confirm New Password<span>*</span></label>
                                <input type="password" name="confirm_password" id="confirm_password" value={formData.confirm_password} onChange={handleChange} placeholder="Confirm New Password" required />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form_buttons">
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Changing...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ChangePassword;