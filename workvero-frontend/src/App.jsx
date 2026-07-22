import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobCategory from './pages/JobCategory';
import JobListing from './pages/JobListing';
import JobDetail from './pages/JobDetail';
import JobApply from './pages/JobApply';
import './App.css';
import PublicLayout from './layouts/PublicLayout';
import EmployerLayout from './layouts/EmployerLayout';
import CandidateLayout from './layouts/CandidateLayout';
import CompanyDashboard from './pages/CompanyDashboard';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import EditJob from './pages/EditJob';
import Applicants from './pages/Applicants';
import ApplicantsView from './pages/ApplicantsView';
import Messages from './pages/Messages';
import CompanyProfile from './pages/CompanyProfile';
import EditCompanyProfile from './pages/EditCompanyProfile';
import Settings from './pages/Settings';
import ChangePassword from './pages/ChangePassword';
import CandidateDashboard from './pages/CandidateDashboard';
import CandidateProfile from './pages/CandidateProfile';
import EditCandidateProfile from './pages/EditCandidateProfile';
import MyResumes from './pages/MyResumes';
import CandidateJobs from './pages/CandidateJobs';
import CandidateJobDetail from './pages/CandidateJobDetail';
import AppliedJobs from './pages/AppliedJobs';
import SavedJobs from './pages/SavedJobs';
import { Toaster } from 'react-hot-toast';
import ResumeBuilder from './pages/ResumeBuilder';
import ResumeBuilderEdit from './pages/ResumeBuilderEdit';

function App() {
  return (
    <div className="app-container">
      <main>
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/*" element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/job-category" element={<JobCategory />} />
                <Route path="/jobs" element={<JobListing />} />
                <Route path="/jobs/:id" element={<JobDetail />} />
                <Route path="/job-apply" element={<JobApply />} />
              </Routes>
            </PublicLayout>
          } />

          <Route path="/employer/*" element={
            <EmployerLayout>
              <Routes>
                <Route path="dashboard" element={<CompanyDashboard />} />
                <Route path="profile" element={<CompanyProfile />} />
                <Route path="profile/edit" element={<EditCompanyProfile />} />
                <Route path="post-job" element={<PostJob />} />
                <Route path="manage-jobs" element={<ManageJobs />} />
                <Route path="manage-jobs/:id" element={<EditJob />} />
                <Route path="applicants" element={<Applicants />} />
                <Route path="applicants/:id" element={<ApplicantsView />} />
                <Route path="messages" element={<Messages />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/change-password" element={<ChangePassword />} />
              </Routes>
            </EmployerLayout>
          } />

          <Route path="/candidate/*" element={
            <CandidateLayout>
              <Routes>
                <Route path="dashboard" element={<CandidateDashboard />} />
                <Route path="profile" element={<CandidateProfile />} />
                <Route path="profile/edit" element={<EditCandidateProfile />} />
                <Route path="resumes" element={<MyResumes />} />
                <Route path="browse-jobs" element={<CandidateJobs />} />
                <Route path="/browse-jobs/:id" element={<CandidateJobDetail />} />
                <Route path="/applied-jobs" element={<AppliedJobs />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
                <Route path="settings" element={<Settings />} />
                <Route path="resumes/resume-builder" element={<ResumeBuilder />} />
                <Route path="settings/change-password" element={<ChangePassword />} />
              </Routes>
            </CandidateLayout>
          } />
          
          <Route path="/candidate/resumes/builder/edit" element={<ResumeBuilderEdit />} />
        </Routes>
      </main>
    </div>
  )
}

export default App