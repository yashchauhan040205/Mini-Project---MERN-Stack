import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaYoutube, FaHome, FaPlus, FaSearch, FaTimes } from 'react-icons/fa';
import { useState, useEffect, useRef } from 'react';

function Navbar({ darkMode, toggleDarkMode, activeTab, setActiveTab, onSearch, searchQuery }) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (isSearchActive && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchActive]);

  useEffect(() => {
    setLocalSearchQuery(searchQuery || '');
  }, [searchQuery]);
  
  const navItems = [
    { id: 'home', label: 'Home', icon: <FaHome /> },
    { id: 'add', label: 'Add Video', icon: <FaPlus /> }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    // Debounce search
    const timer = setTimeout(() => {
      onSearch(value);
    }, 300);
    return () => clearTimeout(timer);
  };

  const toggleSearchActive = () => {
    if (isSearchActive && localSearchQuery) {
      // Clear search when closing
      setLocalSearchQuery('');
      onSearch('');
    }
    setIsSearchActive(!isSearchActive);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsSearchActive(false);
      setLocalSearchQuery('');
      onSearch('');
    }
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="navbar-container">
        <motion.div 
          className="navbar-logo"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTab('home')}
        >
          <FaYoutube size={28} />
          <span>VideoHub</span>
        </motion.div>

        <div className="navbar-links">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              className={`navbar-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="navbar-icon">{item.icon}</span>
              <span className="navbar-label">{item.label}</span>
              {activeTab === item.id && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeIndicator"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
        
        <div className="navbar-actions">
          <motion.div 
            className={`search-bar ${isSearchActive ? 'active' : ''}`}
            initial={false}
            animate={isSearchActive 
              ? { width: '250px', opacity: 1 } 
              : { width: '40px', opacity: 0.9 }
            }
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search videos..." 
              className={isSearchActive ? 'active' : ''}
              value={localSearchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
            {isSearchActive && localSearchQuery && (
              <motion.button
                className="clear-search"
                onClick={() => {
                  setLocalSearchQuery('');
                  onSearch('');
                  searchInputRef.current.focus();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTimes size={14} />
              </motion.button>
            )}
            <motion.button
              className="search-button"
              onClick={toggleSearchActive}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaSearch size={16} />
            </motion.button>
          </motion.div>
          
          <motion.button
            className="navbar-theme-toggle"
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <FaSun color="#f1c40f" size={20} /> : <FaMoon color="#6c5ce7" size={20} />}
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar; 