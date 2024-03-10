import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {numbersToActivityName} from "../../Constants"

const ActivitiesGrid = () => {
  let navigate = useNavigate();

  function handleOnClick(activityKey){
    navigate('/patient/decks/' + activityKey);
  }
  return (
    <div className="grid grid-cols-3 gap-4 overflow-scroll p-3 h-full">
      {Object.keys(numbersToActivityName).map((activityKey) => (
        <div key={activityKey} className="bg-blue-500 h-32 rounded-lg shadow-md flex items-center justify-center cursor-pointer" onClick={() => handleOnClick(activityKey)}>
          <span>{numbersToActivityName[activityKey]}</span>
        </div>
      ))}
    </div>
  );
};

export default ActivitiesGrid;
