import React, { useContext } from 'react';
import ActivityContext from '../../context/ActivityContext';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import Complete from "../../assets/Complete.gif"
import StatCard from '../../components/StatCard/StatCard';
import { useNavigate } from 'react-router-dom';

function convertMillisecondsToMMSS(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

function CompletedActivityPage({children}) {
    const { userRole } = useContext(AuthContext);
    const { result } = useContext(ActivityContext);
    let navigate = useNavigate();

    const handleButtonClick = () => {
        navigate("/patient/activities");
    }

    var numCorrect=0;
    var exercisesCompleted=0;
    var timeSpent=0;

    result.forEach((exerciseResult)=>{
        if(exerciseResult["isCorrect"]){
            numCorrect++;
        }
        timeSpent += exerciseResult["duration"];
        exercisesCompleted++;
    })
    const accuracy = ((numCorrect/exercisesCompleted)*100).toFixed(1);

    return(
            <MainLayout user={userRole}>
                <div className="flex flex-col h-full justify-center items-center">
                    <h2 className="pt-5 text-xl md:text-3xl font-bold text-center">Exercises Completed</h2>
                    <img src={Complete} className="h-[40%] object-contain"/>
                    <div className="flex flex-row space-x-3 justify-center pb-5 md:h-[15%]">
                        <StatCard width="20%" height="100%" type={"accuracy"} content={accuracy + "%"}/>
                        <StatCard width="20%" height="100%" type={"time"} content={convertMillisecondsToMMSS(timeSpent)}/>
                        <StatCard width="20%" height="100%" type={"exercises"} content={exercisesCompleted}/>
                    </div>
                    <button onClick={()=>handleButtonClick()} className='bg-white w-[30%] text-gray-700 font-normal text-sm md:text-xl py-2 md:py-5 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out'>
                        Back to Activities
                    </button>
                </div>
            </MainLayout>
    );
}

export default CompletedActivityPage;