import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../../index.css';

const CommunitiesList = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const city = searchParams.get('city'); // Directly use city from searchParams
    const [flats, setFlats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activePhotos, setActivePhotos] = useState({});
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

    const fetchFlats = async (city) => {
        setIsLoading(true);
        let apiUrl = `${nodeBaseUrl}/api/v1/vacancies/filters?city=${encodeURIComponent(city)}`;
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (response.ok) {
                const fetchedFlats = data.filteredVacanciesFullDetails || [];
                setFlats(fetchedFlats);
                const initialActivePhotos = {};
                fetchedFlats.forEach(flat => {
                    initialActivePhotos[flat.communityObject.id] = 0; // Set first photo as active
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
        navigate(`/rooms?community_id=${community_id}`);
    }

    return (
        <div>
            {isLoading ? (
                <h1>Loading...</h1>
            ) : (
                <div>
                    <div className='p-5 text-center bg-gradient-to-r from-sky-500 to-indigo-500 '>
                        <h1 className='text-white text-lg'>Flats in {city}</h1>
                    </div>
                    {flats.length > 0 ? (
                        <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-3 xs:grid-cols-2 gap-4">
                            {flats.map((flat, index) => (
                                <div key={index} className='m-2 mb-5 cursor-pointer' onClick={()=>handleCommunityClick(flat.communityObject.id)}>
                                    <img 
                                        className="w-full h-64 object-cover" 
                                        id={flat.communityObject.id.toString()} 
                                        src={flat.communityObject.photos[0][2]} 
                                        alt={flat.communityObject.title} 
                                    />
                                    <div className='relative w-full justify-center flex -mt-4'>
                                        {flat.communityObject.photos.map((photo, photoIndex) => (
                                            <button 
                                                key={photoIndex} 
                                                className={`mr-2 w-2 h-2 rounded-full ${
                                                    activePhotos[flat.communityObject.id] === photoIndex ? 'bg-white' : 'bg-gray-300 opacity-50'
                                                }`}
                                                onClick={() => alterCommunityPhoto(flat.communityObject.id.toString(), photoIndex, photo[2])}
                                            />
                                        ))}
                                    </div>
                                    <div className='pl-2 pr-2 flex justify-between   mt-4 text-center'>
                                        <h1>{flat.communityObject.title}</h1>
                                        <h3>slots: 1</h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No flats available.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommunitiesList;
