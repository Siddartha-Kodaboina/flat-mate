import React, {useState, useEffect} from 'react';
import './App.css';
import './poppins.css';
import Header from './components/Header';
import Home from './components/Home';
import City from './components/City';
import CommunitiesList from './components/flat-listing/CommunitiesList';
import RoomsList from './components/flat-listing/RoomsList';
import Vacancy from './components/create-vacancy-request/Vacancy';
import Community from './components/create-vacancy-request/Community';
import Room from './components/create-vacancy-request/Room';
import useFirebaseUser from './hooks/useFirebaseUser'; 
import Login from './components/auth-components/Login';
import ForgotPassword from './components/auth-components/ForgotPassword';
import ResetPassword from './components/auth-components/ResetPassword';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  const [isMapsScriptLoaded, setIsMapsScriptLoaded] = useState(false);
  const [isAuthCheckComplete, setIsAuthCheckComplete] = useState(false);
  const user = useFirebaseUser();
  const maxWaitTimes = 10;
  let waitTimes = 0;
  const nodeBaseUrl = process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_NODE_BASE_URL: process.env.REACT_APP_PRODUCTION_NODE_BASE_URL;
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_FIREBASE_API_KEY}&libraries=places`;
    script.async = true;script.defer = true;
    document.body.appendChild(script);
    script.onload = () => setIsMapsScriptLoaded(true);
    script.onerror = () => console.error('Google Maps script failed to load.');

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Function to check user authentication status
    const checkAuthStatus = () => {
      if (user || waitTimes >= maxWaitTimes) {
        setIsAuthCheckComplete(true);
      } else {
        waitTimes++;
        setTimeout(checkAuthStatus, 200);
      }
    };

    checkAuthStatus();

    return () => {
    };
  }, [user]);

  useEffect(()=> {}, [isMapsScriptLoaded, user]);

  if (!isMapsScriptLoaded || (!user && !isAuthCheckComplete)) {
    return <div>Loading...</div>;
  }

  if (!user){
    const pass100 = async () => {
      await setTimeout(()=>{

      }, 100);
    }

    pass100();
  }

  return (
    <div className="App poppins-regular">
      
        <Header />
        <div className="routes pt-[10vh]">
          <Router>
              <Routes>
                <Route path="/" element={user ? <Home/> : <Navigate replace to="/login" />} />
                <Route path="/city/:cityName" element={user ? <City /> : <Navigate replace to="/login" />} />
                <Route path="/communities" element={user ? <CommunitiesList /> : <Navigate replace to="/login" />} />
                <Route path="/rooms" element={user ? <RoomsList /> : <Navigate replace to="/login" />} />
                <Route path="/create-vacancy-request/vacancy" element={user ? <Vacancy/> : <Navigate replace to="/login" />} />
                <Route path="/create-vacancy-request/community" element={user ? <Community/> : <Navigate replace to="/login" />} />
                <Route path="/create-vacancy-request/room" element={user ? <Room/> : <Navigate replace to="/login" />} />
                <Route path="/login" element={!user ? <Login /> : <Navigate replace to="/" />} />
                <Route path="/forgot-password" element={!user? <ForgotPassword/>: <Navigate replace to="/"/>}/>
                <Route path="/reset-password" element={!user? <ResetPassword/>: <Navigate replace to="/"/>}/>
              </Routes>
          </Router>

        </div>
        
      
    </div>


  );
}

export default App;
