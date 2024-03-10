import React, { useState } from 'react';
import { DndContext, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import Draggable from "../../components/Draggable/Draggable";
import Droppable from "../../components/Droppable/Droppable";

function CompleteSentenceActivity({ data }) {
    const touchSensor = useSensor(TouchSensor);
    const mouseSensor = useSensor(MouseSensor);
    const sensors = useSensors(touchSensor, mouseSensor);
    const sentenceSplit = data.sentence.split(' ');
    console.log(sentenceSplit);
    var wordsToHideIndexes = [];

    sentenceSplit.forEach((word, index) => {
        if (data.wordsToHide.includes(word)) {
            wordsToHideIndexes.push(index);
        }
    });

    // Initialize a state object to keep track of which draggable is in which droppable
    // { idOfDraggable (Key) : idOfDroppable (Value) }
    const [parentAssignment, setParentAssignment] = useState({});

    console.log(parentAssignment);

    const handleDragEnd = (event) => {
        // Over is droppable, Active is for draggable
        const { active, over } = event;

        // Update which draggable is in the droppable
        if (over) {
            // Remove any previous assignment of the active draggable
            const updatedAssignment = { ...parentAssignment };
            Object.keys(updatedAssignment).forEach(key => {
                if (updatedAssignment[key] === parseInt(active.id)) {
                    delete updatedAssignment[key];
                }
            });

            // Assign the active draggable to the new droppable
            updatedAssignment[over.id] = parseInt(active.id);
            setParentAssignment(updatedAssignment);
        } else {
            // Remove the draggable from any droppable
            const updatedAssignment = { ...parentAssignment };
            Object.keys(updatedAssignment).forEach(key => {
                if (updatedAssignment[key] === parseInt(active.id)) {
                    delete updatedAssignment[key];
                }
            });
            setParentAssignment(updatedAssignment);
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <div className="grid grid-rows-3 p-5">
                <div className="row-span-1 flex flex-wrap items-center justify-center px-5">
                    {sentenceSplit.map((word, index) => (
                        data.wordsToHide.includes(word) ? (
                            <Droppable cssStyle="bg-gray-300 flex-1 border-2 m-3 max-w-[100px] min-w-[50px] h-16 flex items-center justify-center rounded" key={index} id={index.toString()}>
                                {/* Render the draggable that has been assigned to this droppable */}
                                {Object.entries(parentAssignment).filter(([key, value]) => key === index.toString()).map(([droppableId, draggableId]) => (
                                    <Draggable cssStyle="sm:text-md md:text-3xl flex-1 m-5 rounded" key={draggableId} id={draggableId.toString()}>
                                        {sentenceSplit[draggableId]}
                                    </Draggable>
                                ))}
                            </Droppable>
                        ) : (
                            <div className="sm:text-md md:text-3xl px-2" key={index}>{word}</div>
                        )
                    ))}
                </div>
                <div className="row-span-1 flex items-center justify-center px-5">
                    {/* Render draggables that are not assigned to a droppable */}
                    {wordsToHideIndexes.map((index) => (
                        !Object.values(parentAssignment).includes(index) && (
                            <Draggable cssStyle="sm:text-md md:text-3xl border-2 mx-5 px-5 py-3 rounded" key={index} id={index.toString()}>
                                {sentenceSplit[index]}
                            </Draggable>
                        )
                    ))}
                </div>
            </div>
        </DndContext>
    );
}

export default CompleteSentenceActivity;
