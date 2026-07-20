import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const MAX_RESUMES = 5;

function MyResumes() {
  const [cvFiles, setCvFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeBuilder, setResumeBuilder] = useState({ exists: false });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const fetchResumeData = async () => {
    setLoading(true);

    try {
      const [cvRes, builderRes] = await Promise.all([
        api.get("/candidate/me/cv"),
        api.get("/candidate/resume-builder/status"),
      ]);

      setCvFiles(cvRes.data.cv || []);
      setResumeBuilder(builderRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch resumes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeData();
  }, []);
  const getFileUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const baseUrl = import.meta.env.VITE_API_URL.replace(/\/api$/, '');
    return encodeURI(`${baseUrl}/${path.replace(/^\//, '')}`);
  };

  const handleUploadClick = () => {
    if (cvFiles.length >= MAX_RESUMES) {
      toast.error(`You can only upload up to ${MAX_RESUMES} resumes.`);
      return;
    }
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      toast.error('Only .pdf, .doc, .docx files are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error('File size exceeds the 1MB limit.');
      e.target.value = '';
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading('Uploading resume...');
    try {
      const data = new FormData();
      data.append('cv', file);

      const res = await api.post('/candidate/me/cv', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setCvFiles(prev => [res.data.cv, ...prev]);
      toast.dismiss(loadingToast);
      toast.success('Resume uploaded successfully!');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Failed to upload resume.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleRemove = async (cvId) => {
    const loadingToast = toast.loading('Removing resume...');
    try {
      await api.delete(`/candidate/me/cv/${cvId}`);
      setCvFiles(prev => prev.filter(cv => cv.id !== cvId));
      toast.dismiss(loadingToast);
      toast.success('Resume removed.');
    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.message || 'Failed to remove resume.');
    }
  };

  const handleSetActive = async (cvId) => {
    const previousFiles = cvFiles;

    setCvFiles(prev => prev.map(cv => ({ ...cv, isActive: cv.id === cvId })));

    try {
      await api.patch(`/candidate/me/cv/${cvId}/active`);
      toast.success('Active resume updated!');
    } catch (err) {
      setCvFiles(previousFiles);
      toast.error(err.response?.data?.message || 'Failed to update active resume.');
    }
  };

  const handleDeleteResumeBuilder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your Resume Builder?"
    );

    if (!confirmed) return;

    const loadingToast = toast.loading("Deleting resume...");

    try {
      await api.delete("/candidate/resume-builder");

      toast.dismiss(loadingToast);
      toast.success("Resume Builder deleted successfully.");

      await fetchResumeData();
    } catch (err) {
      toast.dismiss(loadingToast);
      console.log(err)
      toast.error(
        err.response?.data?.message || "Failed to delete resume builder."
      );
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className={`my_resumes ${loading ? "loading" : ""}`}>
        <div className='my_resumes_cta'>
          <h2>My Resumes</h2>
          {!resumeBuilder?.exists && (
            <button onClick={() => navigate("/candidate/resume-builder")}>
              Create Resume
            </button>
          )}
        </div>
        <div className="form_card">
          <h3>Upload CV File</h3>
          <div className="form_fields">
            <div className="form_fielset">
              <div className="form_field">
                <label>CV Attachment<span>*</span></label>
              </div>
              {cvFiles.map((cv) => (
                <div className="form_field cv_row" key={cv.id}>
                  <a href={getFileUrl(cv.fileUrl)} target="_blank" rel="noopener noreferrer">
                    {cv.fileName || 'DOC, PDF'}
                  </a>
                  <button type="button" className="cv_remove_btn" onClick={() => handleRemove(cv.id)} aria-label="Remove resume">×</button>
                </div>
              ))}
              {cvFiles.length < MAX_RESUMES && (
                <div className="form_field upload_cv_field">
                  <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileChange} />
                  <button type="button" className="upload_cv_btn" onClick={handleUploadClick} disabled={isUploading}>
                    + {isUploading ? 'Uploading...' : 'Upload CV'}
                  </button>
                  <p className="upload_hint">Upload file .pdf, .doc, .docx ({cvFiles.length}/{MAX_RESUMES})</p>
                </div>
              )}
            </div>
          </div>
        </div>
        {cvFiles.length > 0 && (
          <div className='jobs_table resumes_tables'>
            <div className="jobs_table_header">
              <div className='jobs_table_heading'>Resume Name</div>
              <div className='jobs_table_heading'>Uploaded Date</div>
              <div className='jobs_table_heading'>Active</div>
            </div>
            {cvFiles.map((cv) => (
              <div className="jobs_table_body" key={cv.id}>
                <div className="jobs_table_row">
                  <p>
                    <a href={getFileUrl(cv.fileUrl)} target="_blank" rel="noopener noreferrer">
                      {cv.fileName || 'Untitled Resume'}
                    </a>
                  </p>
                </div>
                <div className="jobs_table_row">
                  <p>
                    {cv.uploadedAt
                      ? new Date(cv.uploadedAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })
                      : 'N/A'}
                  </p>
                </div>
                <div className="jobs_table_row">
                  <p>
                    <label className="toggle_switch">
                      <input
                        type="checkbox"
                        checked={!!cv.isActive}
                        onChange={() => !cv.isActive && handleSetActive(cv.id)}
                      />
                      <span className="toggle_slider" />
                    </label>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {resumeBuilder?.exists && (

          <div className="form_card resume_builder_view">
            <h3> Resume Builder</h3>
            <div className="resume_builder_row">
              <div className="resume_builder_left">
                <img src={getFileUrl(resumeBuilder?.data?.resume_templates?.preview)} alt="Template Preview" />
                <div className="resume_builder_info">
                  <h4>{resumeBuilder?.data?.name}</h4>
                  <div className="resume_preview_information">
                    <p className="resume_last_updated">Template: {resumeBuilder?.data?.resume_templates?.name}</p>
                    <p className="resume_last_updated">• {" "} Last edited on{" "}
                      {new Date(resumeBuilder?.data?.updatedAt).toLocaleDateString(
                        "en-GB",
                        {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>


                </div>

              </div>
              <div className="resume_builder_actions action_btn">
                <button className="btn_secondary" onClick={() => navigate("/candidate/resumes/builder/preview")}>
                  Preview
                </button>
                <button className="btn_secondary" onClick={() => navigate("/candidate/resumes/builder/edit")}>
                  Edit
                </button>
                <button className="btn_primary" onClick={handleDeleteResumeBuilder}
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        )}
      </div>
    </>
  );
}

export default MyResumes;