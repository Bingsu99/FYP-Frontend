import React, { useContext, useEffect, useState } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import { serverURL, numbersToActivityName } from '../../Constants';
import BasicTable from '../../components/BasicTable/BasicTable';
import { useParams, useNavigate } from 'react-router-dom';
import { headers, parseToTableContent } from './ActivityDeckSelectionPageConfig';
import ActivityContext from '../../context/ActivityContext';

function ActivityDeckSelectionPage() {
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
                "activity": parseInt(activity)
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
                result["data"]["exercises"]["deckID"] = result["data"]["_id"]
                console.log(result["data"]["exercises"])
                loadActivities(result["data"]["exercises"])
                navigate("/activity");
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        
        fetchData();
    } 
    
    return(
        <MainLayout user={userRole}>
            <div className="h-[15%] lg:h-[10%] px-5 lg:px-8 pb-3 flex justify-between items-end ">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                    {numbersToActivityName[activity]}
                </h2>
                <button onClick={()=>navigate(-1)}className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">
                    Back
                </button>
            </div>
            <div className="h-[85%] lg:h-[90%] px-5 lg:px-8">
             <BasicTable headers={headers} items={decks} searchIndex={0} categoriseIndex={1} handleRowClick={handleRowClick}/>
            </div>
        </MainLayout>
    );
}

export default ActivityDeckSelectionPage;