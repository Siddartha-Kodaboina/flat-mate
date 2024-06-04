import React from 'react';

import Typewriter from './Typewriter'; 
import CitySection from './CitySection'; 


const Home = () => {
  return (
    <div className='home '>
      <div className="bg-red h-[90vh] ">
        <div className="image-title-section overflow-x-hidden  overflow-y-clip h-full flex flex-col justify-around  md:flex-row md:justify-between md:items-center">
          <div className="
            title-section  flex flex-col justify-center 
            items-center mx-auto 
            md:relative md:h-[50vh] md:justify-start  flex-1">
            
            <div className="title-section-1 flex flex-col justify-center md:flex-row">
              <h1 className='text-[3rem] tracking-wide mx-auto'>Your Stay. </h1>
              <h1 className='text-[3em] tracking-wide text-[#00AEEF]'>Your way.</h1>
            </div>
            <div className="title-section-2 mt-[1em] md:mt-[1em] flex flex-row">
              <h1 className='text-[1.5rem] md:text-[2rem] pr-[1em] flex row'> <p className='pr-[1rem]'>Need a</p> <Typewriter texts={['Flat', 'Mate']} delay={2000} /><p className='pl-[1rem]'>?</p></h1>
            </div>
            <div className='hidden md:block md:w-[70%] mt-[2em]'>
              <p className='font-normal'>
                <span className='font-extrabold'>''</span>
                Discover budget-friendly living: your gateway to affordable, shared housing 
                tailored for international students. Save on rent, cherish camaraderie, and enjoy well-furnished spaces. 
                Find the perfect match for your preferences — be it a student or a 
                professional, vegetarian or non-vegetarian. Join FlatMate and transform your housing experience. <br /> Welcome home 👊!
                <span className='font-extrabold'>''</span>
              </p>
              
            </div>
          </div>
          <div className="image-section flex-1 flex justify-center ">
            <div className='w-full h-[28vh] overflow-y-visible -top-10 relative'>
              <img src="./images/hbg9.png" alt="Flate Mates Images" className='relative md:-top-[5vh] -left-5 object-cover scale-[1.45]'/>
              {/* <img src="./images/hbg-12-removebg-preview.png" alt="Flate Mates Images" /> */}
            </div>
            
            
          </div>
        </div>
      </div>
      <div className="page-2 px-[1em] pb-[10vh]">
        <div className="cities-section">
          
            {/* // for each file at ./images/cities
            // create a new city card */}
            {/* Add a a dull layer on the image/ on hover make it visible clearly */}
            {/* // <div className="city-card ">
              
            //   <img src="./images/city/${city_name}" alt={`${city_name}-image`} />
            // </div> */}
            <h1 className='text-[2rem] px-[1em]'>Popular Destinations</h1>
            <CitySection />
          
        </div>
      </div>
    </div>
  );
}

export default Home;

{/* <div className="relative -ml-[150px] w-[150px] h-[250px] inset-0 bg-black bg-opacity-75 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-md">
                <p className="text-white text-center text-lg font-bold">{city.split('.')[0]}</p>
              </div> */}