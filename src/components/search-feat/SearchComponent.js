import React, { useState } from 'react';

const SearchComponent = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSearch = () => {
        onSearch(query);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search for communities, cities, or users"
                className="border p-2 rounded-md w-full"
            />
            <button
                onClick={handleSearch}
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
                Search
            </button>
        </div>
    );
};

export default SearchComponent;
