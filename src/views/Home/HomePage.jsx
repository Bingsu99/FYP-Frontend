import React, { useState, useContext } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';

function HomePage() {
    const { userRole } = useContext(AuthContext); // Will always be patient, cos of Protected Route
    return(
        <MainLayout user={userRole}>
            HomePage
        </MainLayout>
    );
}

export default HomePage;