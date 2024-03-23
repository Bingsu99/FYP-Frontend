import React from 'react';
import Accuracy from "../../assets/accuracy.png";
import Clock from "../../assets/clock.png";
import Exercises from "../../assets/exercises.png";

const STAT_TYPE = {
  ACCUR: "accuracy",
  TIME: "time",
  EXERCISES: "exercises"
}

function StatCard({ width = "15%", height = "12%", type, content, className }){
  var backgroundColour;
  var icon;
  
  var backgroundColour;
  if(type===STAT_TYPE.ACCUR){
    backgroundColour = "bg-yellow-500";
    icon = Accuracy;
  }else if (type===STAT_TYPE.TIME){
    backgroundColour = "bg-green-500";
    icon = Clock;
  }else {
    backgroundColour = "bg-red-500";
    icon = Exercises;
  }

  return (
    <div 
      className={`${backgroundColour} rounded-lg p-1 flex flex-col shadow-md box-border min-w-[100px] min-h-[70px] ${className}`}
      style={{ width, height }}
    >
      <div className="text-white font-bold uppercase text-center sm:text-xs md:text-md flex-shrink-0">
        {type}
      </div>
      <div className="flex items-center justify-center rounded-lg bg-white w-full flex-grow">
        <img src={ icon } className="h-6 w-6 object-contain flex-shrink-0" />
        <div className="sm:text-xs md:text-lg text-sm px-1">
          {content}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
