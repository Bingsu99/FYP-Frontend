import React, { useState, useContext, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {serverURL} from "../../Constants"
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import { numbersToActivityName } from "../../Constants"

function transformObjToArr(data) {
    // Convert the object into an array of objects with date, correctCount, and incorrectCount
    const dataArray = Object.keys(data).map(key => ({
        date: key,
        correctCount: data[key].correctCount,
        incorrectCount: data[key].incorrectCount
    }));

    // Sort the array by date in ascending order
    dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    return dataArray;
}

function StatisticPage() {
    const { userRole } = useContext(AuthContext); // Can be caregiver or therapist
    let { patientID } = useParams();
    let navigate = useNavigate();

    const [selectedIndicator, setSelectedIndicator] = useState('totalExercises');
    const [selectedTimeIndicator, setSelectedTimeIndicator] = useState('day');
    const [selectedActivity, setSelectedActivity] = useState(-1);
    const [graphData, setGraphData] = useState([])

    useEffect(() => {
        const fetchData = async () => {

            var params = {
                "_id": patientID,
                "timeIndicator": selectedTimeIndicator,
            }

            if (selectedActivity !== -1){
                params["activity"] = selectedActivity;
            }

            // Setup the range base on time indicator
            var now = new Date();
            if (selectedTimeIndicator === "day"){
                params["endDate"] = now.getTime();
                now.setHours(0, 0, 0, 0);
                params["startDate"] = now.getTime() - (7 * 24 * 60 * 60 * 1000);
            }else if (selectedTimeIndicator === "week"){
                const now = new Date();
                params["endDate"] = now.getTime();
                now.setHours(0, 0, 0, 0);
                params["startDate"] = now.getTime() - (8 * 7 * 24 * 60 * 60 * 1000);
            }

            var endpoint;
            if (selectedIndicator==="totalExercises" || selectedIndicator==="accuracy"){
                endpoint = "Stats"
            }else if (selectedIndicator==="time" || selectedIndicator==="avgTime"){
                endpoint = "TimeSpent"
            }

            // API Call
            var result;
            try {
                const response = await fetch('http://' + serverURL + '/ResultManagement/' + endpoint, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(params),
                });
                result = await response.json();
                console.log(result)
            } catch (error) {
                console.error('Error fetching data: ', error);
                return;
            }

            // Data Transformation
            if (result["status"] === "success"){
                const data = result["data"]
                var transformedData;
                if (selectedIndicator==="totalExercises" || selectedIndicator==="accuracy"){
                    const dataArray = Object.keys(data).map(key => ({
                        date: key,
                        correctCount: data[key].correctCount,
                        incorrectCount: data[key].incorrectCount,
                        accuracy: (data[key].correctCount/(data[key].correctCount+data[key].incorrectCount)).toFixed(1)
                    }));
                
                    // Sort the array by date in ascending order
                    transformedData = dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));
                }else if (selectedIndicator==="time" || selectedIndicator==="avgTime"){
                    const dataArray = Object.keys(data).map(key => ({
                        date: key,
                        totalDuration: data[key].totalDuration,
                        documentCount: data[key].documentCount,
                        avgTime: (data[key].totalDuration/data[key].documentCount).toFixed(1)
                    }));
                
                    // Sort the array by date in ascending order
                    transformedData = dataArray.sort((a, b) => new Date(a.date) - new Date(b.date));
                }
            
                setGraphData(transformedData)
            }
        };
      
        fetchData();
      }, [selectedTimeIndicator, selectedActivity, selectedIndicator]);

    const handleIndicatorChange = (event) => {
        setSelectedIndicator(event.target.value);
    };

    const handleTimeRangeChange = (event) => {
        setSelectedTimeIndicator(event.target.value);
    };

    const handleActivityChange = (event) => {
        setSelectedActivity(event.target.value);
    };

    function barsFactory(){
        switch (selectedIndicator) {
            case 'totalExercises':
                return (
                    <>
                        <Bar dataKey="correctCount" stackId="a" fill="#8884d8" />
                        <Bar dataKey="incorrectCount" stackId="a" fill="#82ca9d" />
                    </>
                );
            case 'accuracy':
                return (
                    <>
                        <Bar dataKey="accuracy" stackId="b" fill="#8884d8" />
                    </>
                );
            case 'time':
                return (
                    <>
                        <Bar dataKey="totalDuration" stackId="c" fill="#8884d8" />
                    </>
                );
            case 'avgTime':
                return (
                    <>
                        <Bar dataKey="avgTime" stackId="d" fill="#8884d8" />
                    </>
                );
            default:
              return;
          }
    }

    return(
        <MainLayout user={userRole}>
            <div className="h-full">
                <div className="h-[15%] lg:h-[10%] px-5 lg:px-8 pb-3 flex justify-between items-end ">
                    <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900">
                        Patient Statistic
                    </h2>
                    <div className="flex space-x-2 pt-5">
                        <button onClick={()=>console.log("hi")} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">
                            Exercise Log
                        </button>
                        <button onClick={()=>navigate(-1)} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">
                            Back
                        </button>
                    </div>
                </div>
                <div className="h-[85%] flex flex-col items-start h-full">
                    <div className="flex space-x-4 px-8">
                        <div className="w-auto">
                            <label htmlFor="indicator" className="block text-sm font-medium text-gray-700">
                                Indicator
                            </label>
                            <select
                                id="indicator"
                                value={selectedIndicator}
                                onChange={handleIndicatorChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="totalExercises">No. of Exercises</option>
                                <option value="accuracy">Accuracy</option>
                                <option value="time">Time Spent</option>
                                <option value="avgTime">Avg Time Spent</option>
                            </select>
                        </div>
                        <div className="w-auto">
                            <label htmlFor="select-activity" className="block text-sm font-medium text-gray-700">
                                Activity
                            </label>
                            <select
                                id="select-activity"
                                value={selectedActivity}
                                onChange={handleActivityChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value={-1}>All Activities</option>   
                                {Object.entries(numbersToActivityName).map(([activityKey, activityName]) => (
                                    <option key={activityKey+activityName} value={activityKey}>{activityName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-auto">
                            <label htmlFor="time-range" className="block text-sm font-medium text-gray-700">
                                Time Range
                            </label>
                            <select
                                id="time-range"
                                value={selectedTimeIndicator}
                                onChange={handleTimeRangeChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="day">Days</option>
                                <option value="week">Weeks</option>
                            </select>
                        </div>
                    </div>
                    <div className="w-full h-full">
                        <ResponsiveContainer width="100%" height="85%">
                            <BarChart
                                // width={600}
                                // height={300}
                                data={graphData}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            {barsFactory()}
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default StatisticPage;