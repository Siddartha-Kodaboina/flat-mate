import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { updateCommunity } from '../../features/vacancySlice'; 

const Community = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { community } = useSelector((state) => state.vacancy);
  console.log(community);
  const [formState, setFormState] = useState(community);
  const [selectedAmenities, setSelectedAmenities] = useState(community.amenities ? community.amenities.split(', ') : []);
  const [fileContent, setFileContent] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const filePath = 'http://localhost:3000/community-amenities-options.txt';

    fetch(filePath)
      .then(response => response.text())
      .then(text => {
        setFileContent(text.split('\n').map((line, index) => ({id: index + 1, option_value: line.trim()})));
      })
      .catch(error => {
        console.error('Error fetching the community-amenities-optionst file:', error);
      });

    // Click outside handler
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setFormState(community);
    setSelectedAmenities(community.amenities ? community.amenities.split(', ') : []);
  }, [community]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormState = { ...formState, [name]: value };
    setFormState(updatedFormState);
  };

  const handleCheckboxChange = (option_value) => {
    const currentIndex = selectedAmenities.indexOf(option_value);
    const newSelectedAmenities = [...selectedAmenities];

    if (currentIndex === -1) {
        newSelectedAmenities.push(option_value);
    } else {
        newSelectedAmenities.splice(currentIndex, 1);
    }

    setSelectedAmenities(newSelectedAmenities);
  };

//   const 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFormState = {...formState, amenities: selectedAmenities.join(', ')}
    // await validateForm(newFormState);
    dispatch(updateCommunity(newFormState));
    navigate('/create-vacancy-request/vacancy');
  };

  return (
    <div className="p-4 md:flex md:align-center md:justify-center md:p-8">
      <div className="md:w-3/6">
        <h2 className="text-lg md:text-2xl font-bold mb-4">Community Details Form</h2>
        <form className="vacancy-details-container" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col">
            <label htmlFor="from" className="block text-sm font-medium text-gray-700">Housing Type <span className='text-rose-600 ml-1'>*</span></label>
            <div className='flex flex-row justify-start'>
                <div className='mr-4'>
                    <input 
                        type="radio" 
                        name="housingType" 
                        id="housingType-Community"
                        value="Community"
                        onChange={handleChange} 
                        checked={formState.housingType == "Community"}
                        className="mt-1 mr-2 align-center rounded-md p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="housingType-Community" className='text-sm'>Community</label>
                </div>

                <div>
                    <input 
                        type="radio" 
                        name="housingType" 
                        id="housingType-PrivateProperty"
                        value="Private Property"
                        onChange={handleChange}
                        checked={formState.housingType == "Private Property"}
                        className="mt-1 mr-2 self-center rounded-md p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <label htmlFor="housingType-PrivateProperty" className='text-sm'>Private Property</label>
                </div>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="from" className="block text-sm font-medium text-gray-700">Community Title<span className='text-rose-600 ml-1'>*</span></label>
            <input 
              type="text" 
              name="title" 
              id="title"
              placeholder='Enter community title'
              value={formState.title}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">Address<span className='text-rose-600 ml-1'>*</span></label>
              <input 
                type="text"
                name="address" 
                id="address"
                placeholder='Enter address'
                value={formState.address}
                onChange={handleChange} 
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
          </div>

          <div className="mb-4">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">city<span className='text-rose-600 ml-1'>*</span></label>
            <input 
              type="text" 
              name="city" 
              id="city"
              placeholder='Enter city'
              value={formState.city}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="state" className="block text-sm font-medium text-gray-700">State<span className='text-rose-600 ml-1'>*</span></label>
            <input 
              type="text" 
              name="state" 
              id="state"
              placeholder='Enter state'
              value={formState.state}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal Code<span className='text-rose-600 ml-1'>*</span></label>
            <input 
              type="text" 
              name="postalCode" 
              id="postalCode"
              placeholder='Enter postal code'
              value={formState.postalCode}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="communityAmenities" className="block text-sm font-medium text-gray-700">Community Amenities<span className='text-rose-600 ml-1'>*</span></label>
            <div className="relative">
              <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="mt-1 block bg-white w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-left">
                {selectedAmenities.length > 0 ? selectedAmenities.join(', ') : "Select Community Requirements"}
              </button>
              {isDropdownOpen && (
                <ul ref={dropdownRef} className="absolute z-10 w-full overflow-y-scroll bg-white mt-1 rounded-md border border-gray-300 shadow-lg" style={{height: '20vh'}}>
                  {fileContent.map((amenity) => (
                    <li key={amenity.id} className="p-2 hover:bg-gray-100 flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        id={`checkbox-${amenity.id}`} 
                        name="amenity" 
                        value={amenity.option_value} 
                        checked={selectedAmenities.includes(amenity.option_value)} 
                        onChange={() => handleCheckboxChange(amenity.option_value)} 
                        className="mr-2 cursor-pointer"
                      />
                      <label htmlFor={`checkbox-${amenity.id}`} className="flex-1  cursor-pointer">{amenity.option_value}</label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="averageRent" className="block text-sm font-medium text-gray-700">Average Rent in the community</label>
            <input 
              type="text" 
              name="averageRent" 
              id="averageRent"
              placeholder='Enter average rent'
              value={formState.averageRent}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="communityDescription" className="block text-sm font-medium text-gray-700">Any additinal information about community</label>
        
            <textarea
                name="communityDescription"
                id="communityDescription"
                placeholder="Enter additional information"
                rows="5" // Set the number of lines the textarea will display by default
                value={formState.communityDescription}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="websiteURL" className="block text-sm font-medium text-gray-700">Community Website URL</label>
            <input 
              type="text" 
              name="websiteURL" 
              id="websiteURL"
              placeholder='Enter community official website url'
              value={formState.websiteURL}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="bottom-buttons mt-4">
            <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Community;
