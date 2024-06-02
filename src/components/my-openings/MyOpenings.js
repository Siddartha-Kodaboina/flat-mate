import React, { useState, useEffect } from 'react';
import OpeningList from './OpeningList';
import Loader from '../Loader'; 
import useFirebaseUser from '../../hooks/useFirebaseUser';

const MyOpenings = () => {
  const [openings, setOpenings] = useState([]);
  const [userId, setUserId] = useState(null);
  const [activeTab, setActiveTab] = useState('current');
  const [loading, setLoading] = useState(true);
  const [isClosing, setIsClosing] = useState(false);
  const [error, setError] = useState(null);
  const user = useFirebaseUser();
  const nodeBaseUrl = process.env.REACT_APP_NODE_ENV === 'development' 
    ? process.env.REACT_APP_LOCAL_NODE_BASE_URL
    : process.env.REACT_APP_PRODUCTION_NODE_BASE_URL;

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch(`${nodeBaseUrl}/api/v1/customers/uid/${user.uid}`);
        const data = await response.json();
        setUserId(data.id);
      } catch (err) {
        setError('Error fetching user data');
      }
    };
    if (user && user.uid) {
      fetchUserId();
    }
  }, [user, nodeBaseUrl]);

  useEffect(() => {
    const fetchOpenings = async () => {
      setLoading(true);
      try {
        if (userId) {
          const url = `${nodeBaseUrl}/api/v1/openings/${userId}/${activeTab}`;          
          const response = await fetch(url);
          const data = await response.json();
          setOpenings(data.openings);
        }
      } catch (err) {
        setError('Error fetching openings');
      } finally {
        setLoading(false);
      }
    };
    fetchOpenings();
  }, [userId, activeTab, nodeBaseUrl]);

  const handleClose = async (id) => {
    setIsClosing(true);
    try {
      const response = await fetch(`${nodeBaseUrl}/api/v1/vacancies/id/${id}/closed`);
      if (!response.ok) {
        throw new Error('Failed to close vacancy');
      }
      const closedOpening = await response.json();
      setOpenings(openings.filter(opening => opening.id !== id));
      if (activeTab === 'closed') {
        setOpenings([...openings, closedOpening]);
      }
    } catch (err) {
      setError('Error closing vacancy');
    } finally {
      setIsClosing(false);
    }
  };

  if (loading || isClosing) {
    return <Loader />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="mt-4 my-openings-container mx-auto w-full lg:w-4/5">
      <div className="tabs flex justify-around mb-4 bg-gray-200 p-2 rounded shadow-md">
        <button
          className={`tab ${activeTab === 'current' ? 'active bg-blue-500 text-white' : 'bg-white'} p-2 rounded transition-all duration-200`}
          onClick={() => setActiveTab('current')}
        >
          Current Openings
        </button>
        <button
          className={`tab ${activeTab === 'closed' ? 'active bg-blue-500 text-white' : 'bg-white'} p-2 rounded transition-all duration-200`}
          onClick={() => setActiveTab('closed')}
        >
          Closed Openings
        </button>
      </div>
      <OpeningList openings={openings} isCurrent={activeTab === 'current'} onClose={handleClose} isClosing={isClosing} />
    </div>
  );
};

export default MyOpenings;
