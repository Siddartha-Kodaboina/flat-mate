import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../index.css';
import Loader from '../Loader';

const CommunitiesList = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const city = searchParams.get('city');
    const [flats, setFlats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activePhotos, setActivePhotos] = useState({});
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
    const itemsPerPage = 9;
    const totalPages = Math.ceil(flats.length / itemsPerPage);
    const nodeBaseUrl = process.env.REACT_APP_NODE_ENV === 'development' 
        ? process.env.REACT_APP_LOCAL_NODE_BASE_URL
        : process.env.REACT_APP_PRODUCTION_NODE_BASE_URL;

    useEffect(() => {
        if (city) {
            fetchFlats(city);
        } else {
            setIsLoading(false);
        }
    }, [city]);

    useEffect(() => {
        setCurrentPage(parseInt(searchParams.get('page')) || 1);
    }, [searchParams]);

    const fetchFlats = async (city) => {
        setIsLoading(true);
        let apiUrl = `${nodeBaseUrl}/api/v1/vacancies/filters?city=${encodeURIComponent(city)}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (response.ok) {
                const fetchedFlats = data.filteredCommunitiesFullDetails || [];
                setFlats(fetchedFlats);
                const initialActivePhotos = {};
                fetchedFlats.forEach(flat => {
                    initialActivePhotos[flat.id] = 0; // Set first photo as active
                });
                setActivePhotos(initialActivePhotos);
            } else {
                throw new Error(data.message || "Failed to fetch flats");
            }
        } catch (error) {
            console.error('Error fetching the Flats Details:', error);
            setFlats([]); // Clear flats on error
        } finally {
            setIsLoading(false);
        }
    };

    const alterCommunityPhoto = (flatId, photoIndex, imageSrc) => {
        const newActivePhotos = { ...activePhotos, [flatId]: photoIndex };
        setActivePhotos(newActivePhotos);
        const imageElement = document.getElementById(flatId);
        if (imageElement) {
            imageElement.src = imageSrc;
        }
    };

    const handleCommunityClick = (community_id) => {
        navigate(`/rooms?community_id=${community_id}&page=1`);
    }

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        navigate(`/communities?city=${city}&page=${newPage}`);
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
            <div className="flex justify-center space-x-2">
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

    const paginatedFlats = flats.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="bg-sky-50 p-5 min-h-[90vh]">
            {isLoading ? (
                <Loader />
            ) : (
                <div>
                    <div className='p-5 text-center bg-gradient-to-r from-sky-500 to-indigo-500'>
                        <h1 className='text-white text-lg'>Flats in {city}</h1>
                    </div>
                    {paginatedFlats.length > 0 ? (
                        <div>
                            <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 gap-4">
                                {paginatedFlats.map((flat, index) => (
                                    <div 
                                        key={index} 
                                        className='m-2 mb-5 cursor-pointer bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300'
                                        onClick={() => handleCommunityClick(flat.id)}
                                    >
                                        <img 
                                            className="w-full h-64 object-cover" 
                                            id={flat.id.toString()} 
                                            src={flat.photos[0]} 
                                            alt={flat.title} 
                                        />
                                        <div className='p-4'>
                                            <h1 className='text-lg font-semibold'>{flat.title}</h1>
                                            <h3 className='text-gray-600'>Slots: {flat.openings}</h3>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {totalPages>1 && renderPagination()}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 mt-4">No flats available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommunitiesList;
