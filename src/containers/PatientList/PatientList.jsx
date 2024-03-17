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
        <div className="grid grid-rows-12 overflow-y-auto">
            <div className="grid row-span-1 grid-cols-12 gap-3 px-5 items-end">
                <h2 className="text-3xl col-span-10 font-extrabold text-gray-900 pl-2 pt-5">
                {userRole == "therapist" ? "My Patients" : "My Care Recepients"}
                </h2>
            </div>
            <div className="row-span-11">
                <BasicTable headers={headers} items={decks} searchIndex={0} categoriseIndex={0} handleRowClick={handleRowClick}/>
            </div>
        </div>
  );
}

export default PatientList;
