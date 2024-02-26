import React, { useState, useContext } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';

function PatientsPage() {
    const { userRole } = useContext(AuthContext); // Can be caregiver or therapist
    return(
        <MainLayout user={userRole}>
            PatientsPage
        </MainLayout>
    );
}

export default PatientsPage;