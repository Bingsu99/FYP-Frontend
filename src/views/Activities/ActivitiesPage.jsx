import React, { useState, useContext } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import ActivitiesGrid from '../../components/GridSelector/GridSelector';

function ActivitiesPage() {
    const { userRole } = useContext(AuthContext); // Will always be patient, cos of Protected Route
    return(
        <MainLayout user={userRole}>
             <div className="h-full grid grid-rows-12 p-5">
                <div className="row-span-1 flex items-center justify-center">
                    <h2 className="text-center text-2xl font-bold">What activities would you like to engage in?</h2>
                </div>
                <div className="row-span-11 overflow-y-auto">
                    <ActivitiesGrid/>
                </div>
            </div>
        </MainLayout>
    );
}

export default ActivitiesPage;