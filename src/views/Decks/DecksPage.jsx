import React, { useContext, useEffect, useState } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import Decks from "../../containers/Decks/Decks"

function DecksPage() {
    const { userRole } = useContext(AuthContext);
    
    return(
        <MainLayout user={userRole}>
            <Decks/>
        </MainLayout>
    );
}

export default DecksPage;