import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import JobCategory from './pages/JobCategory';
import JobListing from './pages/JobListing';
import JobDetail from './pages/JobDetail';
import JobApply from './pages/JobApply';
import './App.css'
import PublicLayout from './layouts/PublicLayout'
import EmployerLayout from './layouts/EmployerLayout'
import PostJob from './pages/PostJob'

function App() {
  return (
    <div className="app-container">
      <main>
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
                <Route path="post-job" element={<PostJob />} />
              </Routes>
            </EmployerLayout>
          } />
        </Routes>
      </main>
    </div>
  )
}

export default App