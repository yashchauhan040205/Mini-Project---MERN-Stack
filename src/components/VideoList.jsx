import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaYoutube, FaClock, FaTag, FaTrash, FaTimes } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';

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

// Delete confirmation modal component
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, videoTitle, isDeleting }) {
  if (!isOpen) return null;

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="modal-content"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        <div className="modal-header">
          <h3>Confirm Deletion</h3>
          <motion.button 
            className="modal-close"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isDeleting}
          >
            <FaTimes />
          </motion.button>
        </div>
        <div className="modal-body">
          <p>Are you sure you want to delete the video:</p>
          <p className="modal-title">{videoTitle}</p>
          <p className="modal-warning">This action cannot be undone!</p>
        </div>
        <div className="modal-footer">
          <motion.button 
            className="btn-cancel"
            onClick={onClose}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isDeleting}
          >
            Cancel
          </motion.button>
          <motion.button 
            className="btn-delete"
            onClick={onConfirm}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function VideoList({ videos, searchQuery, onDelete, isDeleting }) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

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

  // Handle opening the confirmation modal
  const handleDeleteClick = (video) => {
    setVideoToDelete(video);
    setDeleteModalOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = async () => {
    if (!videoToDelete) return;
    
    const success = await onDelete(videoToDelete._id);
    if (success) {
      setDeleteModalOpen(false);
      setVideoToDelete(null);
    }
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
    <>
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
                  <div className="card-actions">
                    <motion.button
                      className="delete-button"
                      onClick={() => handleDeleteClick(video)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete video"
                    >
                      <FaTrash size={14} />
                    </motion.button>
                  </div>
                  
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

      <AnimatePresence>
        {deleteModalOpen && (
          <DeleteConfirmationModal
            isOpen={deleteModalOpen}
            onClose={() => setDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            videoTitle={videoToDelete?.title}
            isDeleting={isDeleting}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default VideoList; 