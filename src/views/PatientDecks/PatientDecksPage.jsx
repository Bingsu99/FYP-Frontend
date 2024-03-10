import React, { useContext, useEffect, useState } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import { serverURL, numbersToActivityName } from '../../Constants';
import BasicTable from '../../components/BasicTable/BasicTable';
import { useParams, useNavigate } from 'react-router-dom';
import { headers, parseToTableContent } from './PatientDecksConfig';
import ActivityContext from '../../context/ActivityContext';

function PatientDecksPage() {
    const { userRole ,userID } = useContext(AuthContext);
    const { loadActivities } = useContext(ActivityContext);
    const [decks, setDecks] = useState([]);
    let { activity } = useParams();
    let navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://' + serverURL + '/Decks/Access', {
              method: 'POST', // Specify the method as POST
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                "_id": userID,
                "activity": activity
              }),
            });
            const result = await response.json();
            console.log(result)
            setDecks(parseToTableContent(result["data"]))
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
      
        fetchData();
      }, []);

    const handleRowClick = (metaData) => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://' + serverURL + '/Decks/Read', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "_id": metaData["deckID"],
                    "activity": metaData["activity"]
                }),
                });
                const result = await response.json();
                console.log(result["data"]["exercises"])
                loadActivities(result["data"]["exercises"])
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        
        fetchData();
        navigate("/patient/activity");
    } 
    
    return(
        <MainLayout user={userRole}>
            <div className="flex justify-between items-end px-5">
                <h2 className="text-3xl font-extrabold text-gray-900 pl-2 pt-5">
                    {numbersToActivityName[activity]}
                </h2>
                <button onClick={()=>navigate(-1)}className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">
                    Back
                </button>
            </div>
             <BasicTable headers={headers} items={decks} searchIndex={0} categoriseIndex={1} handleRowClick={handleRowClick}/>
        </MainLayout>
    );
}

export default PatientDecksPage;