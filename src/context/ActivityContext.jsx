import React, { createContext, useState, useEffect } from 'react';

const ActivityContext = createContext();

export default ActivityContext;

export const ActivityProvider = ({ children }) => {
    const [resultDisplay, setResultDisplay] = useState(null);   // Manage the headers and subheaders
    const [activitiesCount, setActivitiesCount] = useState(0);  // To track how many activities have been completed til now
    const [currentActivity, setCurrentActivity] = useState({}); // Will be determined by activity page on which activity component to load. Should have activityType(numbers) in it
    const [activities, setActivities] = useState([]);   // Save incoming activities from backend to be played by user
    const [activityStartTime, setActivityStartTime] = useState(null);

    const loadActivities = (listOfActivities) => {
        resetContext();
        setActivities(listOfActivities);
        console.log(listOfActivities[0])
        setCurrentActivity(listOfActivities[0])
        setActivityStartTime(Date.now())
        setResultDisplay(null)
    };

    const nextActivity = () => {
        setCurrentActivity(activities[(activitiesCount+1)]);
        setActivitiesCount(prevCount => prevCount + 1);
        setActivityStartTime(Date.now())
        setResultDisplay(null)
    };

    const resetContext = () => {
        setActivitiesCount(0);
        setCurrentActivity({});
        setActivities([]);
        setResultDisplay(null)
        setActivityStartTime(null)
    };

    // To use by activities to display the bar
    const setDisplayResponse = (isCorrect, header, subheader) =>{
        console.log("running in setDisplayResponse")
        setResultDisplay({
            isCorrect: isCorrect,
            header: header,
            subheader: subheader
        })
    }

    return (
        <ActivityContext.Provider value={{activityStartTime, resultDisplay, activities, currentActivity, activitiesCount, nextActivity, loadActivities, setDisplayResponse }}>
            {children}
        </ActivityContext.Provider>
    );
};
