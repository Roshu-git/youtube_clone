import React from 'react'
import { Link } from 'react-router-dom'

function Sidebar({isopen}) {
  return (
    <div className='vc-sidebar'>
        <aside className={`sidebar ${isopen ? 'open' : 'close' }`}>
            <ul className='vs-navmenu'>
                <li>
                    <Link to="/">
                     Home
                    </Link>
                    <Link to="/">
                     Shorts
                    </Link>
                    <Link to="/">
                     Subcription
                    </Link>
                    <Link to="/">
                     Library
                    </Link>
                </li>
            </ul>
        </aside>
    </div>
  )
}

export default Sidebar