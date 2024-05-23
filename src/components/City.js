import React from 'react';
import { useParams } from 'react-router-dom';

const City = () => {
    const { cityName } = useParams();
  return (
    <div>
        {cityName}
    </div>
  );
}

export default City;