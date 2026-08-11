import React from 'react';
import { User } from 'lucide-react';
import {Link} from 'react-router-dom';
import logo from '../assets/images/logo.svg';

function Header({toggleSidebar}) {
  return (
    <header className='vc-header'>
        <div className='vc-headlogo flex-row gap-2'>
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
        <div className='vc-search'>
            <input type='text' placeholder="search Here..." className='Search-bar' />
        </div>
        <div className='vc-profile'>
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"> 
                <User size={22} className="text-gray-700" /> 
            </div>
        </div>
    </header>
  )
}

export default Header;