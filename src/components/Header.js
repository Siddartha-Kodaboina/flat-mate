import React, { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { auth } from '../config/firebaseConfig';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="header fixed right-0 left-0 top-0 z-10 bg-white shadow-md bg-gradient-to-r from-cyan-500/20 to-blue-500/20 min-h-[10vh] flex flex-col">
      <div className="self-center flex flex-col md:flex-row justify-between w-[92%] mx-auto">
        <div className="flex flex-row justify-between items-center md:flex-row md:justify-between md:items-center min-h-[10vh]">
            <h2 className="text-[1.5rem] font-bold"><a href="/">Flat or Mate</a></h2>
            <div className="md:hidden" onClick={toggleMenu}>
              {isMenuOpen ? <CloseIcon className="text-3xl"/> : <MenuIcon className="text-3xl"/>}
            </div>
        </div>
        <div className={`flex flex-col bg-red md:flex md:flex-row md:px-4 md:space-x-6 justify-center items-center overflow-hidden transition-all duration-300 ease-linear ${isMenuOpen ? 'max-h-40 opacity-100 z-20' : 'max-h-0 opacity-0 md:opacity-100 md:max-h-full md:px-3'}`}>
          <a href="/" className="text-base hover:text-blue-700 py-2 md:py-0">Home</a>
          <a href="/create-vacancy-request/vacancy" className="text-base hover:text-blue-500 py-2 md:py-0">Create Request</a>
          <a href="/search" className="text-base hover:text-blue-700 py-2 md:py-0">Search</a>
          <a href="" className="text-base hover:text-blue-700 py-2 md:py-0" onClick={() => auth.signOut()}>Logout</a>
        </div>
      </div>
    </div>
  );
};

export default Header;
