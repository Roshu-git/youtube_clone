import React, { useState } from 'react';
import videos from '../data/videos.js'
import VideoCard from '../Components/VideoCard'
import FilterBar from '../Components/FilterBar.jsx';

function Home({ isSidebarOpen, search }) {

    const [category, setCategory] = useState('All');

    // Combine search and filter 
    const filteredVideos = videos.filter((video) => { 
        // Search by title
        const matchSearch = video.title 
        .toLowerCase() 
        .includes((search || '').toLowerCase());
        // .includes(search.toLowerCase()); 
        
        // Filter by category
        // const matchCategory = category === 'All' || video.title.toLowerCase().includes(category.toLowerCase()); 
        const matchCategory = category === 'All' || video.category === category; 
        return matchSearch && matchCategory; 
    });

  return (
        <div className={`vc-homepage ${!isSidebarOpen ? 'expanded' : ''}`}>
            
            <main className='vc-home'>
                <FilterBar category={category} setCategory={setCategory}    />

                    {filteredVideos.length > 0 ? ( 
                <div className='vc-videogrid'>
                        {filteredVideos.map((video) => ( <VideoCard key={video.videoId} video={video} /> ))}
                        </div>
                    ) : (
                    <div className="no-videos">
                        <h3>No videos found</h3>
                        <p>Try another search or category.</p>
                    </div>
                    )}
                    {/* {videos.map((video)=>(
                        <VideoCard key={video.videoId} video={video} />
                    ))} */}
                
            </main>
        </div>
    )
}

export default Home