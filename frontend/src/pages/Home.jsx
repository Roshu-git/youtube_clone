import React from 'react';
import videos from '../data/videos.js'
import Filterbar from '../Components/FilterBar.jsx'
import VideoCard from '../Components/VideoCard'

function Home() {
  return (
        <div className='vc-homepage'>
            <main className='vc-home'>
                <Filterbar />

                <div className='vc-videogrid'>
                    {videos.map((video)=>(
                        <VideoCard key={video.videoId} video={video} />
                    ))}
                </div>
            </main>
        </div>
    )
}

export default Home