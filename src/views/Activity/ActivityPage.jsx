import React, { useState, useContext, useEffect } from 'react';
import ActivityContext from '../../context/ActivityContext';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import { Progress } from 'flowbite-react';
import CompleteSentenceActivity from '../../containers/CompleteSentenceActivity/CompleteSentenceActivity';
import ResultBar from '../../components/ResultBar/ResultBar';
import Close from "../../assets/Close.png"

// Before navigating to this page, the previous component should call useEffect and load the exercise into context.

function ActivityPage({children}) {
    const { userRole } = useContext(AuthContext);
    const [ activityType, setActivityType ] = useState(null)
    const { activities, activitiesCount, currentActivity } = useContext(ActivityContext);
    console.log(currentActivity);

    useEffect(() => {
        // To get from currentActivity
        setActivityType(currentActivity["activity"]);
    }, [currentActivity]);

    console.log(currentActivity)
    function handleTerminate() {
        console.log("should terminate and send existing data to backend")
    }

    return(
        <MainLayout user={userRole}>
            <div className="flex flex-col h-full">
                <div className="bg-blue-500 p-5 pt-8 rounded-t-lg flex flex-row items-center">
                    <div className="h-4 pr-3 cursor-pointer" onClick={handleTerminate}>
                        <img src={Close} className="h-full object-contain"/>
                    </div>
                    <div className="flex-grow">
                        {activities.length !== 0 ? <Progress size="lg" progress={((activitiesCount/activities.length)*100)} />: ""}
                    </div>
                </div>

                <div className="flex-1 flex items-center p-5 justify-center bg-red-500">
                    {activityType===0 ? <CompleteSentenceActivity data={currentActivity}/> : ""}
                    
                </div>
                
                <div className="rounded-b-lg">  
                    <ResultBar/>
                </div>
            </div>
                
        </MainLayout>
    );
}

export default ActivityPage;

// Plan is to wrap this with a context. Will have a activityType variable and data type variable.
// Receive from backend a list of activities. each activity can have a activity type variable.
// Pop one off from the list. Check the activity type variable. Load component base on activity type then send state data into it.
// Can change this to be activity view.