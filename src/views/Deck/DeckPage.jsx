import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from "../../layout/MainLayout";
import AuthContext from '../../context/AuthContext';
import CompleteSentenceDeck from '../../containers/CompleteSentenceDeck/CompleteSentenceDeck';

function DeckPage() {
    const { userRole } = useContext(AuthContext); 
    let { activity, deckID } = useParams();

    return(
        <MainLayout user={userRole}>
            {activity == 0 ? <CompleteSentenceDeck deckID={deckID}/> : ""}
        </MainLayout>
    );
}

export default DeckPage;
