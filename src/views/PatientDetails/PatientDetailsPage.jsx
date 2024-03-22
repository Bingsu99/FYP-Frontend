import React, { useState, useContext, useEffect } from 'react';
import {serverURL} from "../../Constants"
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import { numbersToActivityName } from "../../Constants"
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend, Label } from 'recharts';

const data1 = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 200 },
];
  
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function PatientDetailsPage() {
    const { userRole } = useContext(AuthContext); // Can be caregiver or therapist
    const [data, setData] = useState({})
    const [decksPieChartData, setDecksPieChartData] = useState([])
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
                setDecksPieChartData(parseForChartData(result["data"]["access"]))
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
                <div className="h-full grid grid-cols-2 gap-5 p-5">
                    <div className="h-full col-span-1">
                        <div className="h-[18%] bg-white rounded-xl shadow-md p-2 lg:p-5 mb-3">
                            <h5 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white text-center">
                                Patient's Information
                            </h5>
                            <p className="text-xs lg:text-lg font-normal text-gray-700 dark:text-gray-400">
                                {"Name: " + data["name"]}
                            </p>
                            <p className="text-xs lg:text-lg font-normal text-gray-700 dark:text-gray-400">
                                {"Email: " + data["email"]}
                            </p>
                        </div>
                        <div className="h-[38%] bg-white rounded-xl shadow-md p-2 lg:p-5 mb-3 overflow-scroll" onClick={handleDeckClick}>
                            <h5 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white text-center">
                                Decks
                            </h5>
                                <ResponsiveContainer width="100%" height="85%">
                                    <PieChart>
                                    <Pie
                                        data={decksPieChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius="65%"
                                        outerRadius="85%"
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {
                                        decksPieChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                        ))
                                        }
                                        <Label value={decksPieChartData.reduce((acc, cur) => acc + cur.value, 0) + " exercises"} position="center" />
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                        </div>
                        <div className="h-[38%] bg-white rounded-xl shadow-md p-2 lg:p-5 mb-3 text-center">
                            <h5 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white text-center">
                                Daily Assignment
                            </h5>
                            <p className="text-xs lg:text-lg font-normal text-gray-700 dark:text-gray-400">
                                To Be Added
                            </p>
                        </div>
                    </div>
                    <div className="h-full col-span-1">
                        <div className="h-[18%] bg-white rounded-xl shadow-md p-2 lg:p-5 mb-3">
                            <h5 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white text-center">
                                Caregiver's Information
                            </h5>
                            <p className="text-xs lg:text-lg font-normal text-gray-700 dark:text-gray-400">
                                {"Name: " + data["caregiverName"]}
                            </p>
                            <p className="text-xs lg:text-lg font-normal text-gray-700 dark:text-gray-400">
                                {"Email: " + data["caregiverEmail"]}
                            </p>
                        </div>
                        <div className="h-[78%] bg-white rounded-xl shadow-md p-2 lg:p-5 mb-3" onClick={handleStatisticClick}>
                            <h5 className="text-sm lg:text-xl font-bold text-gray-900 dark:text-white text-center">
                                Statistics
                            </h5>
                            <p className="text-xs lg:text-lg font-normal text-gray-700 dark:text-gray-400">
                                To be added
                            </p>
                        </div>
                    </div> 
                </div>
        </MainLayout>
    );
}

function parseForChartData(data) {
    const result = [];

    for (const key in data) {
        if (data.hasOwnProperty(key)) {
        const value = data[key];
        // Remove duplicate entries by converting to a Set and back to an array
        const uniqueValues = [...new Set(value)];
        result.push({ name: numbersToActivityName[key], value: uniqueValues.length });
        }
    }

    return result;
}

export default PatientDetailsPage;