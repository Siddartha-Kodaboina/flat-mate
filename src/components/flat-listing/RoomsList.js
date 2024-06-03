import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import PlaceIcon from '@mui/icons-material/Place';
import GetIcon from '../GetIcon';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';
import Loader from '../Loader';
import useFirebaseUser from '../../hooks/useFirebaseUser';

const RoomsList = () => {
  const [searchParams] = useSearchParams();
  const community_id = searchParams.get('community_id');
  const [isLoading, setIsLoading] = useState(true);
  const user = useFirebaseUser();
  const [community, setCommunity] = useState([]);
  const [communityInfo, setCommunityInfo] = useState([]);
  const [vacancyRoomUserList, setVacancyRoomUserList] = useState([]);
  const [activePhoto, setActivePhoto] = useState(0);
  const [viewMoreOn, setViewMoreOn] = useState({});
  const [activeViewMoreId, setActiveViewMoreId] = useState(-1);
  const nodeBaseUrl = process.env.REACT_APP_NODE_ENV === 'development'
    ? process.env.REACT_APP_LOCAL_NODE_BASE_URL
    : process.env.REACT_APP_PRODUCTION_NODE_BASE_URL;
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false);

  const modalRef = useRef(null);
  const descriptionModalRef = useRef(null);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (isModalOpen && modalRef.current && !modalRef.current.contains(e.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (isDescriptionModalOpen && descriptionModalRef.current && !descriptionModalRef.current.contains(e.target)) {
        setIsDescriptionModalOpen(false);
      }
    };

    document.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isDescriptionModalOpen]);

  useEffect(() => {
    if (community_id) {
      fetchCommunityAndRooms(community_id);
    } else {
      setIsLoading(false);
    }
  }, [community_id]);

  const getCommunityData = async (community_id) => {
    const community_object_api_url = `${nodeBaseUrl}/api/v1/communities/id/${community_id}`;
    try {
      const response = await fetch(community_object_api_url);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching the Community Object using community_id Details:', error);
    }
  };

  const getCommunityInfoData = async (community_id) => {
    const community_info_object_api_url = `${nodeBaseUrl}/api/v1/communities-info/community_id/${community_id}`;
    try {
      const response = await fetch(community_info_object_api_url);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching the Community Object using community_id Details:', error);
    }
  };

  const getRoomsData = async (community_id) => {
    const rooms_object_api_url = `${nodeBaseUrl}/api/v1/rooms/all/community_id/${community_id}`;
    try {
      const response = await fetch(rooms_object_api_url);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching the Room Object using community_id:', error);
    }
  };

  const getCreatorsData = async (customer_id) => {
    const users_object_api_url = `${nodeBaseUrl}/api/v1/customers/id/${customer_id}`;
    try {
      const response = await fetch(users_object_api_url);
      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error fetching the Creator Object using customer_id:', error);
    }
  };

  const fetchCommunityAndRooms = async (community_id) => {
    setIsLoading(true);
    const community_api_url = `${nodeBaseUrl}/api/v1/vacancies/all/community_id/${community_id}`;
    try {
      const response = await fetch(community_api_url);
      if (response.ok) {
        let data = await response.json();
        if (!data.length) {
          return;
        }
        const communityData = await getCommunityData(data[0].communityId);
        setCommunity(communityData);

        let communityInfoData = await getCommunityInfoData(data[0].communityId);
        setCommunityInfo(communityInfoData);

        let roomsData = await getRoomsData(data[0].communityId);

        var updatedVacancyRoomsUserList = [];
        if (data.length === undefined) {
          data = [data];
        }
        if (roomsData.length === undefined) {
          roomsData = [roomsData];
        }
        roomsData = roomsData.slice().reverse(); 
        
        const tempViewMore = {};
        for (let i = 0; i < data.length; i++) {
          const creatorsData = await getCreatorsData(data[i].customerId);
          tempViewMore[data[i].roomId] = false;
          updatedVacancyRoomsUserList.push({ vacancy: data[i], room: roomsData[i], creator: creatorsData });
        }
        setViewMoreOn(tempViewMore);
        setVacancyRoomUserList(updatedVacancyRoomsUserList);
      }
    }
    catch (error) {
      console.error('Error fetching the Community by ID Details:', error);
    }
    finally {
      setIsLoading(false);
    }
  };

  function formatDate(dateString) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();

    return `${dayName}, ${hours}:${minutes}, ${month}-${day}-${year}`;
  }

  const alterCommunityPhoto = (communityId, photoIndex, imageSrc) => {
    setActivePhoto(photoIndex);
    const imageElement = document.getElementById(communityId);
    if (imageElement) {
      imageElement.src = imageSrc;
    }
  };

  const toggleViewMore = (roomId) => {
    if (activeViewMoreId === -1) {
      setViewMoreOn(prevState => ({
        ...prevState,
        [roomId]: true
      }));
    }
    else {
      setViewMoreOn(prevState => ({
        ...prevState,
        [activeViewMoreId]: false,
        [roomId]: true
      }));
    }
    setActiveViewMoreId(roomId);
  };

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const toggleDescriptionModal = () => setIsDescriptionModalOpen(!isDescriptionModalOpen);

  const handleSendMessage = async (creatorId) => {
    try {
      const userConversationsQuery = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', auth.currentUser.uid)
      );
      const userConversationsSnapshot = await getDocs(userConversationsQuery);
      const userConversations = userConversationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const creatorConversationsQuery = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', creatorId)
      );
      const creatorConversationsSnapshot = await getDocs(creatorConversationsQuery);
      const creatorConversations = creatorConversationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const existingConversation = userConversations.find(convo =>
        convo.participants.includes(creatorId)
      );

      let conversationId;
      if (existingConversation) {
        conversationId = existingConversation.id;
      } else {
        const newConversation = {
          participants: [auth.currentUser.uid, creatorId],
          latestMessage: {
            message: '',
            timestamp: null
          }
        };
        const docRef = await addDoc(collection(db, 'conversations'), newConversation);
        conversationId = docRef.id;
      }

      navigate(`/messaging?conversationId=${conversationId}`);
    } catch (error) {
      console.error('Error handling send message:', error);
    }
  };

  return (
    <div className="bg-sky-50 p-4 min-h-screen">
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-x-[2%] p-2 md:p-5" name="page">
            <div className="md:col-span-2 divide-y divide-slate-700" name="community-data">
              <div className="mt-1 border-b border-b-2 border-black-200" name="community-img-title">
                <img
                  className="w-full h-64 object-cover md:h-96"
                  id={community.id.toString()}
                  src={community.photos[0]}
                  alt={community.title}
                />
                <div className='relative w-full justify-center flex -mt-4'>
                  {community.photos.map((photo, photoIndex) => (
                    <button
                      key={photoIndex}
                      className={`mr-2 w-2 h-2 rounded-full ${
                        activePhoto === photoIndex ? 'bg-white' : 'bg-gray-300 opacity-50'
                      }`}
                      onClick={() => alterCommunityPhoto(community.id.toString(), photoIndex, photo)}
                    />
                  ))}
                </div>
                <div className='mt-4'>
                  <div className="p-2" name="community-title">
                    <h1 className='text-2xl font-bold'>{community.title}</h1>
                  </div>
                  <div className='p-2 flex justify-between items-center'>
                    <h3>{community.address}, {community.city}, {community.state}</h3>
                    <h3 className='cursor-pointer p-1 pl-2 pr-2 border-[1px] border-[#008cff] rounded-lg text-[#008cff] hover:bg-blue-100'>
                      <a href={`https://www.google.com/maps/search/?query=place_id:${community.place_id}`}>
                        View in maps <PlaceIcon />
                      </a>
                    </h3>
                  </div>
                </div>
              </div>
              <div className="p-2 bg-white shadow rounded-md mt-4" name="Amenities">
                <h1 className='p-2 text-xl mb-2 font-semibold'>Amenities</h1>
                <div className={`flex ${isModalOpen ? 'hidden' : 'flex-row'} justify-around items-center flex-wrap`} name='amenities-box'>
                  {communityInfo.amenities.split(',').slice(0, window.innerWidth > 768 ? 6 : 3).map((amenity, index) => (
                    <div key={index} className='flex flex-col justify-center items-center p-2'>
                      <GetIcon name={amenity.trim()} />
                      <h3 className="text-sm text-gray-700">{amenity}</h3>
                    </div>
                  ))}
                  <button onClick={toggleModal} className="text-xl font-semibold text-blue-600 hover:underline">More...</button>
                </div>
              </div>
              {isModalOpen && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center" ref={modalRef}>
                  <div className="bg-white p-4 rounded-lg w-[80%] max-w-lg md:max-w-3xl h-[60%] md:h-auto overflow-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={toggleModal} className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-gray-900">&#10005;</button>
                    {communityInfo.amenities.split(',').map((amenity, index) => (
                      <div key={index} className='flex flex-col justify-center items-center space-y-2 p-2'>
                        <GetIcon name={amenity.trim()} />
                        <h3 className="text-sm text-gray-700">{amenity}</h3>
                      </div>
                    ))}
                    <button onClick={toggleModal} className="col-span-2 md:col-span-4 bg-black text-white rounded p-2 m-4 hover:bg-gray-900">Close</button>
                  </div>
                </div>
              )}
              <div className="p-2 mb-4 bg-white shadow rounded-md mt-4" name="what-people-are-saying">
                <h1 className='p-2 text-xl mb-2 font-semibold'>What Residents are Saying</h1>
                <div className={`mb-2 flex ${isDescriptionModalOpen ? 'hidden' : 'flex-row'} justify-around items-center flex-wrap`} name='descriptions-box'>
                  {communityInfo.communityDescription.split('*$%!&^$#').slice(0, window.innerWidth > 768 ? 2 : 1).map((description, index) => (
                    <div key={index} className='border-[1px] border-[rgba(0,0,0,0.1)] p-2 rounded-[10px] flex flex-col justify-center items-center shadow-[0_3px_10px_-2px_rgba(0,0,0,0.25)] bg-gray-100' name='description'>
                      <h2 className="text-sm text-gray-700">{description}</h2>
                    </div>
                  ))}
                  <button onClick={toggleDescriptionModal} className="text-xl font-semibold text-blue-600 hover:underline">More...</button>
                </div>
              </div>
              {isDescriptionModalOpen && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center" ref={descriptionModalRef}>
                  <div className="bg-white p-4 rounded-lg w-[80%] max-w-lg md:max-w-3xl h-[60%] md:h-auto overflow-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={toggleDescriptionModal} className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-gray-900">&#10005;</button>
                    {communityInfo.communityDescription.split('*$%!&^$#').map((description, index) => (
                      <div key={index} className='border-[1px] border-[rgba(0,0,0,0.1)] p-2 rounded-[10px] flex flex-col justify-center items-center space-y-2 shadow-[0_3px_10px_-2px_rgba(0,0,0,0.25)] bg-gray-100' name='description'>
                        <h2 className="text-sm text-gray-700">{description}</h2>
                      </div>
                    ))}
                    <button onClick={toggleDescriptionModal} className="col-span-1 md:col-span-2 bg-black text-white rounded p-2 m-4 hover:bg-gray-900">Close</button>
                  </div>
                </div>
              )}
            </div>
            <div className="md:col-span-1 border-1 border-black bg-white shadow rounded-md p-4" name="room-openings">
              <h1 className='pb-2 text-2xl font-semibold'>Openings</h1>
              <div className="" name="openings-list">
                {vacancyRoomUserList.map((vru) => (
                  <div key={vru.vacancy.id} className='border-[1px] border-[rgba(0,0,0,0.1)] flex flex-col mb-5 shadow-[0_13px_10px_-2px_rgba(0,0,0,0.25)] bg-gray-100 hover:bg-white rounded-md'>
                    <div className='p-2 flex justify-between items-center border-b border-gray-200'>
                      <h3 className='font-semibold'>{vru.creator.displayName}</h3>
                      <h3 className='text-sm text-gray-600'>Available from: {vru.vacancy.from}</h3>
                    </div>
                    <div className="p-2 flex flex-wrap justify-between items-center" name="requirements">
                      <div className='flex flex-wrap gap-2'>
                        <div className='text-sm font-semibold text-gray-700'>Looking for</div>
                        {vru.vacancy.requirements.split(',').map((requirement, index) => (
                          <div key={index} className='p-[1px] pl-[2px] pr-[2px] rounded-lg bg-green-100 border border-green-500'>
                            <h3 className='text-sm text-green-700'>{requirement}</h3>
                          </div>
                        ))}
                      </div>
                    </div>
                    {!viewMoreOn[vru.room.id] && (
                      <div className='p-2 mt-1 bg-[#2c3336] flex justify-between items-center rounded-b-md'>
                        <h3 className='p-2 text-white text-sm'>Starting from: ${vru.room.monthlyRent} + ${vru.room.utilitiesCost} utilities</h3>
                        <div className='border-2 border-black bg-bg-cb mr-5 rounded-lg text-white cursor-pointer hover:bg-gray-800' onClick={() => toggleViewMore(vru.room.id)}>
                          <h3 className='p-2 pl-3 pr-3 font-medium'>VIEW MORE</h3>
                        </div>
                      </div>
                    )}
                    {viewMoreOn[vru.room.id] && (
                      <div className="p-2 space-y-2" name="second-div">
                        <div className="flex flex-wrap gap-2" name="rooms">
                          <h3 className='text-sm'>
                            Total rooms in flat are <span className='p-[0.5px] px-[3px] mx-[1px] font-bold'>Bedrooms x <span className='text-[#c536c1]'>{vru.room.totalBedRooms}</span></span>
                            , <span className='p-[0.5px] px-[3px] mx-[1px] font-bold'>Bathrooms x <span className='text-[#c536c1]'>{vru.room.bathRooms}</span></span>.
                            Position available in <span className='p-[0.5px] px-[3px] mx-[1px] font-bold'><span className='text-[#c536c1]'>{vru.room.sharingType}</span>-sharing Type</span>.
                            People living in the house are <span className='p-[0.5px] px-[3px] mx-[1px] font-bold'>Females x <span className='text-[#c536c1]'>{vru.room.femaleCount}</span></span>
                            , <span className='p-[0.5px] px-[3px] mx-[1px] font-bold'>Males x <span className='text-[#c536c1]'>{vru.room.maleCount}</span></span>.
                          </h3>
                        </div>
                        <div className="text-sm text-gray-700" name="room-amenities">
                          <span className='p-[0.5px] px-[3px] mx-[1px] font-bold'>Room specific amenities</span> are {vru.room.amenities}
                        </div>
                        {vru.room.roomDescription && (
                          <div className="text-sm text-gray-700" name="room-description">
                            <span className='p-[0.5px] px-[3px] mx-[1px] font-bold'>Description/Experience</span> of flat
                            by <span className='p-[0.5px] px-[3px] mx-[1px] font-bold'>{vru.creator.displayName}</span> is "{vru.room.roomDescription}"
                          </div>
                        )}
                        <div className='p-2 mt-1 bg-[#2c3336] flex justify-between items-center rounded-b-md'>
                          <h3 className='p-2 text-white text-sm'>Starting from: ${vru.room.monthlyRent} + ${vru.room.utilitiesCost} utilities</h3>
                          {
                            (user && user.uid!==vru.creator.uid) &&
                            <div className='border-2 border-black bg-bg-cb mr-5 rounded-lg text-white cursor-pointer hover:bg-gray-800' onClick={() => handleSendMessage(vru.creator.uid)}>
                              <h3 className='p-2 pl-3 pr-3 font-medium'>Message</h3>
                            </div>
                          }
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsList;
