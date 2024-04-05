import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button } from 'flowbite-react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicTable from '../../../components/BasicTable/BasicTable';
import AuthContext from '../../../context/AuthContext';
import { serverURL, numbersToActivityName } from '../../../Constants';
import { onRemoveAccessHandler, onAddAccessHandler } from '../PatientDeckListConfig';

function AddDeckAccessModal({ isOpen, closeModal, patientAccess}) {
  const { userID } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [buttonStates, setButtonStates] = useState([]); //False is Remove Action, True is add action

  let { patientID } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCreatorAccessDecks = await fetch(`http://${serverURL}/Decks/Creator`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({_id: userID}),
        });
        const result = await responseCreatorAccessDecks.json();
        if (result["status"] === "success") {
            var tempButtonStates = []
            result["data"].forEach(exercise => {
                if (patientAccess.includes(exercise["_id"])){
                    tempButtonStates.push(false) //false if cannot add
                }else{
                    tempButtonStates.push(true) //true if can add
                }
            });
            setButtonStates(tempButtonStates);
            setData(result["data"]);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, [userID, patientAccess]);

  const parseToTableContent = (data) => {
    async function onClickHandler(indx, activity, deckID, patientID) {
        const functionToUse = buttonStates[indx] ? onAddAccessHandler : onRemoveAccessHandler;
        const result = await functionToUse(activity, deckID, patientID);
    
        // Assuming result is truthy if the operation succeeded
        if (result) {
            setButtonStates(currentArray => {
            const updatedArray = [...currentArray];
            updatedArray[indx] = !updatedArray[indx]; // Toggle the boolean state
            return updatedArray;
            });
        }
    }
  
    return data.map((rowData, indx) => {
      return {
        tableData: [
          rowData["name"],
          numbersToActivityName[rowData["activity"]],
          rowData["numOfExercises"],
          <button
            key={indx}  // Adding key for React tracking
            onClick={() => onClickHandler(indx, rowData["activity"], rowData["_id"], patientID)}
            className="bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transition duration-300 ease-in-out"
          >
            {buttonStates[indx] ? "Add" : "Remove"}
          </button>
        ],
        metaData: { deckID: rowData["_id"], activity: rowData["activity"] },
      };
    });
  };

  function handleCloseModal(){
    closeModal()
    navigate(0)
  };

   const headers = ["Name", "Activity", "Number of Exercise", "Action"];

  return (
    <Modal show={isOpen} size="3xl" onClose={handleCloseModal} dismissible>
      <Modal.Header>Add Deck Access</Modal.Header>
      <Modal.Body className='p-0'>
        <div className="p-5">
            <BasicTable headers={headers} items={parseToTableContent(data)} searchIndex={0} categoriseIndex={1} handleRowClick={""} height={55}/>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button color="gray" onClick={handleCloseModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddDeckAccessModal;
