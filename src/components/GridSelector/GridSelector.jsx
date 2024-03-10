import React from 'react';
import activities from "./ActivitiesGridConfig"

const ActivitiesGrid = (props) => {
  return (
    <div className="grid grid-cols-3 gap-4 overflow-scroll p-3 h-full max-h-full">
      {activities.map((data, index) => (
        <div key={index} className="bg-blue-500 h-64 rounded-lg shadow-md flex items-center justify-center">
          <span>Rectangle {index + 1}</span>
        </div>
      ))}
    </div>
  );
};

export default ActivitiesGrid;
