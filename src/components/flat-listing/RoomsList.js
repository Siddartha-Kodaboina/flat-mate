import React, {useState, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import PlaceIcon from '@mui/icons-material/Place';
import DynamicIcon from '../DynamicIcon';


const RoomsList = () => {
  const [searchParams] = useSearchParams();
  const community_id = searchParams.get('community_id');
  const [isLoading, setIsLoading] = useState(true);
  const [community, setCommunity] = useState([]);
  const [vacancyRoomUserList, setVacancyRoomUserList] = useState([]);
  const [activePhoto, setActivePhoto] = useState(0);
  const nodeBaseUrl = process.env.REACT_APP_NODE_ENV === 'development' 
        ? process.env.REACT_APP_LOCAL_NODE_BASE_URL
        : process.env.REACT_APP_PRODUCTION_NODE_BASE_URL;
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
      if (response.ok){
        const data = await response.json();
        console.log(`community Data, ${data}`);
        return data;
      }
    } catch (error) {
      console.error('Error fetching the Community Object using community_id Details:', error);
    }
  };

  const getRoomsData = async (community_id) => {
    // getting the available room in a community
    const rooms_object_api_url = `${nodeBaseUrl}/api/v1/rooms/community_id/${community_id}`;
    try {
      const response = await fetch(rooms_object_api_url);
      if (response.ok){
        const data = await response.json();
        console.log(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching the Room Object using community_id:', error);
    }
  };

  const getCreatorsData = async (customer_id) => {
    // getting the available room in a community
    const users_object_api_url = `${nodeBaseUrl}/api/v1/customers/id/${customer_id}`;
    try {
      const response = await fetch(users_object_api_url);
      if (response.ok){
        const data = await response.json();
        console.log(data);
        return data;
      }
    } catch (error) {
      console.error('Error fetching the Creator Object using customer_id:', error);
    }
  };

  const fetchCommunityAndRooms = async (community_id) => {
    setIsLoading(true);
    // Future Change: at present vacancy_id have one to one mpping with community
    // In future there exist multiple vacancies for the same community
    // Do get the community Object, and list of vacancies in the community
    const community_api_url = `${nodeBaseUrl}/api/v1/vacancies/community_id/${community_id}`;
    try{
      const response = await fetch(community_api_url);
      if (response.ok){
        let data = await response.json();

        const communityData = await getCommunityData(data.communityId);
        setCommunity(communityData);

        let roomsData = await getRoomsData(data.communityId);

        var updatedVacancyRoomsUserList = [];
        if(data.length===undefined){
          data = [data];
        }
        if(roomsData.length===undefined){
          roomsData=[roomsData];
        }

        for(let i=0; i<data.length; i++){
          const creatorsData = await getCreatorsData(data[i].customerId);
          updatedVacancyRoomsUserList.push({vacancy: data[i], room: roomsData[i], creator: creatorsData});
        }

        setVacancyRoomUserList(updatedVacancyRoomsUserList);
        console.log(updatedVacancyRoomsUserList);
      }
    }
    catch (error) {
      console.error('Error fetching the Community by ID Details:', error);
    }
    finally{
      setIsLoading(false);
    }
  }

  function formatDate(dateString) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    const date = new Date(dateString);
    const dayName = days[date.getDay()];
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months start at 0
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
  

  return (
    <div>
      {isLoading ? (
          <h1>Loading...</h1>
      ) : (
          <div>
            <div className="" name="page">
              <div className="divide-y divide-slate-700" name="community-data">
                <div className="mt-1 border-b border-b-2 border-black-200" name="community-img-title">
                  <img 
                      className="w-full h-64 object-cover" 
                      id={community.id.toString()} 
                      src={community.photos[0][2]} 
                      alt={community.title} 
                  />
                  <div className='relative w-full justify-center flex -mt-4'>
                      {community.photos.map((photo, photoIndex) => (
                          <button 
                              key={photoIndex} 
                              className={`mr-2 w-2 h-2 rounded-full ${
                                  activePhoto === photoIndex ? 'bg-white' : 'bg-gray-300 opacity-50'
                              }`}
                              onClick={() => alterCommunityPhoto(community.id.toString(), photoIndex, photo[2])}
                          />
                      ))}
                  </div>
                  <div className='mt-4'>
                    <div className="p-2" name="community-title">
                        <h1 className='text-2xl'>{community.title}</h1>
                        
                    </div>
                    <div className='p-2 flex justify-between items-center'>
                      <h3>{community.address}, {community.city}, {community.state}</h3>
                      <h3 className='cursor-pointer p-1 pl-2 pr-2 border-[1px] border-[#008cff] rounded-lg text-[#008cff]' >
                        <a href={`https://www.google.com/maps/search/?query=place_id:${community.place_id}`}>
                          View in maps <PlaceIcon />
                        </a>
                      </h3>
                    </div>
                  </div>
                  
                </div>
                <div className="" name="Amenities"></div>
                <div className="" name="what-people-are-saying"></div>
              </div>
              <div className="room-openings">
                <h1>Openings</h1>
                <div className="" name="openings-list">
                  {vacancyRoomUserList.map((vru)=>(
                    <div className='border-2 border-black-2 flex flex-col mb-2'> 
                      <div className='p-2 flex justify-between'>
                        <h3>{vru.creator.displayName}</h3>
                        <h3>{formatDate(vru.vacancy.updatedAt)}</h3>
                      </div>
                      <div className="p-2 flex justify-between items-center" name="requirements">
                        <h1 className='flex-3'>Tenant Requirements</h1>
                        <div className='flex-7 flex justify-around'>
                          {
                            vru.vacancy.requirements.split(',').map((requirement)=> (
                              <div className='mr-1 p-1 pl-2 pr-2 rounded-lg bg-green-100 border-[1px] border-green-500'>
                                <h3>{requirement}</h3>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                      <div className='p-2 mt-1 bg-[#2c3336] flex justify-between items-center' >
                        <h3 className='p-2 text-white'>Starting from: $650 + utilities</h3>
                        <div className='border-2 border-black bg-bg-cb mr-5 rounded-lg text-white'>
                          <h3 className='p-2 pl-3 pr-3 font-medium' >VIEW MORE</h3>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
          </div>
      )}
    </div>
  )
}

export default RoomsList;