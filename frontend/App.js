import React, { useState } from 'react'
import "./style.css";
import Header from './Components/Header';
import Sidebar from './Components/Sidebar';
import Home from './pages/Home';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () =>{
    setIsSidebarOpen(!isSidebarOpen);
  }
  return (
    <div className='vc-mainapp'>
      <div className='vc-main'>
        <Header toggleSidebar={toggleSidebar} />
        <div className='vc-mainlayout d-flex'>
          <Sidebar isopen={isSidebarOpen} />
          <Home />
        </div>
      </div>
    </div>
  )
}

export default App