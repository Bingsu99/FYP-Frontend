import React, { useState, useContext } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import ActivityCard from '../../components/ActivityCard/ActivityCard';
import {activitiesMetaData} from "../../Constants"

function ActivitiesPage() {
    const { userRole } = useContext(AuthContext); // Will always be patient, cos of Protected Route
    return(
        <MainLayout user={userRole}>
             <div className="flex flex-col p-5 h-full w-full space-y-3 ">
                <div className="row-span-1 flex items-center justify-center">
                    <h2 className="text-center sm:text-sm md:text-2xl font-bold">What activities would you like to engage in?</h2>
                </div>
                {/* <div className="row-span-11 overflow-y-auto">
                    <ActivitiesGrid/>
                </div> */}
                <div className='overflow-scroll space-y-3'>
                    {Object.keys(activitiesMetaData).map((activityKey) => (
                        <ActivityCard key={activityKey} activityKey={activityKey} name={activitiesMetaData[activityKey]["name"]} description={activitiesMetaData[activityKey]["description"]} icon={activitiesMetaData[activityKey]["icon"]}/>
                    ))}
                </div>
                
            </div>
        </MainLayout>
    );
}

export default ActivitiesPage;