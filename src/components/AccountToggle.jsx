import React, { useState, useEffect } from 'react';


const stateToUser = {0:"patient", 1:"caregiver", 2:"therapist"}

const AccountToggle = (props) => {
  const [state, setState] = useState(0); // 0, 1, or 2

  const nextValue = () => {
    setState((current) => (current + 1) % 3)    
  };

  // Use useEffect to react to changes in state.
  useEffect(() => {
      props.setUser(stateToUser[state]);
  }, [state, props]);

  return (
    <div className="flex items-center justify-center">
      <div className="p-1 ">
        <div
          className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-300"
          onClick={nextValue}
        >
          {state === 0 && 'Patient'}
          {state === 1 && 'Caregiver'}
          {state === 2 && 'Therapist'}
        </div>
      </div>
    </div>
  );
};

export default AccountToggle;
