import React, { useContext, useEffect, useState } from 'react';
import ActivityContext from '../../context/ActivityContext';
import MainLayout from "../../layout/MainLayout"
import AuthContext from '../../context/AuthContext';
import CompleteSentenceActivity from '../../containers/CompleteSentenceActivity/CompleteSentenceActivity';
import RepeatSentenceActivity from '../../containers/RepeatSentenceActivity/RepeatSentenceActivity';
import ProgressBar from "@ramonak/react-progress-bar";
import { useNavigate } from 'react-router-dom';
import Popup from '../../components/Popup/Popup';
import ResultBar from '../../components/ResultBar/ResultBar';
import Close from "../../assets/Close.png"

function calculateStreak(results) {
    let streak = 0;
  
    for (let result of results) {
      if (result.isCorrect) {
        streak++;
      } else {
        streak = 0;
      }
    }
  
    return streak;
}

function ActivityPage({children}) {
    const { userRole } = useContext(AuthContext);
    const { result, activities, activitiesCount, currentActivity } = useContext(ActivityContext);
    const [streak, setStreak] = useState(0)
    let navigate = useNavigate();

    // useEffect(()=>{
    //     if (activities.length === 0){
    //         navigate('/patient/activities')
    //     }
    // }, [])

    useEffect(()=>{
        setStreak(calculateStreak(result))
    }, [result])

    function handleTerminate() {
        navigate('/result');
    }

    return(
        <MainLayout user={userRole}>
            <div className="flex flex-col h-full">
                <div className="h-[20%] md:h-[7%] px-5 rounded-t-lg flex flex-col">
                    <div className=' sm:min-h-[20px] md:min-h-[35px] pt-1 pl-8'>
                        {(streak>=2) && <Popup message={streak + " in a row!"} className="sm:text-xs md:text-xl" />}
                    </div>
                    <div className='flex flex-row items-center'>
                        <div className="h-4 pr-3 cursor-pointer" onClick={handleTerminate}>
                            <img src={Close} className="h-full object-contain"/>
                        </div>
                        <div className="flex-grow">
                            <ProgressBar 
                                completed={((activitiesCount/activities.length)*100)}
                                bgColor="#0df308"
                                labelAlignment="center"
                                isLabelVisible={false}
                                labelColor="#ffffff"
                                transitionDuration="1s"
                            />
                        </div>

                    </div>
                </div>

                <div className="flex-grow flex">
                    {currentActivity["activity"]===0 ? <CompleteSentenceActivity data={currentActivity}/> : ""}
                    {currentActivity["activity"]===1 ? <RepeatSentenceActivity data={currentActivity}/> : ""}
                    
                </div>
                
                <div className="rounded-b-lg h-[15%]">  
                    <ResultBar/>
                </div>
            </div>
                
        </MainLayout>
    );
}

export default ActivityPage;