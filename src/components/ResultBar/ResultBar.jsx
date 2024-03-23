import React, { useState, useContext, useEffect } from 'react';
import ActivityContext from '../../context/ActivityContext';
import Correct from "../../assets/Correct.gif"
import Incorrect from "../../assets/Incorrect.gif"
import { useNavigate } from 'react-router-dom';

function ResultBar(){
    let navigate = useNavigate();
    const { nextActivity, resultDisplay } = useContext(ActivityContext);
    if (resultDisplay!==null){
        var iconIndicator = resultDisplay.isCorrect === true ? Correct : Incorrect
        var backgroundColour = resultDisplay.isCorrect === true ? "bg-green-500" : "bg-red-500"
    }
    
    const handleNextActivity = () => {
        if (!nextActivity()){
            navigate('result');
        }
    }

    return(
        <div className={`flex rounded-b-lg ${backgroundColour} h-full`}>
            {resultDisplay && 
            <>
                <div className="justify-center items-center flex">
                    <img src={iconIndicator} className="max-w-full max-h-24 h-auto object-contain"/>
                </div>

                <div className="flex-grow flex flex-col justify-center">
                    <div className="text-lg md:text-3xl md:pt-1 font-bold">
                        {resultDisplay.header}
                    </div>
                    <div className="text-md md:text-xl">
                        {resultDisplay.subheader}
                    </div>
                </div>

                <div className="flex justify-center items-center p-5">
                    <button onClick={handleNextActivity} className="bg-white text-gray-700 font-normal text-lg md:text-2xl md:py-2 py-1 px-3 md:px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out">Next</button>
                </div>
            </>}
        </div>
    )
}

export default ResultBar;