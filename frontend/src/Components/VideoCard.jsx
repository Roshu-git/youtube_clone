import React from 'react'
import { Link } from 'react-router-dom';

function VideoCard({video}) {

  function formatViews(views) {
  if (views >= 1000000) {
    return `${(views / 1000000).toFixed(1)}M views`;
  }

  if (views >= 1000) {
    return `${(views / 1000).toFixed(1)}K views`;
  }

  return `${views} views`;
}


// Format upload date
function formatDate(date) {
  const uploadDate = new Date(date);
  const now = new Date();

  const difference =
    Math.floor(
      (now - uploadDate) / (1000 * 60 * 60 * 24)
    );

  if (difference === 0) {
    return "Today";
  }

  if (difference === 1) {
    return "1 day ago";
  }

  if (difference < 30) {
    return `${difference} days ago`;
  }

  if (difference < 365) {
    return `${Math.floor(difference / 30)} months ago`;
  }

  return `${Math.floor(difference / 365)} years ago`;
}

  return (
    <div className='vc-videocard'>
        <Link to={`/watch/${video.videoId}`} className="vc-thumbnail-wrapper">
              <img src={video.thumbnailUrl} alt={video.title} className='thumbnail' loading='lazy'/>
             {/* Video duration */}
            {video.duration && ( <span className="vc-duration">{video.duration}</span> )}
        </Link>

          {/* Video information */}
        <div className='vc-videoinfo flex justify-between' >
        <div className='vc-videoinfo-inner'>
            <Link to={`/watch/${video.videoId}`}>
              <h4>{video.title}</h4>
            </Link>
              {/* Channel name */}
          <div className="vc-channel">
            <p className='vc-chadec'>{video.description}</p>
            <p>{video.channelName}</p>

            {video.verified && (
              <span className="vc-verified">✓</span>
            )}
          </div>

          {/* Views + upload date */}
          <p className="vc-meta">
            {formatViews(video.views)}
            {" • "}
            {formatDate(video.uploadDate)}
          </p>
            </div>
            <div className='vc-video-dotbtn'>
              {/* Three dot menu */}
        <button className="vc-menu">
          ⋮
        </button>
        </div>
            {/* <p>{video.channelName}</p>
            <p>{video.views}</p> */}
        </div>
    </div>
  )
}

export default VideoCard