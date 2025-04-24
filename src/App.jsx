import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';
import VideoList from './components/VideoList';
import AddVideoForm from './components/AddVideoForm';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchVideos();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  useEffect(() => {
    // Filter videos based on search query
    if (searchQuery.trim() === '') {
      setFilteredVideos(videos);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = videos.filter(video => 
        video.title.toLowerCase().includes(query) || 
        video.category.toLowerCase().includes(query)
      );
      setFilteredVideos(filtered);
    }
  }, [searchQuery, videos]);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  // Clear notification after timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
  };

  const fetchVideos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/videos');
      setVideos(response.data);
      setFilteredVideos(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setError('Failed to load videos. Please try again later.');
      showNotification('Failed to load videos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addVideo = async (videoData) => {
    try {
      await axios.post('http://localhost:5000/api/videos', videoData);
      fetchVideos();
      setActiveTab('home'); // Switch to home tab after adding a video
      showNotification('Video added successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error adding video:', error);
      showNotification('Failed to add video', 'error');
      throw error;
    }
  };

  const deleteVideo = async (videoId) => {
    if (!videoId) return;
    
    console.log('Attempting to delete video with ID:', videoId);
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      console.log('Sending DELETE request to:', `http://localhost:5000/api/videos/${videoId}`);
      const response = await axios.delete(`http://localhost:5000/api/videos/${videoId}`);
      console.log('Delete response:', response);
      
      // Update the videos state by filtering out the deleted video
      setVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
      
      // Update filtered videos as well
      setFilteredVideos(prevVideos => prevVideos.filter(video => video._id !== videoId));
      
      showNotification('Video deleted successfully', 'success');
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      console.error('Error details:', error.response ? error.response.data : 'No response data');
      setDeleteError('Failed to delete video. Please try again.');
      showNotification('Failed to delete video', 'error');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const renderContent = () => {
    if (activeTab === 'add') {
      return <AddVideoForm onAddVideo={addVideo} />;
    }

    return (
      <div className="home-container">
        {loading ? (
          <motion.div 
            className="loader"
            exit={{ opacity: 0 }}
            key="loader"
          >
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            key="error"
          >
            {error}
          </motion.div>
        ) : (
          <>
            <div className="section-header">
              <h2>Browse Videos</h2>
              <div className="video-count">
                {filteredVideos.length} {filteredVideos.length === 1 ? 'video' : 'videos'}
                {searchQuery && ` for "${searchQuery}"`}
              </div>
            </div>
            {filteredVideos.length === 0 && searchQuery ? (
              <motion.div 
                className="empty-search"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3>No videos match your search</h3>
                <p>Try different keywords or clear your search</p>
                <motion.button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Clear Search
                </motion.button>
              </motion.div>
            ) : (
              <VideoList 
                videos={filteredVideos} 
                searchQuery={searchQuery} 
                onDelete={deleteVideo}
                isDeleting={isDeleting}
                key="video-list" 
              />
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="app">
      <Navbar 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode} 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />
      <div className="container">
        <AnimatePresence>
          {notification && (
            <motion.div 
              className={`notification notification-${notification.type}`}
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              {notification.message}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div 
          className="app-wrapper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="content-area"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

export default App; 