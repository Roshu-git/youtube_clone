import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function Channel({ isSidebarOpen }) {
  const { user } = useAuth();

  // Hooks must be before any return
  const [channel] = useState({
    channelName: user?.channelName || `${user?.username}'s Channel`,
    description: 'Welcome to my YouTube channel',
    subscribers: 0,
    banner:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
  });

  const [activeTab, setActiveTab] = useState('Home');

  const [videoForm, setVideoForm] = useState({
    title: '',
    category: 'React',
    // thumbnailUrl: '',
    // videoUrl: '',
    videoUrl: null,
    thumbnailUrl: null,
    description: '',
  });

  const [videos, setVideos] = useState(() => {
    const savedVideos = localStorage.getItem('channelVideos');
    return savedVideos ? JSON.parse(savedVideos) : [];
  });

  const [editingId, setEditingId] = useState(null);

  // Save videos to localStorage
  useEffect(() => {
    localStorage.setItem('channelVideos', JSON.stringify(videos));
  }, [videos]);

  // If not logged in
  if (!user) {
    return (
      <div className='vc-channel-login-required p-6'>
        <h2>Sign in to view your channel</h2>
      </div>
    );
  }

  // Handle text inputs
  const handleChange = (e) => {
    setVideoForm({
      ...videoForm,
      [e.target.name]: e.target.value,
    });
  };

  // Thumbnail upload
  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setVideoForm({
        ...videoForm,
        thumbnailUrl: URL.createObjectURL(file),
      });
    }
  };

  // Video upload
  const handleVideoUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setVideoForm({
        ...videoForm,
        videoUrl: URL.createObjectURL(file),
      });
    }
  };

  // Create or update video
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!videoForm.title || !videoForm.thumbnailUrl || !videoForm.videoUrl) {
      alert('Please fill all required fields');
      return;
    }

    if (editingId) {
      setVideos(
        videos.map((video) =>
          video.id === editingId
            ? { ...video, ...videoForm }
            : video
        )
      );

      setEditingId(null);
    } else {
      const newVideo = {
        id: Date.now(),
        ...videoForm,
        channelName: channel.channelName,
        views: 0,
      };

      setVideos([newVideo, ...videos]);
    }

    // Reset form
    setVideoForm({
      title: '',
      category: 'React',
      thumbnailUrl: '',
      videoUrl: '',
      description: '',
    });
  };

  // Edit video
  const handleEdit = (video) => {
    setVideoForm({
      title: video.title,
      category: video.category,
      thumbnailUrl: video.thumbnailUrl,
      videoUrl: video.videoUrl,
      description: video.description,
    });

    setEditingId(video.id);
    setActiveTab('Videos');
  };

  // Delete video
  const handleDelete = (id) => {
    if (window.confirm('Delete this video?')) {
      setVideos(videos.filter((video) => video.id !== id));
    }
  };

  return (
    <div className={`channel-page ${!isSidebarOpen ? 'expanded' : ''}`}>

      {/* Banner */}
      <div className='channel-banner'>
        <img src={channel.banner} alt='banner' />
      </div>

      {/* Channel Info */}
      <div className='channel-info flex gap-4 items-center p-6'>

        <div className='channel-avatar'>
          {channel.channelName.charAt(0).toUpperCase()}
        </div>

        <div className='channel-details'>
          <h1 className='text-3xl font-bold'>
            {channel.channelName}
          </h1>

          <p className='text-gray-600'>
            @{user.username}
          </p>

          <p className='text-gray-500 text-sm'>
            {channel.subscribers} subscribers · {videos.length} videos
          </p>

          <p className='mt-2 text-gray-700'>
            {channel.description}
          </p>
        </div>

      </div>

      {/* Tabs */}
      <div className='channel-tabs flex gap-6 px-6 border-b overflow-x-auto'>

        {['Home', 'Videos', 'Shorts', 'Live', 'Playlists', 'Community'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={
              activeTab === tab
                ? 'channel-tab active pb-3 border-b-2 border-black font-semibold whitespace-nowrap'
                : 'channel-tab pb-3 text-gray-500 whitespace-nowrap'
            }
          >
            {tab}
          </button>
        ))}

      </div>

      {/* HOME TAB */}
      {activeTab === 'Home' && (
        <div className='channel-home p-6'>
          <h2 className='text-2xl font-bold mb-6'>Latest Videos</h2>

          {videos.length === 0 ? (
            <div className='text-center py-16 text-gray-500'>
              <p>No videos uploaded yet.</p>
            </div>
          ) : (
            <div className='channel-video-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {videos.slice(0, 4).map((video) => (
                <div key={video.id} className='channel-video-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition'>
                  <img
                    src={video.thumbnailUrl &&
    !video.thumbnailUrl.startsWith("blob:")
      ? video.thumbnailUrl
      : "/images/default-thumbnail.jpg"
  }
                    alt={video.title}
                    className='w-full aspect-video object-cover'
                  />

                  <div className='channel-video-content p-4'>
                    <h3 className='font-semibold line-clamp-2 mb-2'>
                      {video.title}
                    </h3>

                    <p className='text-sm text-gray-500'>
                      {video.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIDEOS TAB */}
      {activeTab === 'Videos' && (
        <div className='p-6 space-y-10'>

          {/* Upload Form */}
          <div className='channel-form-section bg-white rounded-2xl p-6 shadow-sm'>

            <h2 className='text-2xl font-bold mb-6'>
              {editingId ? 'Edit Video' : 'Upload Video'}
            </h2>

            <form onSubmit={handleSubmit} className='channel-video-form space-y-5'>

              <div className='file-input-group'>
                <label className='block mb-2 font-medium'>Video title</label>

                <input
                  type='text'
                  name='title'
                  placeholder='Video title'
                  value={videoForm.title}
                  onChange={handleChange}
                  className='w-full border rounded-lg px-4 py-3'
                />
              </div>

              <div className='file-input-group'>
                <label className='block mb-2 font-medium'>Category</label>

                <select
                  name='category'
                  value={videoForm.category}
                  onChange={handleChange}
                  className='w-full border rounded-lg px-4 py-3'
                >
                  <option>React</option>
                  <option>JavaScript</option>
                  <option>MERN</option>
                  <option>CSS</option>
                  <option>Node.js</option>
                  <option>Frontend</option>
                </select>
              </div>

              <div className='file-input-group'>
                <label className='block mb-2 font-medium'>Upload Thumbnail</label>

                <input
                  type='file'
                  accept='image/*'
                  onChange={handleThumbnailUpload}
                  className='w-full border rounded-lg px-4 py-3'
                />
              </div>

              <div className='file-input-group'>
                <label className='block mb-2 font-medium'>Upload Video</label>

                <input
                  type='file'
                  accept='video/*'
                  onChange={handleVideoUpload}
                  className='w-full border rounded-lg px-4 py-3'
                />
              </div>

              <div className='file-input-group'>
                <label className='block mb-2 font-medium'>Description</label>

                <textarea
                  name='description'
                  placeholder='Video description'
                  value={videoForm.description}
                  onChange={handleChange}
                  rows={4}
                  className='w-full border rounded-lg px-4 py-3'
                />
              </div>

              <button
                type='submit'
                className='bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition'
              >
                {editingId ? 'Update Video' : 'Upload Video'}
              </button>

            </form>
          </div>

          {/* Videos List */}
          <div className='channel-videos-section'>

            <h2 className='text-2xl font-bold mb-6'>
              Your Videos ({videos.length})
            </h2>

            {videos.length === 0 ? (
              <div className='text-center py-16 text-gray-500'>
                <p>No videos uploaded yet.</p>
              </div>
            ) : (
              <div className='channel-video-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>

                {videos.map((video) => (
                  <div key={video.id} className='channel-video-card bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition'>

                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className='w-full aspect-video object-cover'
                    />

                    <div className='channel-video-content p-4'>

                      <h3 className='font-semibold line-clamp-2 mb-2'>
                        {video.title}
                      </h3>

                      <p className='text-sm text-gray-500 mb-1'>
                        {video.category}
                      </p>

                      <p className='text-sm text-gray-500 mb-4'>
                        {video.views} views
                      </p>

                      <div className='channel-video-actions flex gap-3'>

                        <button
                          type='button'
                          onClick={() => handleEdit(video)}
                          className='px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-sm'
                        >
                          Edit
                        </button>

                        <button
                          type='button'
                          onClick={() => handleDelete(video.id)}
                          className='px-4 py-2 rounded-full bg-red-100 hover:bg-red-200 text-red-600 text-sm'
                        >
                          Delete
                        </button>

                      </div>
                    </div>

                  </div>
                ))}

              </div>
            )}
          </div>

        </div>
      )}

      {/* Other Tabs */}
      {activeTab === 'Shorts' && (
        <p className='vc-nopost text-center py-16 text-gray-500'>
          No shorts uploaded yet.
        </p>
      )}

      {activeTab === 'Live' && (
        <p className='vc-nopost text-center py-16 text-gray-500'>
          No live streams yet.
        </p>
      )}

      {activeTab === 'Playlists' && (
        <p className='vc-nopost text-center py-16 text-gray-500'>
          No playlists created yet.
        </p>
      )}

      {activeTab === 'Community' && (
        <p className='vc-nopost text-center py-16 text-gray-500'>
          No community posts yet.
        </p>
      )}

    </div>
  );
}

export default Channel;