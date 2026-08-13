import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Mic, Plus, User, LogOut } from 'lucide-react';
import logo from '../../public/images/logo.svg';
import { useAuth } from '../context/AuthContext';

function Header({ toggleSidebar, search, setSearch }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    //   channel popup created
    const [showChannelModal, setShowChannelModal] = useState(false);
    const [channelName, setChannelName] = useState('');

    // Add create channel functionality 
    const handleCreateChannel = () => {
        if (!channelName.trim()) {
            alert('Please enter a channel name');
            return;
        }
        // Update user in localStorage 
        const updatedUser = { ...user, hasChannel: true, channelName };
        // Save updated user 
        localStorage.setItem('user', JSON.stringify(updatedUser));
        // Close popup 
        setShowChannelModal(false);
        setChannelName('');
        // Go to channel page 
        navigate('/channel');
        // Refresh app state
        window.location.reload();
        // Refresh header 
        // navigate('/');
        // window.location.reload();
    };

    return (
        <header className='vc-header'>
            {/* Left: Logo + Hamburger */}
            <div className='vc-headlogo flex flex-row items-center gap-3'>
                <button className='vc-humburger' onClick={toggleSidebar}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <div className='vc-logo'>
                    <Link to='/'>
                        <img src={logo} alt='logo' />
                    </Link>
                </div>
            </div>

            {/* Center: Search */}
            <div className='vc-search flex items-center justify-between gap-2'>
                <div className='vc-search-icon'>
                    <input
                        type='text'
                        placeholder='Search Here...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className='Search-bar flex-1 px-4 py-2 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500'
                    />

                    <button
                        type='button'
                        className='search-btn px-5 py-2 border border-l-0 border-gray-300 rounded-r-full bg-gray-100 transition'
                    >
                        <Search size={22} className='text-black' />
                    </button>
                </div>

                <div className='vc-mic-icon'>
                    <button type='button' className='voice-btn p-2 rounded-full transition'>
                        <Mic size={20} className='text-black' />
                    </button>
                </div>
            </div>



            {/* Right: Profile */}
            <div className='vc-profile flex gap-3 items-center'>
                {!user ? (
                    /* Not logged in */
                    <button
                        className='signin-button'
                        onClick={() => navigate('/login')}
                    >
                        Sign in
                    </button>
                ) : (
                    <>
                        {/* Logged in but no channel */}
                        {!user.hasChannel && (<button className='create-channel-btn flex items-center gap-2' onClick={() => setShowChannelModal(true)} >
                            <Plus size={18} /> <span>Create Channel</span>
                        </button>
                        )}

                        {/* Avatar + Username */}
                        <div className='header-user flex items-center gap-2'>
                            <div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center'>
                                <User size={22} className='text-gray-700' />
                            </div>

                            <span className='font-medium'>
                                {user.username}
                            </span>
                        </div>

                        {/* Logout */}
                        <button
                            className='signin-button flex items-center gap-2'
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>
                    </>
                )}
            </div>
            {showChannelModal && (
                <div className='channel-modal-overlay'> 
                    <div className='channel-modal'> 
                        <h2>Create your channel</h2> 
                        <p>Choose a name for your channel.</p> 
                        <input type='text' value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder='Channel name' className='channel-input' />
                        <div className='channel-actions'> 
                            <button className='cancel-btn' onClick={() => { setShowChannelModal(false); setChannelName(''); }} > Cancel </button> 
                            <button className='create-btn' onClick={handleCreateChannel} > Create </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;