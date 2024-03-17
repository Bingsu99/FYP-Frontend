import React, { useState, useEffect, useContext} from 'react';
import BasicTable from '../../components/BasicTable/BasicTable';
import { serverURL } from "../../Constants"
import { useNavigate } from 'react-router-dom';
import {headers, parseToTableContent} from "./PatientListConfig"
import AuthContext from '../../context/AuthContext';

function PatientList() {
  const [decks, setDecks] = useState([]);
  let navigate = useNavigate();
  
  const { userID, userRole } = useContext(AuthContext);

  // New page for displaying userInfo
  const handleRowClick = (metaData) => {
      navigate(metaData["deckID"]);
  } 

  // Endpoint to get list of patients
  useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://' + serverURL + '/'+ userRole +'/GetPatients', {
            method: 'POST', // Specify the method as POST
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              "_id": userID,
            }),
          });
          const result = await response.json();
          setDecks(parseToTableContent(result["data"]));
        } catch (error) {
          console.error('Error fetching data: ', error);
        }
      };
    
      fetchData();
    }, []);

  return(
        <>
            <div className="h-[15%] lg:h-[10%] px-5 lg:px-8 pb-3 flex justify-between items-end ">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                  {userRole == "therapist" ? "My Patients" : "My Care Recepients"}
                </h2>
            </div>
            <div className="h-[85%] lg:h-[90%] px-5 lg:px-8">
                <BasicTable headers={headers} items={decks} searchIndex={0} categoriseIndex={0} handleRowClick={handleRowClick}/>
            </div>
        </>
  );
}

export default PatientList;
