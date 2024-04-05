import React, { useState, useEffect, useContext } from 'react';
import { DndContext, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import ActivityContext from '../../context/ActivityContext';
import Draggable from "../../components/Draggable/Draggable";
import Droppable from "../../components/Droppable/Droppable";
import AuthContext from '../../context/AuthContext';
import { serverURL } from '../../Constants';

function CompleteSentenceActivity({ data }) {
    const touchSensor = useSensor(TouchSensor);
    const mouseSensor = useSensor(MouseSensor);
    const [isButtonActive, setIsButtonActive] = useState(false);
    const [isButtonHidden, setIsButtonHidden] = useState(false);
    const sensors = useSensors(touchSensor, mouseSensor);
    const { activityStartTime, handleEndOfActivity } = useContext(ActivityContext);
    const { userRole, userID } = useContext(AuthContext);
    const sentenceSplit = data.sentence.split(' ');
    const wordsOptions = data.wordsToHide.concat(data.incorrectWords);

    var wordsToHideIndexes = [];
    sentenceSplit.forEach((word, index) => {
        if (data.wordsToHide.includes(word)) {
            wordsToHideIndexes.push(index);
        }
    });

    useEffect(()=>{
        setParentAssignment(wordsToHideIndexes.reduce((acc, cur) => ({ ...acc, [cur]: null }), {}))
        setIsButtonHidden(false)
        setIsButtonActive(false)
    }, [data])

    // Initialize a state object to keep track of which draggable is in which droppable
    // { idOfDraggable (Key) : idOfDroppable (Value) }
    const [parentAssignment, setParentAssignment] = useState(wordsToHideIndexes.reduce((acc, cur) => ({ ...acc, [cur]: null }), {}));

    console.log(parentAssignment);

    const handleDragEnd = (event) => {
        // Over is droppable, Active is for draggable
        const { active, over } = event;

        // Update which draggable is in the droppable
        if (over) {
            // Remove any previous assignment of the active draggable
            const updatedAssignment = { ...parentAssignment };
            Object.keys(updatedAssignment).forEach(key => {
                if (updatedAssignment[key] === active.id) {
                    updatedAssignment[key] = null;
                }
            });

            // Assign the active draggable to the new droppable
            updatedAssignment[over.id] = active.id;
            setParentAssignment(updatedAssignment);
        } else {
            // Remove the draggable from any droppable
            const updatedAssignment = { ...parentAssignment };
            Object.keys(updatedAssignment).forEach(key => {
                if (updatedAssignment[key] === active.id) {
                    updatedAssignment[key] = null;
                }
            });
            setParentAssignment(updatedAssignment);
        }
    };

    // To Enable or Disable the button
    useEffect(() => {
        const allFilled = !Object.values(parentAssignment).some(value => value === null);
        if (allFilled) {
            setIsButtonActive(true);
        }else{
            setIsButtonActive(false);
        }
    }, [parentAssignment]);

    async function handleSubmit() {   
        setIsButtonHidden(true)
        const activityDuration = Date.now() - activityStartTime;
        var resultantArray = [...sentenceSplit];
        for (const [key, value] of Object.entries(parentAssignment)) {
            resultantArray[parseInt(key)] = wordsOptions.find(option => option === value) || resultantArray[parseInt(key)];
        }
        const userResponse = resultantArray.join(' ');
        const isCorrect = userResponse === data.sentence;
        console.log('Is user response correct:', isCorrect);
        var params = {
            deckID: data["deckID"],
            userID: userID,
            sentence: data["sentence"],
            wordsToHide: data["wordsToHide"],
            incorrectWords: data["incorrectWords"],
            response: userResponse,
            isCorrect: isCorrect,
            duration: activityDuration,
        }
        try {
            if (userRole === "patient"){
                const response = await fetch('http://' + serverURL + '/ActivityResult/Add', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "activity": 0,
                    "params": params
                    
                }),
            });
            const result = await response.json();
            console.log(result)
            }
            
            isCorrect ? handleEndOfActivity(isCorrect, activityDuration, correctHeader, correctSubHeader):handleEndOfActivity(isCorrect, activityDuration, incorrectHeader, incorrectSubHeader);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <div className="flex flex-col sm:space-y-2 md:space-y-5 w-full">
                <div className="h-[15%] sm:text-md md:text-2xl font-bold sm:py-3 sm:px-5 md:p-5">
                    Complete the Sentence
                </div>
                <div className="h-[20%] flex justify-center px-3">
                    <div className="flex flex-wrap justify-center items-end">
                        {sentenceSplit.map((word, index) => (
                            data.wordsToHide.includes(word) ? (
                                <Droppable cssStyle="min-h-[60px] min-w-[125px] max-w-[125px] flex-1 mx-2 border-b border-gray-400 flex items-end justify-center rounded" key={index} id={index.toString()}>
                                    {/* Render the draggable that has been assigned to this droppable */}
                                    {Object.entries(parentAssignment).filter(([key, value]) => key === index.toString()).map(([droppableId, draggableWord]) => {
                                        return (
                                        <Draggable cssStyle={`${draggableWord?"border-2":""} sm:text-md md:text-3xl mb-1 px-3 py-1 rounded`} key={draggableWord} id={draggableWord}>
                                            {draggableWord}
                                        </Draggable>)
                                    })}
                                </Droppable>
                            ) : (
                                <div className="sm:text-md md:text-3xl px-2" key={index}>{word}</div>
                            )
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap h-[40%] items-center justify-center px-5 space-x-5">
                    {/* Render draggables that are not assigned to a droppable */}
                    {wordsOptions.map((word) => (
                        !Object.values(parentAssignment).includes(word) && (
                            <Draggable cssStyle="sm:text-md md:text-3xl border-2 px-3 py-1 rounded" key={word} id={word}>
                                {word}
                            </Draggable>
                        )
                    ))}
                </div>
                <div className="flex h-[10%] items-center justify-center">
                    {!isButtonHidden && <button 
                        onClick={handleSubmit} 
                        disabled={!isButtonActive} 
                        className={`${
                            isButtonActive
                            ? "bg-white text-gray-700 shadow-md"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        } font-normal text-lg md:text-3xl py-2 px-4 rounded focus:outline-none transform transition duration-300 ease-in-out`}
                        >
                        Submit
                    </button>}
                </div>
                
            </div>
            
        </DndContext>
    );
}

const correctHeader = "You got it right!";
const correctSubHeader = "Let's try the next activity";
const incorrectHeader = "You got it wrong";
const incorrectSubHeader = "Let's try the next activity";

export default CompleteSentenceActivity;
