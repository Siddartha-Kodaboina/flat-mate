import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SearchResults = ({ results }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(results.length / itemsPerPage);

    useEffect(() => {
        setCurrentPage(parseInt(searchParams.get('page')) || 1);
    }, [searchParams]);

    const handleCommunityClick = (community_id) => {
        navigate(`/rooms?community_id=${community_id}&page=1`);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        searchParams.set('page', newPage);
        navigate(`/search?query=${searchParams.get('query')}&page=${newPage}`);
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
            pages.push(
                <button
                    key={i}
                    className={`p-2 ${i === currentPage ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </button>
            );
        }
        return (
            <div className="flex justify-center space-x-2 mt-4">
                {currentPage > 1 && (
                    <button className="p-2 bg-gray-200" onClick={() => handlePageChange(currentPage - 1)}>
                        Prev
                    </button>
                )}
                {pages}
                {currentPage < totalPages && (
                    <button className="p-2 bg-gray-200" onClick={() => handlePageChange(currentPage + 1)}>
                        Next
                    </button>
                )}
            </div>
        );
    };

    const paginatedResults = results.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {Array.isArray(paginatedResults) && paginatedResults.map((result) => (
                    <div 
                        key={result.id} 
                        className="bg-white shadow-md rounded-md overflow-hidden cursor-pointer" 
                        onClick={() => handleCommunityClick(result.id)}
                    >
                        <img src={result.photos[0]} alt={result.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{result.title}</h3>
                            <p className="text-gray-600">Slots: {result.openings}</p>
                        </div>
                    </div>
                ))}
            </div>
            {totalPages>1 && renderPagination()}
        </div>
    );
};

export default SearchResults;
