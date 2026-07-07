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
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import EditJob from './pages/EditJob';
import CompanyProfile from './pages/CompanyProfile';
import EditCompanyProfile from './pages/EditCompanyProfile';
import Settings from './pages/Settings';
import ChangePassword from './pages/ChangePassword';
import CandidateProfile from './pages/CandidateProfile';
import EditCandidateProfile from './pages/EditCandidateProfile';
import CandidateJobs from './pages/CandidateJobs';
import CandidateJobDetail from './pages/CandidateJobDetail';
import AppliedJobs from './pages/AppliedJobs';
import SavedJobs from './pages/SavedJobs';
import { Toaster } from 'react-hot-toast';

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
                <Route path="company-profile" element={<CompanyProfile />} />
                <Route path="company-profile/edit" element={<EditCompanyProfile />} />
                <Route path="post-job" element={<PostJob />} />
                <Route path="manage-jobs" element={<ManageJobs />} />
                <Route path="manage-jobs/:id" element={<EditJob />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/change-password" element={<ChangePassword />} />
              </Routes>
            </EmployerLayout>
          } />

          <Route path="/candidate/*" element={
            <CandidateLayout>
              <Routes>
                <Route path="candidate-profile" element={<CandidateProfile />} />
                <Route path="candidate-profile/edit" element={<EditCandidateProfile />} />
                <Route path="jobs" element={<CandidateJobs />} />
                <Route path="/jobs/:id" element={<CandidateJobDetail />} />
                <Route path="/applied-jobs" element={<AppliedJobs />} />
                <Route path="/saved-jobs" element={<SavedJobs />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/change-password" element={<ChangePassword />} />
              </Routes>
            </CandidateLayout>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App