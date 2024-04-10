import React, { useState, useContext, useEffect } from 'react';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import AssignmentContext from '../../context/AssigmentContext';
import ActivityContext from '../../context/ActivityContext';
import DailyStreak from '../../components/DailyStreak/DailyStreak';
import DailyAssigment from '../../components/DailyAssignment/DailyAssignment';
import { useNavigate } from 'react-router-dom';
import { serverURL } from '../../Constants';
import plant1 from "../../assets/plant1.png";
import plant2 from "../../assets/plant2.png";
import plant3 from "../../assets/plant3.png";
import plant4 from "../../assets/plant4.png";
import plant5 from "../../assets/plant5.png";
import plant6 from "../../assets/plant6.png";
import plant7 from "../../assets/plant7.png";
import plant8 from "../../assets/plant8.png";

function HomePage() {
    const [plant, setPlant] = useState(plant1);
    const [progress, setProgress] = useState(0);
    const { userRole, name, userID } = useContext(AuthContext);
    const { loadActivities } = useContext(ActivityContext);
    const { initialiseAssignmentDetails, streak, records, requirements, lastUpdatedDate } = useContext(AssignmentContext);
    let navigate = useNavigate();

    async function fetchUserData(){
        try {
            const response = await fetch('http://' + serverURL + "/Patient/Details", {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ "_id": userID }),
            });

            const result = await response.json();
            console.log(result)
            if (result["status"] === "success") {
                initialiseAssignmentDetails(result["data"]["dailyStreak"]["completed"], result["data"]["dailyAssignmentRecord"]["completed"], result["data"]["dailyAssignment"]["exerciseRequirements"], result["data"]["dailyAssignmentRecord"]["lastUpdated"])
            }
            
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
    }

    useEffect(()=>{
        fetchUserData()
    }, [])

    
    useEffect(()=>{
        if (isToday(lastUpdatedDate)){
            var requiredExerciseNums = Object.values(requirements).reduce((sum, value) => {
                                            return Number.isInteger(value) ? sum + value : sum;
                                        }, 0)
            var completedExerciseNums = Object.values(records).reduce((sum, array) => {
                                            return sum + array.length
                                        }, 0)
            setProgress(((completedExerciseNums/requiredExerciseNums) * 100).toFixed(1));
        }else{
            setProgress(0);
        }
        
        switch (streak) {
            case 0:
                setPlant(plant1);
                break;
            case 1:
                setPlant(plant2);
                break;
            case 2:
                setPlant(plant3);
                break;
            case 3:
                setPlant(plant4);
                break;
            case 4:
                setPlant(plant5);
                break;
            case 5:
                setPlant(plant6);
                break;
            case 6:
                setPlant(plant7);
                break;
            default:
                setPlant(plant8);
                break;
        }
    }, [lastUpdatedDate])

    async function handleAssignmentClick(){
        try {
            const response = await fetch('http://' + serverURL + "/Decks/ExecuteDailyAssignment", {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ "_id": userID }),
            });

            const result = await response.json();
            console.log(result)
            if (result["status"] === "success") {
                loadActivities(result["data"]);
                navigate("/activity");
            }
            
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
    }

    return(
        <MainLayout user={userRole}>
            <div className='flex flex-col h-full w-full pb-0'>
                <h2 className="text-xl md:text-4xl p-5 md:p-8 font-extrabold ">{"Welcome back, " + name + "."}</h2>
                <div className='flex flex-row flex-grow overflow-hidden'>
                    <div className="flex flex-col justify-end h-full w-full overflow-hidden">
                        <img src={plant} className="max-h-full w-auto object-contain"/>
                    </div>
                    
                    <div className="flex flex-col space-y-5 w-[40%] pr-8">
                        <div className='h-[10%]'></div>
                        <DailyStreak dayStreak={streak}/>
                        <DailyAssigment progress={progress} onClick={parseInt(progress) < 100 ? handleAssignmentClick : ()=>""} />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

function isToday(dateString) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const inputDate = new Date(dateString);
    inputDate.setHours(0, 0, 0, 0);

    return inputDate.getTime() === today.getTime();
}

export default HomePage;