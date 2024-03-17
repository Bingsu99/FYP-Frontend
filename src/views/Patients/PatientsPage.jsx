import React, { useState, useContext } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import PatientList from '../../containers/PatientList/PatientList';

function PatientsPage() {
    const { userRole } = useContext(AuthContext); // Can be caregiver or therapist
    return(
        <MainLayout user={userRole}>
            <PatientList/>
        </MainLayout>
    );
}

export default PatientsPage;