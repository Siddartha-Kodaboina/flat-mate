import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/Header.css';
import '../tailwind_styles.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="header bg-white shadow-md border-2 border-green-500 bg-gradient-to-r from-cyan-500/20 to-blue-500/20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center">
        <div className="flex px-2 flex-row justify-between items-center py-2">
          <h2 className="text-xl font-bold"><a href="/">Flat or Mate</a></h2>
          <div className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </div>
        </div>
        <div className={`flex flex-col bg-red md:flex md:flex-row md:px-4 md:space-x-6 justify-center items-center overflow-hidden transition-all duration-500 ease-linear ${isMenuOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 md:opacity-100 md:max-h-full md:px-3'}`}>
          <a href="/" className="text-base hover:text-blue-700 py-2 md:py-0">Home</a>
          <a href="/create-vacancy-request/vacancy" className="text-base hover:text-blue-500 py-2 md:py-0">Create Request</a>
          <a href="/search" className="text-base hover:text-blue-700 py-2 md:py-0">Search</a>
        </div>
      </div>
    </div>
  );
};

export default Header;
