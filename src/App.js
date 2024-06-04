import React, { useState, useEffect } from 'react';
import './App.css';
import './poppins.css';
import Header from './components/Header';
import Home from './components/Home';
import City from './components/City';
import TestFirebase from './components/TestFirebase';
import CommunitiesList from './components/flat-listing/CommunitiesList';
import RoomsList from './components/flat-listing/RoomsList';
import Messaging from './components/chat-system/Messaging';
import Search from './components/search-feat/Search';
import Vacancy from './components/create-vacancy-request/Vacancy';
import Community from './components/create-vacancy-request/Community';
import Room from './components/create-vacancy-request/Room';
import useFirebaseUser from './hooks/useFirebaseUser';
import Login from './components/auth-components/Login';
import ForgotPassword from './components/auth-components/ForgotPassword';
import ResetPassword from './components/auth-components/ResetPassword';
import MyOpenings from './components/my-openings/MyOpenings';
import Loader from './components/Loader';
import About from './components/About';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [isMapsScriptLoaded, setIsMapsScriptLoaded] = useState(false);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const user = useFirebaseUser();
  const maxWaitTimes = 10;
  let waitTimes = 0;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_FIREBASE_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => setIsMapsScriptLoaded(true);
    script.onerror = () => console.error('Google Maps script failed to load.');

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    const checkAuthStatus = () => {
      if (user || waitTimes >= maxWaitTimes) {
        setIsAuthCheckComplete(true);
      } else {
        waitTimes++;
        setTimeout(checkAuthStatus, 200);
      }
    };

    checkAuthStatus();
  }, [user]);

  if (!isMapsScriptLoaded || (!user && !isAuthCheckComplete)) {
    return <Loader />;
  }

  return (
    <div className="App poppins-regular">
      <div className="routes pt-[10vh]">
        <Router>
          {<Header />}
          <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate replace to="/login" />} />
            <Route path="/test-firebase" element={user ? <TestFirebase /> : <Navigate replace to="/login" />} />
            <Route path="/city/:cityName" element={user ? <City /> : <Navigate replace to="/login" />} />
            <Route path="/communities" element={user ? <CommunitiesList /> : <Navigate replace to="/login" />} />
            <Route path="/rooms" element={user ? <RoomsList /> : <Navigate replace to="/login" />} />
            <Route path="/messaging" element={user ? <Messaging /> : <Navigate replace to="/login" />} />
            <Route path="/search" element={user ? <Search /> : <Navigate replace to="/login" />} />
            <Route path="/create-vacancy-request/vacancy" element={user ? <Vacancy /> : <Navigate replace to="/login" />} />
            <Route path="/create-vacancy-request/community" element={user ? <Community /> : <Navigate replace to="/login" />} />
            <Route path="/create-vacancy-request/room" element={user ? <Room /> : <Navigate replace to="/login" />} />
            <Route path="/openings" element={user ? <MyOpenings /> : <Navigate replace to="/login" />} />
            <Route path="/login" element={!user ? <Login /> : <Navigate replace to="/" />} />
            <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate replace to="/" />} />
            <Route path="/reset-password" element={!user ? <ResetPassword /> : <Navigate replace to="/" />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
