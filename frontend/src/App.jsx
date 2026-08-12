import React, { useState } from 'react'
import "./style.css";
// import Header from './Components/Header.jsx';
import Header from './Components/Header.jsx';
import Sidebar from './Components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import { Routes, Route } from 'react-router-dom';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // shared search state 
  const [search, setSearch] = useState('');

  const toggleSidebar = () =>{
    // setIsSidebarOpen(!isSidebarOpen);
    setIsSidebarOpen(prev => !prev);
  }
  return (
    <div className='vc-mainapp'>
      <div className='vc-main'>
        <Header toggleSidebar={toggleSidebar} search={search} setSearch={setSearch} />
        <div className='vc-mainlayout d-flex'>
          <Sidebar isOpen={isSidebarOpen} />
          {/* <Home /> */}
          {/* <Home isSidebarOpen={isSidebarOpen} search={search} /> */}
          <Routes>
            <Route path="/" element={<Home isSidebarOpen={isSidebarOpen} search={search} /> } />
          <Route path="/watch/:id" element={<VideoPlayer isSidebarOpen={isSidebarOpen} />} />
          </Routes>
        </div>
      </div>
      {/* <Routes> <Route path="/" element={<Home />} /> <Route path="/watch/:id" element={<VideoPlayer />} /> </Routes> */}
    </div>
  )
}

export default App