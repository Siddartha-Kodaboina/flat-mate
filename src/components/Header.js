import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { auth } from '../config/firebaseConfig';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="header fixed right-0 left-0 top-0 z-10 bg-white shadow-md bg-gradient-to-r from-cyan-500/20 to-blue-500/20 min-h-[10vh] flex flex-col">
      <div className="self-center flex flex-col md:flex-row justify-between w-[92%] mx-auto">
        <div className="flex flex-row justify-between items-center md:flex-row md:justify-between md:items-center min-h-[10vh]">
          <h2 className="text-[1.5rem] font-bold"><a href="/" className="hover:underline">Flat or Mate</a></h2>
          <div className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <CloseIcon className="text-3xl"/> : <MenuIcon className="text-3xl"/>}
          </div>
        </div>
        <div className={`flex flex-col md:flex md:flex-row md:px-4 md:space-x-6 justify-center items-center overflow-hidden transition-all duration-300 ease-linear ${isMenuOpen ? 'max-h-45 opacity-100 z-20' : 'max-h-0 opacity-0 md:opacity-100 md:max-h-full md:px-3'}`}>
          <a href="/" className={`text-base py-2 md:py-0 transition-all duration-300 ${isActive('/') ? 'border-blue-700 text-blue-700' : 'border-transparent hover:border-blue-700 hover:text-blue-700'}`}>Home</a>
          <a href="/create-vacancy-request/vacancy" className={`text-base py-2 md:py-0 transition-all duration-300 ${isActive('/create-vacancy-request') ? 'border-blue-700 text-blue-700' : 'border-transparent hover:border-blue-700 hover:text-blue-700'}`}>Create</a>
          <a href="/openings" className={`text-base py-2 md:py-0 transition-all duration-300 ${isActive('/openings') ? 'border-blue-700 text-blue-700' : 'border-transparent hover:border-blue-700 hover:text-blue-700'}`}>My Openings</a>
          <a href="/messaging" className={`text-base py-2 md:py-0 transition-all duration-300 ${isActive('/messaging') ? 'border-blue-700 text-blue-700' : 'border-transparent hover:border-blue-700 hover:text-blue-700'}`}>Messaging</a>
          <a href="/search" className={`text-base py-2 md:py-0 transition-all duration-300 ${isActive('/search') ? 'border-blue-700 text-blue-700' : 'border-transparent hover:border-blue-700 hover:text-blue-700'}`}>Search</a>
          <a href="" className="text-base py-2 md:py-0 border-transparent hover:border-blue-700 hover:text-blue-700 transition-all duration-300" onClick={() => auth.signOut()}>Logout</a>
        </div>
      </div>
    </div>
  );
};

export default Header;
