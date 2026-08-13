import React, { useState } from 'react'
import "./style.css";
import Header from './Components/Header.jsx';
import Sidebar from './Components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import VideoPlayer from './pages/VideoPlayer.jsx';
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Channel from './pages/Channel.jsx';
import { Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import CreateChannel from './pages/CreateChannel.jsx';

function App() {
  const location = useLocation();
  const isAuthPage =
  location.pathname === "/login" ||
  location.pathname === "/register";
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
        {/* {!isAuthPage && ( <Header toggleSidebar={toggleSidebar} search={search} setSearch={setSearch} user={user} /> )} */}
        {!isAuthPage && ( <Header toggleSidebar={toggleSidebar} search={search} setSearch={setSearch} /> )}
        {/* <Header toggleSidebar={toggleSidebar} search={search} setSearch={setSearch} /> */}
        <div className='vc-mainlayout d-flex'>
          {!isAuthPage && ( <Sidebar isOpen={isSidebarOpen} /> )}
          {/* <Sidebar isOpen={isSidebarOpen} /> */}
          {/* <Home /> */}
          {/* <Home isSidebarOpen={isSidebarOpen} search={search} /> */}
          <Routes>
            <Route path="/" element={<Home isSidebarOpen={isSidebarOpen} search={search} /> } />
            {/* <Route path="/" element={ user ? <Home isSidebarOpen={isSidebarOpen} search={search} /> : <Navigate to='/login' /> } /> */}
             <Route path="/login" element={<Login />} />
             <Route path="/register" element={<Register />} />
             <Route path="/create-channel" element={<CreateChannel />} />
             <Route path="/channel" element={ <ProtectedRoute> <Channel isSidebarOpen={isSidebarOpen} /> </ProtectedRoute> } />
              <Route path="/watch/:id" element={<VideoPlayer isSidebarOpen={isSidebarOpen} />} />
          </Routes>
        </div>
      </div>
      {/* <Routes> <Route path="/" element={<Home />} /> <Route path="/watch/:id" element={<VideoPlayer />} /> </Routes> */}
    </div>
  )
}

export default App