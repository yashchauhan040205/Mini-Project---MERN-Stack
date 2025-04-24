import { motion } from 'framer-motion';
import { FaPlay, FaYoutube, FaClock, FaTag } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

// Component to highlight search terms
function HighlightedText({ text, searchQuery }) {
  if (!searchQuery || searchQuery.trim() === '') {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));

  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === searchQuery.toLowerCase() 
          ? <span key={i} className="highlight">{part}</span> 
          : part
      )}
    </span>
  );
}

function VideoList({ videos, searchQuery }) {
  // Function to extract video ID from YouTube URL
  const getYouTubeThumbnail = (url) => {
    let videoId = '';
    
    // Extract video ID based on URL format
    if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(new URL(url).search);
      videoId = urlParams.get('v');
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  };

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  // Animation variants for items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div 
      className="video-list"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {videos.length === 0 ? (
        <motion.div 
          className="empty-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          No videos available. Add your first video!
        </motion.div>
      ) : (
        videos.map((video) => {
          const thumbnailUrl = getYouTubeThumbnail(video.link);
          const dateAdded = video.createdAt ? formatDistanceToNow(new Date(video.createdAt), { addSuffix: true }) : 'Recently added';
          
          return (
            <motion.div 
              key={video._id} 
              className="video-card"
              variants={itemVariants}
              whileHover="hover"
              layout
            >
              <div className="card-content">
                {thumbnailUrl && (
                  <motion.div 
                    className="thumbnail-container"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a 
                      href={video.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="thumbnail-link"
                    >
                      <div 
                        className="video-thumbnail" 
                        style={{ backgroundImage: `url(${thumbnailUrl})` }}
                      >
                        <div className="thumbnail-overlay">
                          <div className="play-icon">
                            <FaPlay size={18} color="#ffffff" />
                          </div>
                        </div>
                      </div>
                    </a>
                  </motion.div>
                )}
                
                <div className="video-info">
                  <div className="video-meta">
                    <motion.div 
                      className="category-badge"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTag size={10} />
                      <HighlightedText 
                        text={video.category} 
                        searchQuery={searchQuery}
                      />
                    </motion.div>
                    
                    <div className="time-added">
                      <FaClock size={12} />
                      <span>{dateAdded}</span>
                    </div>
                  </div>
                  
                  <motion.h3 layout className="video-title">
                    <HighlightedText 
                      text={video.title} 
                      searchQuery={searchQuery}
                    />
                  </motion.h3>
                  
                  <motion.a
                    href={video.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="watch-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaYoutube size={18} />
                    Watch Video
                  </motion.a>
                </div>
              </div>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
}

export default VideoList; 