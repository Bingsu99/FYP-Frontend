import React, { useState } from 'react';
import { DndContext, TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import Draggable from "../../components/Draggable/Draggable";
import Droppable from "../../components/Droppable/Droppable";

function CompleteSentenceActivity({ data }) {
    const touchSensor = useSensor(TouchSensor);
    const mouseSensor = useSensor(MouseSensor);
    const sensors = useSensors(touchSensor, mouseSensor);
    const sentenceSplit = data.sentence.split(' ');
    var wordsToHideIndexes = [];

    sentenceSplit.forEach((word, index) => {
        if (data.wordsToHide.includes(word)) {
            wordsToHideIndexes.push(index);
        }
    });

    // Initialize a state object to keep track of parent for each draggable
    // { indexOfHiddenWord (Key) : indexOfTheBoxItIsAt (Value) }
    const [parents, setParents] = useState(wordsToHideIndexes.reduce((acc, cur) => ({ ...acc, [cur]: null }), {}));

    console.log(parents);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        // Update the parent for the active draggable
        if (over) {
            // Check if the target droppable already has a draggable assigned to it
            const isOverDroppableOccupied = Object.values(parents).includes(parseInt(over.id));

            if (!isOverDroppableOccupied || parseInt(parents[active.id]) === parseInt(over.id)) {
                // Update the parent for the active draggable if the target droppable is empty
                // Or the draggable is moved within the same droppable
                setParents((prevParents) => ({
                    ...prevParents,
                    [active.id]: parseInt(over.id),
                }));
            }
        } else {
            // If not dropped over a droppable, reset the parent for this draggable
            setParents((prevParents) => ({
                ...prevParents,
                [active.id]: null,
            }));
        }
    };

    return (
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
            <div className="grid grid-rows-3 p-5">
                {/* Parent is used to track draggable (key) is at which droppable (value) */}
                {/* If word is to be hidden, put droppable. */}
                <div className="row-span-1 flex flex-wrap items-center justify-center px-5">
                    {sentenceSplit.map((aWordInSentence, aWordInSentenceIndex) => (
                        wordsToHideIndexes.includes(aWordInSentenceIndex) ? (
                            <Droppable cssStyle="bg-gray-300 flex-1 border-2 m-3 max-w-[100px] min-w-[50px] h-16 flex items-center justify-center rounded" key={aWordInSentenceIndex} id={aWordInSentenceIndex}>
                                {/* Show draggable in droppable if from parents, it identifies that this draggable contains the droppable*/}
                                {wordsToHideIndexes.filter(indexOfHiddenWord => parents[indexOfHiddenWord] === aWordInSentenceIndex).map(indexOfHiddenWord => (
                                    <Draggable cssStyle="sm:text-md md:text-3xl flex-1 m-5 rounded" key={indexOfHiddenWord} id={indexOfHiddenWord}>
                                        {sentenceSplit[indexOfHiddenWord]}
                                    </Draggable>
                                ))}
                            </Droppable>
                        ) : (
                            <div className="sm:text-md md:text-3xl" key={aWordInSentenceIndex} >{aWordInSentence}</div>
                        )
                    ))}
                </div>
                <div className="row-span-1 flex items-center justify-center px-5">
                    {/* Show draggable if draggable is not allocated */}
                    {wordsToHideIndexes.map((indexOfHiddenWord) => (
                        parents[indexOfHiddenWord] === null && (
                            <Draggable cssStyle="sm:text-md md:text-3xl border-2 mx-5 px-5 py-3 rounded" key={indexOfHiddenWord} id={indexOfHiddenWord}>
                                {sentenceSplit[indexOfHiddenWord]}
                            </Draggable>
                        )
                    ))}
                </div>
            </div>
        </DndContext>
    );
}

export default CompleteSentenceActivity;
