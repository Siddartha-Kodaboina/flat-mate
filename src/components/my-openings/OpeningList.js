import React from 'react';
import OpeningCard from './OpeningCard';

const OpeningList = ({ openings, isCurrent, onClose, isClosing }) => {
  if (!openings || openings.length === 0) {
    return (
      <div className="flex justify-center items-center h-[78vh] text-gray-500">
        {isCurrent ? 'No current openings available.' : 'No closed openings available.'}
      </div>
    );
  }

  return (
    <div className="opening-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {openings.slice().reverse().map((opening) => (
        <OpeningCard key={opening.id} opening={opening} isCurrent={isCurrent} onClose={onClose} isClosing={isClosing} />
      ))}
    </div>
  );
};

export default OpeningList;
