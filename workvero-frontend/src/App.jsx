import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Header from "./components/header"
import Footer from "./components/footer"
import Home from './pages/Home';
import About from './pages/About';
import JobCategory from './pages/JobCategory';
import JobListing from './pages/JobListing';
import JobDetail from './pages/JobDetail';
import JobApply from './pages/JobApply';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/job-category" element={<JobCategory />} />
          <Route path="/jobs" element={<JobListing />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/job-apply" element={<JobApply />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App