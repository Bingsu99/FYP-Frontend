import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from "../../layout/MainLayout";
import AuthContext from '../../context/AuthContext';
import CompleteSentenceDeck from '../../containers/CompleteSentenceDeck/CompleteSentenceDeck';
import {serverURL} from "../../Constants"

function DeckPage() {
    const { userRole } = useContext(AuthContext); 
    let { activity, deckID } = useParams();

    console.log("running in deck page")

    return(
        <MainLayout user={userRole}>
            {activity == 0 ? <CompleteSentenceDeck deckID={deckID}/> : ""}
        </MainLayout>
    );
}

export default DeckPage;
