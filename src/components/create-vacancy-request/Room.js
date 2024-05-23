import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { updateRoom } from '../../features/vacancySlice'; 
import handleVacancyRequestSubmit from '../../utilities/handleVacancyRequestSubmit';
import useFirebaseUser from '../../hooks/useFirebaseUser'; 

const Room = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useFirebaseUser();
  const { room } = useSelector((state) => state.vacancy);
  const vacancy = useSelector((state) => state.vacancy);
  const [vacancyStore, setVacancyStore] = useState(vacancy);
  const [formState, setFormState] = useState(room);
  const [selectedAmenities, setSelectedAmenities] = useState(room.amenities ? room.amenities.split(', ') : []);
  const [selectedDo, setSelectedDo] = useState(room.do ? room.do.split(', ') : []);
  const [selectedDont, setSelectedDont] = useState(room.dont ? room.dont.split(', ') : []);

//   const [fileContent, setFileContent] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [dos, setDos] = useState([]);
  const [dont, setDont] = useState([]);

  // Amenities
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  //Do
  const [isDoDropdownOpen, setIsDoDropdownOpen] = useState(false);
  const doDropdownRef = useRef(null);

  //Dont
  const [isDontDropdownOpen, setIsDontDropdownOpen] = useState(false);
  const dontDropdownRef = useRef(null);

  //Confirm submit pop up
  const [isConfirmSubmitOpen, setIsConfirmSubmitOpen] = useState(false);
  const reactBaseUrl =  process.env.REACT_APP_NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_REACT_BASE_URL: process.env.REACT_APP_PRODUCTION_REACT_BASE_URL;
  useEffect(() => {
    
      const filePaths = [
        `${reactBaseUrl}/room-amenities-options.txt`,
        `${reactBaseUrl}/room-do.txt`,
        `${reactBaseUrl}/room-dont.txt`
      ];
    
      Promise.all(filePaths.map(filePath =>
        fetch(filePath).then(response => response.text())
      ))
      .then(filesContent => {
        const combinedData = filesContent.map((fileContent, fileIndex) => {
          return fileContent.split('\n').map((line, index) => ({
            id: fileIndex * 1000 + index + 1, 
            option_value: line
          }));
        });
        setAmenities(combinedData[0]);
        setDos(combinedData[1]);
        setDont(combinedData[2]);
      })
      .catch(error => {
        console.error('Error fetching the text files: ', error);
      });

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (doDropdownRef.current && !doDropdownRef.current.contains(event.target)) {
        setIsDoDropdownOpen(false);
      }
      if (dontDropdownRef.current && !dontDropdownRef.current.contains(event.target)) {
        setIsDontDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setFormState(room);
    setVacancyStore((prev)=>({...prev, room}));
    setSelectedAmenities(room.amenities ? room.amenities.split(', ') : []);
    setSelectedDo(room.do ? room.do.split(', ') : []);
    setSelectedDont(room.dont ? room.dont.split(', ') : []);
  }, [room]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormState = { ...formState, [name]: value };
    setFormState(updatedFormState);
  };

  const handleCheckboxChange = (option_value, selectedOptions, listName) => {
    const currentIndex = selectedOptions.indexOf(option_value);
    const newSelectedOptions = [...selectedOptions];

    if (currentIndex === -1) {
        newSelectedOptions.push(option_value);
    } else {
        newSelectedOptions.splice(currentIndex, 1);
    }

    switch (listName){
        case "amenities": {
            setSelectedAmenities(newSelectedOptions);
            break;
        }
        case "do": {
            setSelectedDo(newSelectedOptions);
            break;
        }
        case "dont": {
            setSelectedDont(newSelectedOptions);
            break;
        }
        default: {
            
        }
    }
    
  };

    const  validateForm = (formData) => {
        /* required elements should not be empty */
        const required = [
            "totalBedRooms",
            "bathRooms",
            "maleCount",
            "femaleCount",
            "sharingType",
            "monthlyRent",
            "utilitiesCost",
            "amenities"
        ];

        required.forEach(element => {
            if (!formData[element]) throw new Error(`${element} is required`);
        });

        /* elements that should only have digits */
        const digits = [
            "totalBedRooms",
            "maleCount",
            "femaleCount",
            "sharingType",
            "monthlyRent",
            "utilitiesCost"
        ]

        digits.forEach(element => {
            if(!/^\d*$/.test(formData[element])) throw new Error(`${element} should only have digits, and no decimal numbers!`);
        });

        /* elements that can have digits and can accept numbers rounded to one decimal place*/
        const decimalDigits = [
            "bathRooms"
        ]

        decimalDigits.forEach(element => {
            if(!/^\d+(\.\d)?$/.test(formData[element])) throw new Error(`${element} should have digits and can accept numbers rounded to one decimal place!`);
        });
    };

  const handleSubmit = async (isNext) => {
    const newFormState = {
        ...formState, 
        amenities: selectedAmenities.join(', '),
        do: selectedDo.join(', '),
        dont: selectedDont.join(', ')
    }
    let isValid = true;
    try{
        await validateForm(newFormState);
    }
    catch (err) {
        isValid = false;
        alert(err.message);
    }
    
    if (isValid){
        dispatch(updateRoom(newFormState));
        if (isNext){
            setIsConfirmSubmitOpen(true);
        }
        else{
            navigate('/create-vacancy-request/community');
        }
    }
  };

  const handleConfirm = async () => {
    setIsConfirmSubmitOpen(false);
    const result = await handleVacancyRequestSubmit({ ...vacancyStore, customer: user });
    if (result) {
        navigate('/');
    } else {
        alert(result);
    }
  };


  return (
    <div className="p-4 md:flex md:align-center md:justify-center md:p-8">
      <div className="md:w-3/6">
        <h2 className="text-lg md:text-2xl font-bold mb-4">Room Details Form</h2>
        <form className="vacancy-details-container" onSubmit={handleSubmit}>
        
          <div className="mb-4">
            <label htmlFor="totalBedRooms" className="block text-sm font-medium text-gray-700">Total Bedrooms (Only digits)<span className='text-rose-600 ml-1'>*</span></label>
            <input 
              type="text" 
              name="totalBedRooms" 
              id="totalBedRooms"
              placeholder='Enter number of bedrooms'
              value={formState.totalBedRooms}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
              <label htmlFor="bathRooms" className="block text-sm font-medium text-gray-700">Total Bathrooms (Only numbers and can accept numbers rounded to one decimal place)<span className='text-rose-600 ml-1'>*</span></label>
              <input 
                type="text"
                name="bathRooms" 
                id="bathRooms"
                placeholder='Enter number of bedrooms'
                value={formState.bathRooms}
                onChange={handleChange} 
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
          </div>

          <div className="mb-4">
            <label htmlFor="maleCount" className="block text-sm font-medium text-gray-700">Enter number of males (Only numbers)<span className='text-rose-600 ml-1'>*</span></label>
            <input 
              type="text" 
              name="maleCount" 
              id="maleCount"
              placeholder='Enter male count'
              value={formState.maleCount}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="femaleCount" className="block text-sm font-medium text-gray-700">Enter number of females (Only numbers)<span className='text-rose-600 ml-1'>*</span></label>
            <input 
              type="text" 
              name="femaleCount" 
              id="femaleCount"
              placeholder='Enter femle count'
              value={formState.femaleCount}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="sharingType" className="block text-sm font-medium text-gray-700">Enter Sharing Type, Eg: If two people sharing, enter 2 , (Only numbers)<span className='text-rose-600 ml-1'>*</span></label>
            <input 
              type="text"
              name="sharingType" 
              id="sharingType"
              placeholder='Enter sharing type'
              value={formState.sharingType}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="monthlyRent" className="block text-sm font-medium text-gray-700">Enter monthly rent guest/new-guy has to pay (Only numbers)<span className='text-rose-600 ml-1'>*</span></label>
            <input 
              type="text"
              name="monthlyRent" 
              id="monthlyRent"
              placeholder='Enter monthly rent'
              value={formState.monthlyRent}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="utilitiesCost" className="block text-sm font-medium text-gray-700">Enter monthly utilities cost guest/new-guy has to pay (Only numbers)<span className='text-rose-600 ml-1'>*</span></label>
            <input 
              type="text"
              name="utilitiesCost" 
              id="utilitiesCost"
              placeholder='Enter monthly uitlities cost'
              value={formState.utilitiesCost}
              onChange={handleChange} 
              className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="communityAmenities" className="block text-sm font-medium text-gray-700">Room Specific Amenities<span className='text-rose-600 ml-1'>*</span></label>
            <div className="relative">
              <button type="button" onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="mt-1 block bg-white w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-left">
                {selectedAmenities.length > 0 ? selectedAmenities.join(', ') : "Select Community Requirements"}
              </button>
              {isDropdownOpen && (
                <ul ref={dropdownRef} className="absolute z-10 w-full overflow-y-scroll bg-white mt-1 rounded-md border border-gray-300 shadow-lg" style={{height: '20vh'}}>
                  {amenities.map((amenity) => (
                    <li key={amenity.id} className="p-2 hover:bg-gray-100 flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        id={`checkbox-${amenity.id}`} 
                        name="amenity" 
                        value={amenity.option_value} 
                        checked={selectedAmenities.includes(amenity.option_value)} 
                        onChange={() => handleCheckboxChange(amenity.option_value, selectedAmenities, 'amenities')} 
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
            <label htmlFor="do" className="block text-sm font-medium text-gray-700">Room Specific Dos</label>
            <div className="relative">
              <button type="button" onClick={() => setIsDoDropdownOpen(!isDoDropdownOpen)} className="mt-1 block bg-white w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 text-left">
                {selectedDo.length > 0 ? selectedDo.join(', ') : "Select Room Specific Dos"}
              </button>
              {isDoDropdownOpen && (
                <ul ref={doDropdownRef} className="absolute z-10 w-full overflow-y-scroll bg-white mt-1 rounded-md border border-gray-300 shadow-lg" style={{height: '20vh'}}>
                  {dos.map((_do) => (
                    <li key={_do.id} className="p-2 hover:bg-gray-100 flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        id={`checkbox-${_do.id}`} 
                        name="do" 
                        value={_do.option_value} 
                        checked={selectedDo.includes(_do.option_value)} 
                        onChange={() => handleCheckboxChange(_do.option_value, selectedDo, 'do')} 
                        className="mr-2 cursor-pointer"
                      />
                      <label htmlFor={`checkbox-${_do.id}`} className="flex-1  cursor-pointer">{_do.option_value}</label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="roomDescription" className="block text-sm font-medium text-gray-700">Any additinal information about room/flat</label>
        
            <textarea
                name="roomDescription"
                id="roomDescription"
                placeholder="Enter additional information"
                rows="5" // Set the number of lines the textarea will display by default
                value={formState.roomDescription}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          <div className="bottom-buttons mt-4 w-full flex justify-around">
            <button type="button" onClick={()=>handleSubmit(false)} className="my-3 py-3  mr-2 flex-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                Previous
            </button>
            <button type="button" onClick={()=>handleSubmit(true)} className="my-3 py3 flex-1 px-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                Next
            </button>
          </div>
        </form>
      </div>
      {
        isConfirmSubmitOpen && 
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto z-50">
                <h1 className="text-lg font-semibold mb-4">
                    Do you want to submit? Confirm it!
                </h1>
                <div className="flex justify-between">
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={handleConfirm}>
                        Confirm
                    </button>
                    <button className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => setIsConfirmSubmitOpen(false)}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      }
      
    </div>
  );
};

export default Room;
