import React, { useContext} from 'react';
import MainLayout from "../../layout/MainLayout";
import AuthContext from '../../context/AuthContext';
import Deck from '../../containers/Deck/Deck';

function DeckPage() {
    const { userRole } = useContext(AuthContext); 

    return(
        <MainLayout user={userRole}>
            <Deck/>
        </MainLayout>
    );
}

export default DeckPage;
