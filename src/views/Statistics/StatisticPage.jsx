import React, { useState, useContext, useEffect } from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {serverURL} from "../../Constants"
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import { numbersToActivityName } from "../../Constants"

const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];

function StatisticPage() {
    const { userRole } = useContext(AuthContext); // Can be caregiver or therapist
    let { patientID } = useParams();
    let navigate = useNavigate();

    const [selectedTimeRange, setSelectedTimeRange] = useState('day');
    const [selectedActivity, setSelectedActivity] = useState(0);

    const handleTimeRangeChange = (event) => {
        setSelectedTimeRange(event.target.value);
    };

    const handleActivityChange = (event) => {
        setSelectedActivity(event.target.value);
    };

    useEffect(() => {
        // const fetchData = async () => {
        //   try {
        //     const response = await fetch('http://' + serverURL + '/Patient/Details', {
        //       method: 'POST',
        //       headers: {'Content-Type': 'application/json'},
        //       body: JSON.stringify({
        //         "_id": patientID,
        //       }),
        //     });
        //     const result = await response.json();
        //     console.log(result["data"])
        //     if (result["status"] === "success"){
        //         setData(result["data"])
        //     }
            
        //   } catch (error) {
        //     console.error('Error fetching data: ', error);
        //   }
        // };
      
        // fetchData();
      }, []);

    return(
        <MainLayout user={userRole}>
            <div className="grid grid-rows-12 gap-2 px-5">
                <div className="flex justify-between">
                    <h2 className="text-3xl font-extrabold text-gray-900 pl-2 pt-5">
                        Patient Statistic
                    </h2>
                    <div className="flex space-x-2 pt-5">
                        <button onClick={""} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">
                            Exercise Log
                        </button>
                        <button onClick={()=>navigate(-1)} className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out">
                            Back
                        </button>
                    </div>
                </div>
                <div className="grid row-span-11 gap-2">
                    <div className="flex space-x-4 px-8">
                        <div className="w-1/2">
                            <label htmlFor="mui-style-dropdown1" className="block text-sm font-medium text-gray-700">
                                Activity
                            </label>
                            <select
                                id="mui-style-dropdown1"
                                value={selectedActivity}
                                onChange={handleActivityChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value={-1}>All Activities</option>   
                                {Object.entries(numbersToActivityName).map(([activityKey, activityName]) => (
                                    <option value={activityKey}>{activityName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-1/2">
                            <label htmlFor="mui-style-dropdown2" className="block text-sm font-medium text-gray-700">
                                Time Range
                            </label>
                            <select
                                id="mui-style-dropdown2"
                                value={selectedTimeRange}
                                onChange={handleTimeRangeChange}
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                                <option value="day">Days</option>
                                <option value="week">Weeks</option>
                            </select>
                        </div>
                    </div>
                    <div className="row-span-11">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                width={600}
                                height={300}
                                data={data}
                                margin={{
                                    top: 20,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="pv" stackId="a" fill="#8884d8" />
                            <Bar dataKey="uv" stackId="a" fill="#82ca9d" />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default StatisticPage;