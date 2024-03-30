import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { updateVacancy } from '../../features/vacancySlice'; 

const Vacancy = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { vacancy } = useSelector((state) => state.vacancy);
  const [formState, setFormState] = useState(vacancy);
  const [selectedOptions, setSelectedOptions] = useState(vacancy.requirements ? vacancy.requirements.split(', ') : []);
  const [fileContent, setFileContent] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const filePath = 'http://localhost:3000/tenant-requirements.txt';

    fetch(filePath)
      .then(response => response.text())
      .then(text => {
        setFileContent(text.split('\n').map((line, index) => ({id: index + 1, option_value: line.trim()})));
      })
      .catch(error => {
        console.error('Error fetching the room-amenities-options.txt file:', error);
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
    setFormState(vacancy);
    setSelectedOptions(vacancy.requirements ? vacancy.requirements.split(', ') : []);
  }, [vacancy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormState = { ...formState, [name]: value };
    setFormState(updatedFormState);
  };

  const handleCheckboxChange = (option_value) => {
    const currentIndex = selectedOptions.indexOf(option_value);
    const newSelectedOptions = [...selectedOptions];

    if (currentIndex === -1) {
      newSelectedOptions.push(option_value);
    } else {
      newSelectedOptions.splice(currentIndex, 1);
    }

    setSelectedOptions(newSelectedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateVacancy({...formState, requirements: selectedOptions.join(', ')}));
    navigate('/create-vacancy-request/community');
  };

  return (
    <div className="p-4 md:flex md:align-center md:justify-center md:p-8">
      <div className="md:w-3/6">
        <h2 className="text-lg md:text-2xl font-bold mb-4">Vacancy Details Form</h2>
        <form className="vacancy-details-container" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="from" className="block text-sm font-medium text-gray-700">From</label>
            <input 
              type="date" 
              name="from" 
              id="from"
              value={formState.from}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
              <label htmlFor="to" className="block text-sm font-medium text-gray-700">To</label>
              <input 
                type="date" 
                name="to" 
                id="to"
                value={formState.to}
                onChange={handleChange} 
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
          </div>
          <div className="mb-4">
            <label htmlFor="tenantRequirements" className="block text-sm font-medium text-gray-700">Tenant Requirements</label>
            <div className="relative">
              <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="mt-1 block bg-white w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-left">
                {selectedOptions.length > 0 ? selectedOptions.join(', ') : "Select Tenant Requirements"}
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
                        checked={selectedOptions.includes(amenity.option_value)} 
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
          {/* Submit Button */}
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

export default Vacancy;
