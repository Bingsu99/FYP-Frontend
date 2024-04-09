import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Spinner } from 'flowbite-react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicTable from '../../../components/BasicTable/BasicTable';
import AuthContext from '../../../context/AuthContext';
import { serverURL, numbersToActivityName } from '../../../Constants';

function DailyAssignmentModal({ isOpen, closeModal, activity, numOfExercises, decks}) {
    const { userID } = useContext(AuthContext);
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [newExerciseNum, setNewExerciseNum] = useState(numOfExercises || 0);
    const [isOutOfRange, setIsOutOfRange] = useState(false);
    const [selectedDecks, setSelectedDecks] = useState(decks || {});
    const [accessDecks, setAccessDecks] = useState([]);
    const [buttonStates, setButtonStates] = useState([]); //False is Remove Action, True is add action

    let { patientID } = useParams();
    let navigate = useNavigate();

    const fetchData = async () => {
        try {
            const responsePatientDecks = await fetch(`http://${serverURL}/Decks/Access`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({_id: patientID, activity}),
            });
            const result = await responsePatientDecks.json();
            if (result["status"] === "success") {
                var tempButtonStates = []
                result["data"].forEach(exercise => {
                    if (selectedDecks.includes(exercise["_id"])){
                        tempButtonStates.push(false) //false if cannot add
                    }else{
                        tempButtonStates.push(true) //true if can add
                    }
                });
                setButtonStates(tempButtonStates);
                setAccessDecks(result["data"]);
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    function onClickHandler(indx) {
        if(buttonStates[indx] === false){
            setSelectedDecks(selectedDecks.filter(deck => deck !== accessDecks[indx]["_id"]));
        }else{
            setSelectedDecks(currentArray => {
                const updatedArray = [...currentArray];
                updatedArray.push(accessDecks[indx]["_id"])
                return updatedArray;
            });
        }

        setButtonStates(currentArray => {
            const updatedArray = [...currentArray];
            updatedArray[indx] = !updatedArray[indx];
            return updatedArray;
        });
    }

    const parseToTableContent = (accessDecks) => {
        return accessDecks.map((rowData, indx) => {
            return {
                tableData: [
                    rowData["name"],
                    rowData["numOfExercises"],
                    <button
                        key={indx}
                        onClick={() => onClickHandler(indx)}
                        className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out"
                    >
                        {buttonStates[indx] ? "Add" : "Remove"}
                    </button>
                ],
                metaData: { deckID: rowData["_id"], activity: rowData["activity"] },
            };
        });
    };

    const handleExerciseNumChange = (e) => {
        let value = e.target.value;

        if (value === '') {
            setIsOutOfRange(false);
            setNewExerciseNum(value);
        } else {
            const numValue = parseInt(value, 10);
            if (numValue >= 0 && numValue <= 99) {
                setIsOutOfRange(false);
                setNewExerciseNum(numValue);
            } else {
                setIsOutOfRange(true);
            }
        }
    };

    const handleSave = async () => {
        const params = {
            "_id" : patientID,
            "activity": activity,
            "decks": selectedDecks,
            "numExercises": newExerciseNum
        }
        try {
            const response = await fetch('http://' + serverURL + '/Decks/DailyAssignment', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(params),
            });
            setIsSaving(true);
            const result = await response.json();
            console.log(result)
            setIsSaving(false);
            setIsSaved(true);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }

    };

    function handleCloseModal(){
        closeModal()
        navigate(0)
    };

    const headers = ["Name", "Number of Exercise", "Action"];

    return (
        <Modal show={isOpen} size="3xl" onClose={handleCloseModal} dismissible>
        <Modal.Header>Modify Daily Assignment</Modal.Header>
        <Modal.Body className='p-0'>
        <div className='p-5 pb-0'>
            <label htmlFor="numberInput">Number of Exercise: </label>
            <input
                type="number"
                id="numberInput"
                value={newExerciseNum}
                onChange={handleExerciseNumChange}
                className='rounded-md w-16 text-center'
                min={0}
                max={99}
            />
            {isOutOfRange && (
                <p className="text-red-500 text-xs mt-2">
                    Number must be between 0-99.
                </p>
            )}
        </div>
            <div className="p-5">
                <BasicTable headers={headers} items={parseToTableContent(accessDecks)} searchIndex={0} categoriseIndex={1} handleRowClick={""} height={55}/>
            </div>
        </Modal.Body>
        <Modal.Footer className="justify-end">
            <Button color="gray" onClick={handleCloseModal}>
            Close
            </Button>
            {!isSaved ? (
                <Button color="gray" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                        <>
                            <Spinner size="sm" />
                            <span className="pl-3">Saving...</span>
                        </>
                    ) : (
                        'Save'
                    )}
                </Button>
            ) : (
                <Button color="gray" disabled>
                    Saved
                </Button>
            )}
        </Modal.Footer>
        </Modal>
    );
}

export default DailyAssignmentModal;
