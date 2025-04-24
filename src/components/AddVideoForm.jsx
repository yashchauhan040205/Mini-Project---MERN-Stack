import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaYoutube, FaList, FaHashtag } from 'react-icons/fa';

function AddVideoForm({ onAddVideo }) {
  const [formData, setFormData] = useState({
    title: '',
    link: '',
    category: ''
  });
  const [focused, setFocused] = useState({
    title: false,
    link: false,
    category: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ['Music', 'Education', 'Coding', 'Entertainment', 'News', 'Other'];

  const handleFocus = (field) => {
    setFocused({ ...focused, [field]: true });
  };

  const handleBlur = (field) => {
    setFocused({ ...focused, [field]: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.link || !formData.category) {
      alert('Please fill in all fields');
      return;
    }

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    if (!youtubeRegex.test(formData.link)) {
      alert('Please enter a valid YouTube URL');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onAddVideo(formData);
      setFormData({ title: '', link: '', category: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const inputVariants = {
    rest: { scale: 1 },
    focus: { scale: 1.02 }
  };

  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
    submitting: { 
      scale: [1, 1.03, 1],
      transition: { 
        repeat: Infinity,
        duration: 1
      }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="add-video-form"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        Add New Video
      </motion.h2>
      
      <div className="form-group">
        <motion.div 
          variants={inputVariants}
          animate={focused.title ? 'focus' : 'rest'}
          className="input-container"
        >
          <span className="icon-container">
            <FaHashtag color="#6c5ce7" size={16} />
          </span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onFocus={() => handleFocus('title')}
            onBlur={() => handleBlur('title')}
            placeholder="Video Title"
            required
          />
        </motion.div>
      </div>
      
      <div className="form-group">
        <motion.div 
          variants={inputVariants}
          animate={focused.link ? 'focus' : 'rest'}
          className="input-container"
        >
          <span className="icon-container">
            <FaYoutube color="#6c5ce7" size={16} />
          </span>
          <input
            type="url"
            name="link"
            value={formData.link}
            onChange={handleChange}
            onFocus={() => handleFocus('link')}
            onBlur={() => handleBlur('link')}
            placeholder="YouTube Link"
            required
          />
        </motion.div>
      </div>
      
      <div className="form-group">
        <motion.div 
          variants={inputVariants}
          animate={focused.category ? 'focus' : 'rest'}
          className="input-container"
        >
          <span className="icon-container">
            <FaList color="#6c5ce7" size={16} />
          </span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            onFocus={() => handleFocus('category')}
            onBlur={() => handleBlur('category')}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </motion.div>
      </div>
      
      <motion.button 
        type="submit"
        variants={buttonVariants}
        animate={isSubmitting ? 'submitting' : 'rest'}
        whileHover="hover"
        whileTap="tap"
        disabled={isSubmitting}
      >
        <span className="icon-container">
          <FaPlus size={16} />
        </span>
        {isSubmitting ? 'Adding...' : 'Add Video'}
      </motion.button>
    </motion.form>
  );
}

export default AddVideoForm; 