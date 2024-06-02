import React from 'react';
import { useNavigate } from 'react-router-dom';

const SearchResults = ({ results }) => {
    const navigate = useNavigate();

    const handleCommunityClick = (community_id) => {
        navigate(`/rooms?community_id=${community_id}`);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {Array.isArray(results) && results.map((result) => (
                <div 
                    key={result.id} 
                    className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer" 
                    onClick={() => handleCommunityClick(result.id)} // Add this line
                >
                    <img src={result.photos[0]} alt={result.title} className="w-full h-48 object-cover" />
                    <div className="p-4">
                        <h3 className="text-lg font-semibold">{result.title}</h3>
                        <p className="text-gray-600">Slots: {result.openings}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;
