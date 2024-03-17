import React, { useState, useContext, useEffect } from 'react';
import {serverURL} from "../../Constants"
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import { numbersToActivityName } from "../../Constants"

function PatientDetailsPage() {
    const { userRole } = useContext(AuthContext); // Can be caregiver or therapist
    const [data, setData] = useState({})
    let { patientID } = useParams();
    let navigate = useNavigate();


    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch('http://' + serverURL + '/Patient/Details', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                "_id": patientID,
              }),
            });
            const result = await response.json();
            console.log(result["data"])
            if (result["status"] === "success"){
                setData(result["data"])
            }
            
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        };
      
        fetchData();
      }, []);

      function handleDeckClick(){
        navigate("Decks/");
      }

      function handleStatisticClick(){
        navigate("Statistic/");
      }

    return(
        <MainLayout user={userRole}>
            <div className="grid grid-cols-2 gap-5 p-10">
                <div className="col-span-1">
                    <div className="grid grid-rows-8 gap-5 h-full">
                        <div className="row-span-2 bg-white rounded-xl shadow-md p-5">
                            <h5 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                                Patient's Information
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                {"Name: " + data["name"]}
                            </p>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                {"Email: " + data["email"]}
                            </p>
                        </div>
                        <div className="row-span-2 bg-white rounded-xl shadow-md p-5" onClick={handleDeckClick}>
                            <h5 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                                Decks
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                {data["access"] && Object.entries(data["access"]).map(([exercise, arrOfExerciseID]) => (
                                    <span key={exercise}>
                                        {numbersToActivityName[exercise] + ": " + arrOfExerciseID.length}
                                    </span>
                                ))}
                            </p>
                        </div>
                        <div className="row-span-4 bg-white rounded-xl shadow-md p-5 text-center">
                            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                                Daily Assignment
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                To Be Added
                            </p>
                        </div>
                        
                        
                        
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="grid grid-rows-8 gap-5">
                        <div className="row-span-2 bg-white rounded-xl shadow-md p-5">
                            <h5 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                                Caregiver's Information
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                {"Name: " + data["caregiverName"]}
                            </p>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                {"Email: " + data["caregiverEmail"]}
                            </p>
                        </div>
                        <div className="row-span-6 bg-white rounded-xl shadow-md p-5" onClick={handleStatisticClick}>
                            <h5 className="text-xl font-bold text-gray-900 dark:text-white text-center">
                                Statistics
                            </h5>
                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                To be added
                            </p>
                        </div>
                    </div>
                </div> 
            </div>
        </MainLayout>
    );
}

export default PatientDetailsPage;