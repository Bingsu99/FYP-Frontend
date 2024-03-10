import React, { useState, useEffect} from 'react';
import { Modal, Button, Spinner } from 'flowbite-react';
import { emptyValues} from '../CompleteSentenceDeckConfig';
import { useNavigate } from 'react-router-dom';
import {serverURL} from "../../../Constants"

// Change from array to comma seperated
function formatRowData(rowData) {
    if (!rowData || typeof rowData !== 'object') return rowData;
  
    const updatedRowData = {
      ...rowData,
      wordsToHide: rowData.wordsToHide && Array.isArray(rowData.wordsToHide) ? rowData.wordsToHide.join(', ') : '',
      incorrectWords: rowData.incorrectWords && Array.isArray(rowData.incorrectWords) ? rowData.incorrectWords.join(', ') : '',
    };
  
    return updatedRowData;
}

// Change from comma seperated to array
function parseRowData(formattedRowData) {
    if (!formattedRowData || typeof formattedRowData !== 'object') return formattedRowData;

    const parsedRowData = {
        ...formattedRowData,
        wordsToHide: formattedRowData.wordsToHide ? formattedRowData.wordsToHide.split(',').map(word => word.trim()) : [],
        incorrectWords: formattedRowData.incorrectWords ? formattedRowData.incorrectWords.split(',').map(word => word.trim()) : [],
    };

    console.log(parsedRowData)

    return parsedRowData;
} 

function CompleteSentenceModal({ isOpen, closeModal, rowData, isExisiting }) {
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [sentences, setSentences] = useState(emptyValues);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        if(rowData){
            setSentences(formatRowData(rowData))
        }
        setError("");
        setIsSaving(false);
        setIsSaved(false);
    }, [rowData]);
   
    // Function to handle the change in inputs
    const handleChange = (event) => {
        const { name, value } = event.target;
        setSentences(prevState => ({
        ...prevState,
        [name]: value
        }));
    };
    
    const validateWords = (words, sentence, shouldExist) => {
        const wordsArray = words.split(',').map(word => word.trim().toLowerCase());
        const sentenceWords = new Set(sentence.toLowerCase().split(' '));
        const wordOccurrences = wordsArray.reduce((acc, word) => {
            acc[word] = (acc[word] || 0) + 1;
            return acc;
        }, {});

        for (let word of wordsArray) {
            if (shouldExist && (!sentenceWords.has(word) || wordOccurrences[word] > 1)) {
                return `Each word to hide must appear exactly once in the sentence. The word "${word}" does not meet this criteria.`;
            }
            if (!shouldExist && sentenceWords.has(word)) {
                return `Incorrect words must not appear in the sentence. The word "${word}" is present.`;
            }
        }

        return '';
    };

    const validateUserInput = () => {
        // Reset states
        setError('');
        setIsSaved(false);

        // Perform validation
        let errorMsg = validateWords(sentences.wordsToHide, sentences.sentence, true);
        if (!errorMsg) {
            errorMsg = validateWords(sentences.incorrectWords, sentences.sentence, false);
        }

        if (errorMsg) {
            setError(errorMsg);
            return false;
        }

        return true

    }

    const handleSave = async () => {
        if (validateUserInput()){
            // If validation passes, simulate a server request
            
            var params;
            var parsedData = parseRowData(sentences)

            if (isExisiting){
                params = {
                    "activity": 0,
                    update : [
                        parsedData
                    ]
                }
            }else{
                params = {
                    "activity": 0,
                    create : [{ 
                        "_id": parsedData["_id"],
                        "exercises": [{
                            "sentence" : parsedData["sentence"], 
                            "wordsToHide": parsedData["wordsToHide"],
                            "incorrectWords": parsedData["incorrectWords"]
                            }]
                        }]
                }
            }

            console.log(params)
            const saveData = async () => {
                try {
                    const response = await fetch('http://' + serverURL + '/Decks/Update', {
                    method: 'POST',
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
            
            await saveData();

        }else{
            return;
        }
        
    };

    const handleDelete = async () => {
        var params = {
            "activity": 0,
            deleteData : [{
                "_id": sentences["_id"],
                "exerciseID": [sentences["exerciseID"]]
            }]
        }
        
        const deleteData = async () => {
            try {
                const response = await fetch('http://' + serverURL + '/Decks/Update', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(params),
                });
                setIsDeleting(true);
                const result = await response.json();
                setIsDeleting(false);
                navigate(0)
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };
        deleteData();
    };

    const handleModelClose = () =>{
        if (isSaved){
            navigate(0);
        }
        setIsSaving(false);
        setIsSaved(false);
        closeModal();
    }

    return (
        <Modal show={isOpen} size="3xl" onClose={handleModelClose}>
            <Modal.Header>
                {isExisiting? "Modify Exercise" : "Add New Exercise"}
            </Modal.Header>
            <Modal.Body>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="grid grid-cols-1 gap-6">

                <div>
                    <label className="text-lg font-medium mb-2" htmlFor="sentence">Sentence</label>
                    <input
                    id="sentence"
                    type="text"
                    name="sentence"
                    value={sentences.sentence}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="text-lg font-medium mb-2" htmlFor="wordsToHide">Word(s) to Hide</label>
                    <p className="text-sm text-gray-600 italics">Please list the words in comma separated</p>
                    <input
                    id="wordsToHide"
                    type="text"
                    name="wordsToHide"
                    value={sentences.wordsToHide}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div>
                    <label className="text-lg font-medium mb-2" htmlFor="incorrectWords">Incorrect Words</label>
                    <p className="text-sm text-gray-600 italics">Please list the words in comma separated</p>
                    <input
                    id="incorrectWords"
                    type="text"
                    name="incorrectWords"
                    value={sentences.incorrectWords}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            </Modal.Body>
            <Modal.Footer className="justify-end">
                <Button color="gray" onClick={handleDelete}>
                    {isDeleting ? (
                        <>
                            <Spinner size="sm" />
                            <span className="pl-3">Deleting...</span>
                        </>
                    ) : (
                        'Delete'
                    )}

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

export default CompleteSentenceModal;
