import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Header from "./components/header"
import Footer from "./components/footer"
import Home from './pages/Home';
import About from './pages/About';
import './App.css'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App