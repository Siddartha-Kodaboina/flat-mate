
import './App.css';
import './poppins.css';
import Header from './components/Header';
import Home from './components/Home';
import Vacancy from './components/create-vacancy-request/Vacancy';
import Community from './components/create-vacancy-request/Community';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App poppins-regular">
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/create-vacancy-request/vacancy" element={<Vacancy/>} />
          <Route path="/create-vacancy-request/community" element={<Community/>} />

          {/* <Route path="/create" element={currentUser ? <Create /> : <Navigate replace to="/login" />} />
          <Route path="/create-accommodation" element={currentUser ? <CreateAccommodation /> : <Navigate replace to="/login" />} />
          <Route path="/create-accommodation-request" element={currentUser ? <CreateAccommodationRequest /> : <Navigate replace to="/login" />} />
          <Route path="/create-accommodation-request-workflow" element={currentUser ? <CreateVacancyFlow /> : <Navigate replace to="/login" />} />
          <Route path="/settings" element={currentUser ? <Settings /> : <Navigate replace to="/login" />} />
          <Route path="/vacancy/:id" element={currentUser ? <VacancyPage/> : <Navigate replace to="/login" />} />
          <Route path="/login" element={!currentUser ? <Login /> : <Navigate replace to="/" />} /> */}
        </Routes>
      </Router>
    </div>


  );
}

export default App;
