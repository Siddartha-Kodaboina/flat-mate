import React from 'react';
import { useNavigate } from 'react-router-dom';

const OpeningCard = ({ opening, isCurrent, onClose, isClosing }) => {
  const navigate = useNavigate();
  const nodeBaseUrl = process.env.REACT_APP_NODE_ENV === 'development' 
    ? process.env.REACT_APP_LOCAL_NODE_BASE_URL
    : process.env.REACT_APP_PRODUCTION_NODE_BASE_URL;

  const handleCardClick = () => {
    if (isCurrent) {
      navigate(`/rooms?community_id=${opening.communityId}`);
    }
  };

  const handleCloseClick = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${nodeBaseUrl}/api/v1/vacancies/close/${opening.id}`, {
        method: 'POST',
      });
      if (response.ok) {
        onClose(opening.id);
      } else {
        console.error('Error closing vacancy');
      }
    } catch (error) {
      console.error('Error closing vacancy:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div
      className={`opening-card p-4 rounded shadow-md bg-white hover:shadow-lg transition-shadow duration-200 ${isCurrent ? 'cursor-pointer' : ''}`}
      onClick={handleCardClick}
    >
      {opening.Community && opening.Community.photos && opening.Community.photos.length > 0 && (
        <img src={opening.Community.photos[0]} alt="Community" className="w-full h-48 object-cover rounded mb-2" />
      )}
      <div className="opening-info">
        <h3 className="text-lg font-semibold">{opening.Community.title}</h3>
        {isCurrent && <p>Starting from: {formatDate(opening.from)}</p>}
        {isCurrent && (
          <button className="mt-2 bg-red-500 text-white py-1 px-2 rounded" onClick={handleCloseClick} disabled={isClosing}>
            {isClosing ? 'Closing...' : 'Close Opening'}
          </button>
        )}
        {!isCurrent && (
          <p>Closed on: {formatDate(opening.updatedAt)}</p>
        )}
      </div>
    </div>
  );
};

export default OpeningCard;
