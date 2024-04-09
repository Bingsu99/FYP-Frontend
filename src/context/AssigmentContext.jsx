import React, { createContext, useState } from 'react';

const AssignmentContext = createContext();

export default AssignmentContext;

export const AssignmentProvider = ({ children }) => {
    const [streak, setStreak] = useState(0);
    const [records, setRecords] = useState({});
    const [requirements, setRequirements] = useState({});
    const [lastUpdatedDate, setLastUpdatedDate] = useState({});

    function initialiseAssignmentDetails(streak, records, requirements, lastUpdatedDate){
        setStreak(streak)
        setRecords(records)
        setRequirements(requirements)
        setLastUpdatedDate(lastUpdatedDate)
    }

    return (
        <AssignmentContext.Provider value={{ streak, records, requirements, lastUpdatedDate, initialiseAssignmentDetails }}>
            {children}
        </AssignmentContext.Provider>
    );
};