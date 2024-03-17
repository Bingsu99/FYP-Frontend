import React, { useState, useContext, useEffect } from 'react';
import ActivityContext from '../../context/ActivityContext';
import Correct from "../../assets/Correct.png"
import Incorrect from "../../assets/Incorrect.png"

function ResultBar({children}) {
    // const [isResultState, setIsResultState] = useState(false);
    const { nextActivity, resultDisplay } = useContext(ActivityContext);


    return(
        <>
            {resultDisplay!==null && resultBar(resultDisplay.isCorrect, resultDisplay.header, resultDisplay.subheader, nextActivity)}
        </>
    );
}

export default ResultBar;

function resultBar(result, header, subheader, onNext){
    var iconIndicator = result === true ? Correct : Incorrect
    var backgroundColour = result === true ? "bg-green-500" : "bg-red-500"
    return(
        <div className={"grid grid-cols-12 rounded-b-lg " + backgroundColour}>
            <div className="col-span-2 lg:col-span-1 p-3 flex justify-center items-center">
                <img src={iconIndicator} className="max-w-full max-h-24 h-auto object-contain"/>
            </div>

            <div className="col-span-8 lg:col-span-9 p-3">
                <div className="text-lg md:text-3xl md:pt-1 font-bold">
                    {header}
                </div>
                <div className="text-md md:text-xl">
                    {subheader}
                </div>
            </div>
            <div className="col-span-2 p-3 flex justify-center items-center">
                <button onClick={onNext} className="bg-white text-gray-700 font-normal text-lg md:text-2xl md:py-2  py-1 px-3 md:px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out">Next</button>
            </div>
        </div>
    )
}