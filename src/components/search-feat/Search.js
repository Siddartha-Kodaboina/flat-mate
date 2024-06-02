import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import SearchComponent from './SearchComponent';
import SearchResults from './SearchResults';
import Loader from '../Loader';

const Search = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const navigate = useNavigate();

    const nodeBaseUrl = process.env.REACT_APP_NODE_ENV === 'development'
        ? process.env.REACT_APP_LOCAL_NODE_BASE_URL
        : process.env.REACT_APP_PRODUCTION_NODE_BASE_URL;

    const handleSearch = async (query) => {
        setLoading(true); // Show loader
        setNoResults(false); // Reset no results state
        setSearchParams({ query }); // Update the query string in the URL

        try {
            const response = await fetch(`${nodeBaseUrl}/api/v1/search?query=${encodeURIComponent(query)}`);
            const data = await response.json();
            if (!Array.isArray(data) || data.length === 0) {
                setNoResults(true); // Set no results state
            } else {
                setSearchResults(data);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }

        setLoading(false); // Hide loader
    };

    useEffect(() => {
        if (query) {
            handleSearch(query);
        }
    }, [query]);

    return (
        <div className="p-4">
            <SearchComponent onSearch={handleSearch} />
            {loading ? (
                <Loader />
            ) : noResults ? (
                <p className="text-center text-gray-600">No results found.</p>
            ) : (
                <SearchResults results={searchResults} />
            )}
        </div>
    );
};

export default Search;
