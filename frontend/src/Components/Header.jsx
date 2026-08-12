import React from 'react';
import { User } from 'lucide-react';
import {Link} from 'react-router-dom';
import logo from '../../public/images/logo.svg';
import { Search } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {  LogOut  } from "lucide-react";

function Header({toggleSidebar, search, setSearch}) {
     const navigate = useNavigate();
    
    const { user, logout } = useAuth();
    
//   const token = localStorage.getItem("token");

  return (
    <header className='vc-header'>
        <div className='vc-headlogo flex flex-row items-center gap-3'>
        <button className='vc-humburger' onClick={toggleSidebar}>
            <span></span>
            <span></span>
            <span></span>
        </button>
        <div className='vc-logo'>
            <Link to="/">
                <img src={logo} alt="logo"/>
            </Link>
        </div>
        </div>
        <div className='vc-search flex items-center justify-between'>
            <input type='text' placeholder="search Here..." value={search} onChange={(e)=> setSearch(e.target.value)} className='Search-bar flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500 ' />
            <button type="button" onClick={() => {}} className="search-btn px-5 py-2 border border-l-0 border-gray-300 rounded-r-full bg-gray-100  transition " > 
                <Search size={22} className="text-black" /> 
            </button>
        </div>

        <div className='vc-profile flex gap-2 items-center'>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"> 
                <User size={22} className="text-gray-700" /> 
            </div>
            <div className='vc-signin-btn flex gap-2 items-center'>
            {/* {token && user ? ( */}
            {user ? (
                <>
            {/* // User is logged in */}
            <div className="header-user">
                {user.username}
            </div>
            <button className="signin-button flex items-center gap-2"  onClick={() => { logout(); navigate('/signin'); }}>
                  <LogOut size={18} />
                Logout
              </button>
            </>

            ) : (
                // User is NOT logged in
            <button
                className="signin-button"
                onClick={() => navigate("/login")}
            >
                Sign in
            </button>

            )}
            </div>
</div>
            {/* logout */}
           
    </header>
  )
}

export default Header;