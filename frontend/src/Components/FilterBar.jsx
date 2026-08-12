import React, { useState } from 'react';

const filters = ['All', 'React', 'javascript', 'menubar', 'CSS' , 'Node.js'];
// function FilterBar() {
    const FilterBar = ({category, setCategory}) =>{
        return (
             <div className='vc-filterbar'>
                {
                    filters.map((item)=>(
                        <button key={item} onClick={() => setCategory(item)} className={`vc-filterbtn ${category === item ? 'active bg-white text-black': 'bg-gray-800 text-white'}`}>
                            {item}
                        </button>
                    ))
                }
             </div>
        )
    }
  
// }

export default FilterBar;