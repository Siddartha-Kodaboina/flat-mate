import { useSelector, useDispatch } from 'react-redux';
// import useFirebaseUser from '../hooks/useFirebaseUser'; 

const createCommunityInfoObject = (community) => {
    let communityInfo = {};  
    const communityInfoColumns = ['amenities', 'averageRent', 'communityDescription', 'place_id', 'websiteURL'];
    for (const item of communityInfoColumns) { 
        if (item in community) {
            communityInfo[item] = community[item];  
        }
    }
    return communityInfo;
};

const deleteColumnsFromComunity = (community) => {
    let updatedCommunity = {};
    const communityInfoColumns = ['amenities', 'averageRent', 'communityDescription', 'websiteURL'];
    for(const item in community){
        if(!communityInfoColumns.includes(item)){
            updatedCommunity[item] = community[item];
        }
    }
    return updatedCommunity;
}

const handleVacancyRequestSubmit = async (vacancy) => {
    try {
        const communityInfo = createCommunityInfoObject(vacancy.community);
        const updatedCommunity = deleteColumnsFromComunity(vacancy.community);
        vacancy.community = updatedCommunity;
        vacancy.communityInfo = communityInfo;
        const nodeBaseUrl = process.env.REACT_APP_NODE_ENV === "development" ? process.env.REACT_APP_LOCAL_NODE_BASE_URL : process.env.REACT_APP_PRODUCTION_NODE_BASE_URL;
        const response = await fetch(`${nodeBaseUrl}/api/v1/vacancy-requests/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(vacancy),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error submitting the vacancy request:', error);
        return null; 
    }
};

export default handleVacancyRequestSubmit;