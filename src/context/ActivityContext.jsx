import React, { createContext, useState, useEffect } from 'react';

const ActivityContext = createContext();

export default ActivityContext;

export const ActivityProvider = ({ children }) => {
    const [result, setResult] = useState([]);   // To store the result of each activities (isCorrect and duration)
    const [resultDisplay, setResultDisplay] = useState(null);   // Manage the headers and subheaders
    const [activitiesCount, setActivitiesCount] = useState(0);  // To track how many activities have been completed til now
    const [currentActivity, setCurrentActivity] = useState({}); // Will be determined by activity page on which activity component to load. Should have activityType(numbers) in it
    const [activities, setActivities] = useState([]);   // Save incoming activities from backend to be played by user
    const [activityStartTime, setActivityStartTime] = useState(null);

    console.log(activities);

    const loadActivities = (listOfActivities) => {
        resetContext();
        setActivities(listOfActivities);
        console.log(listOfActivities[0])
        setCurrentActivity(listOfActivities[0])
        setActivityStartTime(Date.now())
        setResultDisplay(null)
        console.log("loaded activities")
    };

    const nextActivity = () => {
        if(activitiesCount >= activities.length){
            return false;
        }
        setCurrentActivity(activities[(activitiesCount)]);
        setActivityStartTime(Date.now())
        setResultDisplay(null)
        return true;
    };

    const resetContext = () => {
        setActivitiesCount(0);
        setCurrentActivity({});
        setActivities([]);
        setResultDisplay(null)
        setActivityStartTime(null)
        setResult([])
    };

    // To use by activities to display the bar
    const handleEndOfActivity = (isCorrect, duration, header, subheader) =>{
        setActivitiesCount(prevCount => prevCount + 1);
        setResult([...result, {isCorrect, duration}]);
        setResultDisplay({
            isCorrect: isCorrect,
            header: header,
            subheader: subheader
        })
    }

    return (
        <ActivityContext.Provider value={{result,activityStartTime, resultDisplay, activities, currentActivity, activitiesCount, nextActivity, loadActivities, handleEndOfActivity }}>
            {children}
        </ActivityContext.Provider>
    );
};
