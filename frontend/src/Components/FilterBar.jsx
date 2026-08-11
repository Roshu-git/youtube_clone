import React from 'react'

function Filterbar() {
    const filters = ['All', 'React', 'javascript', 'menubar', 'CSS' , 'Node.js'];
    const filterBar = () =>{
        return (
             <div className='vc-filterbar'>
                {
                    filters.map((item)=>(
                        <button key={item} className='vc-filterbtn'>
                            {item}
                        </button>
                    ))
                }
             </div>
        )
    }
  
}

export default Filterbar