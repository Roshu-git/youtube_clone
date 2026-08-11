import React from 'react'

function VideoCard({video}) {
  return (
    <div className='vc-videocard'>
        <img src={video.thumbnailUrl} alt={video.title} className='thumbnail' />
        <div className='vc-videoinfo'>
            <h4>{video.title}</h4>
            <p>{video.channelName}</p>
            <p>{video.views}</p>
        </div>
    </div>
  )
}

export default VideoCard