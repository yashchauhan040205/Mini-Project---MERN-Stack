import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';
import { useEffect } from 'react';

const Notification = ({ type, message, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  // Determine icon based on notification type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <FaCheckCircle size={20} />;
      case 'error':
        return <FaTimesCircle size={20} />;
      case 'warning':
        return <FaExclamationCircle size={20} />;
      default:
        return <FaCheckCircle size={20} />;
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`notification notification-${type}`}
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -20, x: '-50%' }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          <div className="notification-icon">
            {getIcon()}
          </div>
          <div className="notification-message">
            {message}
          </div>
          <motion.button
            className="notification-close"
            onClick={onClose}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <FaTimes size={14} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Notification; 