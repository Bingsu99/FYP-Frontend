import { useContext } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import PatientDeckList from '../../containers/PatientDeckList/PatientDeckList';

function PatientDecksPage() {
    const { userRole, userID } = useContext(AuthContext); // Can be caregiver or therapist
   
    return(
        <MainLayout user={userRole}>
            <PatientDeckList/>
        </MainLayout>
    );
}


export default PatientDecksPage;