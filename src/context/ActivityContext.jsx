import React, { createContext, useState, useEffect } from 'react';

const ActivityContext = createContext();

export default ActivityContext;

export const ActivityProvider = ({ children }) => {
    const [result, setResult] = useState([]);   // Save result of all the activities. To be sent to backend for saving
    const [activityState, setActivityState] = useState(""); // Determine the state of ResultBar (Submit, Correct, Incorrect)
    const [numberOfActivities, setNumberOfActivities] = useState(2);    // To track total number of activities
    const [activitiesCount, setActivitiesCount] = useState(1);  // To track how many activities have been completed til now
    const [currentActivity, setCurrentActivity] = useState({}); // Will be determined by activity page on which activity component to load. Should have activityType(numbers) in it
    const [activities, setActivities] = useState([]);   // Save incoming activities from backend to be played by user

    const loadActivities = (listOfActivities) => {
        resetContext();
        setActivities(listOfActivities);
        setCurrentActivity(activities[activitiesCount])
    };

    // const prevActivityResult = {
    //     activity: 0
    //     fieldsToInputToDatabase
    // }

    const setIsResultCorrect = (result) => {
        result === true ? setActivityState(true) : setActivityState(false);
    }

    const nextActivity = (prevActivityResult) => {
        setResult(prevResult => [...prevResult, prevActivityResult]);
        setCurrentActivity(activities[(activitiesCount+1)]);
        setActivitiesCount(prevCount => prevCount + 1);
        setActivityState("submit")
    };

    // Add close then auto upload.
    // Can have a function here to auto upload to backend so that it won't be embed in activities code.
    const submitResult = () => {
        // Fetch to database
        resetContext();
    };

    const resetContext = () => {
        setResult([]);
        setNumberOfActivities(0);
        setActivitiesCount(0);
        setCurrentActivity({});
        setActivities([]);
    };

    return (
        <ActivityContext.Provider value={{ activityState, currentActivity, activitiesCount, numberOfActivities, nextActivity, loadActivities, submitResult, setIsResultCorrect }}>
            {children}
        </ActivityContext.Provider>
    );
};
