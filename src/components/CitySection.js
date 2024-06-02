import React, { useState, useEffect, useRef } from 'react';
import useWindowSize from '../hooks/useWindowSize';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';


const CitySection = () => {
  const navigate = useNavigate();
  const [cities, setCities] = useState([]);
  const sliderRef = useRef(null);
  const { width } = useWindowSize();
  const rightArrow = '>';
  const leftArrow = '<';
  const reactBaseUrl =  process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_REACT_BASE_URL: process.env.REACT_APP_PRODUCTION_REACT_BASE_URL;
  useEffect(() => {
    const fetchedCities = [
      'austin.jpeg', 
      'new-york.jpeg',
      'san-jose.jpeg',
      'San-Francisco.webp',
      'Los-Angeles.webp',
      'houston.jpeg', 
      'san-diego.jpeg', 
      'chicago.jpeg', 
      'las-vegas.jpeg',
      'seattle.jpeg',
      'phoenix.jpeg',
      'tampa.jpeg',
      'washington-dc.png',
    ];
    setCities(fetchedCities);
  }, []);

  const getNumberOfCityCards = () => {
    if (width < 640) return 1;
    if (width >= 640 && width < 768) return 3;
    return 4;
  };

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollContainer = sliderRef.current;
      const numberOfCityCards = getNumberOfCityCards();
      const cardWidth = scrollContainer.offsetWidth / numberOfCityCards;
      const scrollMove = numberOfCityCards>=3? 3*cardWidth: cardWidth;
      const scrollAmount = direction === 'left' ? -scrollMove : scrollMove;
      scrollContainer.scrollLeft += scrollAmount;
    }
  };

  const capitalizeWords = (str) => {
    return str
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleCityClick = (city) => {
    navigate(`/communities?city=${city}`);
  }

  return (
    <div className="relative flex items-center overflow-hidden my-8">
      <button
        // className={`absolute left-0 z-[15] m-2 bg-blue-500 text-white p-2 rounded`}
        className="absolute z-[15] left-0 z-10 bg-black bg-opacity-50 text-white p-4 rounded-full opacity-70 hover:opacity-100 transition-opacity duration-300"
        onClick={() => handleScroll('left')}
      >
        {leftArrow}
      </button>
      <div ref={sliderRef} className="flex w-full overflow-hidden scroll-smooth">
        {cities.map((city, index) => (
          
          <div key={index} className=" flex-shrink-0">
            <div className="
                w-full h-full rounded-md p-2 m-2 flex justify-center relative group ">
              <img className="w-[160px] h-[260px] object-cover rounded-md" src={`${reactBaseUrl}/images/cities/${city}`} alt={`City ${index}`} />
              <div className="relative w-[160px] h-[260px]  -ml-[160px] z-[10] 
                  inset-0 bg-black bg-opacity-50 opacity-75 cursor-pointer 
                  hover:opacity-0 transition-opacity duration-300 rounded-md"
                  onClick={()=>handleCityClick(capitalizeWords(city.split('.')[0]))}>
                    
              </div>
                        
              <p className="absolute top-[50%] left-[50%] transform 
                  -translate-x-1/2 
                  -translate-y-1/2 text-[#FFFFFF] text-center text-[0.9rem] font-bold 
                  group-hover:text-white group-hover:font-extrabold 
                  group-hover:translate-y-[70px] group-hover:pb-[1rem] transition-all duration-300">
                  {capitalizeWords(city.split('.')[0])}
              </p>
            </div>
          </div>
            
        ))}
      </div>
      <button
        // className={`absolute right-0 z-[15] m-2 bg-blue-500 text-white p-2 rounded`}
        className="absolute right-0 z-[15] bg-black bg-opacity-50 text-white p-4 rounded-full opacity-70 hover:opacity-100 transition-opacity duration-300"
        onClick={() => handleScroll('right')}
      >
        {rightArrow}
      </button>
    </div>
  );
};

export default CitySection;
