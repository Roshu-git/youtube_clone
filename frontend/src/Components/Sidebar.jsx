import React from 'react';
import { Link } from 'react-router-dom';
import {
  House,
  Clapperboard,
  PlaySquare,
  Library,
  CircleUser,
  TvMinimal
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';

function Sidebar({ isOpen }) {
  const { user } = useAuth();

  return (
    <div className='vc-sidebarwrap'>
      <aside className={`vc-sidebar ${isOpen ? 'open' : 'close'}`}>

        <ul className='vc-navmenu'>

          <li>
            <Link
              to='/'
              className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100'
            >
              <House size={22} />
              <span className='menu-text'>Home</span>
            </Link>
          </li>

          {/* Show only if user has channel */}
          {user?.hasChannel && (
            <li>
              <Link
                to='/channel'
                className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100'
              >
                <CircleUser size={22} />
                <span className='menu-text'>Your Channel</span>
              </Link>
            </li>
          )}

          <li>
            <Link
              to='/'
              className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100'
            >
              <Clapperboard size={22} />
              <span className='menu-text'>Shorts</span>
            </Link>
          </li>

          <li>
            <Link
              to='/'
              className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100'
            >
              <PlaySquare size={22} />
              <span className='menu-text'>Subscription</span>
            </Link>
          </li>

          <li>
            <Link
              to='/'
              className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100'
            >
              <Library size={22} />
              <span className='menu-text'>Library</span>
            </Link>
          </li>

          <li>
            <Link
              to='/channel'
              className='flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100'
            >
              <TvMinimal size={22} />
              <span className='menu-text'>My Channel</span>
            </Link>
          </li>

        </ul>

      </aside>
    </div>
  );
}

export default Sidebar;