import React from 'react';
import { addTestDocument, getTestDocument } from '../services/testFirebaseConnection';

const TestFirebase = () => {
  return (
    <div>
        <button className='border-2 p-3 border-black m-10' onClick={addTestDocument}>Add</button>
        <button className='border-2 p-3 border-black m-10' onClick={()=>getTestDocument('GiSqXzzqn0yx99Imjbxz')}>Get</button>
    </div>
  );
}

export default TestFirebase;