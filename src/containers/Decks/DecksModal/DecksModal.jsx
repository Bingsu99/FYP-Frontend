import React, { useState, useContext } from 'react';
import { Modal, Button, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { serverURL, mapActivityToNumbers } from "../../../Constants";
import AuthContext from '../../../context/AuthContext';

function DecksModal({ isOpen, closeModal }) {
    const [isCreating, setIsCreating] = useState(false);
    const [deckName, setDeckName] = useState('');
    const [activity, setActivity] = useState(0);    //Is in numbers
    const { userID, userRole } = useContext(AuthContext);

    let navigate = useNavigate();

    const handleCloseModal = () => {
        setIsCreating(false)
        setDeckName("")
        setActivity(0)
        closeModal()
    }

    const handleDeckNameChange = (event) => {
        setDeckName(event.target.value);
    };

    const handleActivityChange = (event) => {
        setActivity(event.target.value);
    };

    const handleCreateDeck = async () => {
        if (!deckName.trim()) {
            alert("Please enter a name for the deck.");
            return;
        }
        setIsCreating(true);
        
        try {
            const response = await fetch('http://' + serverURL + '/Decks/Create', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({creator: userID, name:deckName, userType:userRole, activity: activity}),
            });
            const result = await response.json();
            console.log(result);
            navigate(activity + "/" + result["data"]["_id"])
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    return (
        <Modal show={isOpen} size="3xl" onClose={handleCloseModal}>
            <Modal.Header>
                Create New Deck
            </Modal.Header>
            <Modal.Body>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="deckName" className="block text-sm font-medium text-gray-700">Name of Deck</label>
                        <input
                            id="deckName"
                            type="text"
                            name="deckName"
                            value={deckName}
                            onChange={handleDeckNameChange}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="deckType" className="block text-sm font-medium text-gray-700">Activity</label>
                        <select
                            id="deckType"
                            name="deckType"
                            value={activity}
                            onChange={handleActivityChange}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        >
                            {Object.keys(mapActivityToNumbers).map((activityKey) => (
                                <option key={activityKey} value={mapActivityToNumbers[activityKey]}>
                                    {activityKey}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="justify-end">
                <Button color="gray" onClick={handleCloseModal}>
                    Cancel
                </Button>
                <Button 
                  color="gray" 
                  onClick={handleCreateDeck}
                  disabled={isCreating || !deckName.trim()}
                >
                    {isCreating ? (
                        <>
                            <Spinner size="sm" />
                            <span className="pl-3">Creating...</span>
                        </>
                    ) : (
                        'Create'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DecksModal;
