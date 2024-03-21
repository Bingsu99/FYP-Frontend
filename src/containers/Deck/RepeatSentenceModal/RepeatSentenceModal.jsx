import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Spinner } from 'flowbite-react';
import { useNavigate, useParams } from 'react-router-dom';
import { serverURL } from "../../../Constants";
import AudioHandler from '../../../components/AudioHandler/AudioHandler';

function RepeatSentenceModal({ isOpen, closeModal, rowData, isExisiting }) {
    const [newAudioView, setNewAudioView] = useState(false);
    const [newRecording, setNewRecording] = useState(null); //Contains the new audio details set by AudioHandler {file:"fileData",url:"urlToPlay"}
    const [currentPlaying, setCurrentPlaying] = useState(null);
    const [data, setData] = useState({ sentence: '', recording: '' });
    const audioRef = useRef(null);

    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    let { activity, deckID } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (rowData) {
            setData(rowData);
        }
        rowData ? getAudioAccess() : "";
        console.log("row data changed")

        setIsSaving(false);
        setIsSaved(false);
        // Reload audio when rowData changes
    }, []);

    useEffect(() => {
        if (newRecording !== null){
            console.log("running in useEffect");
            console.log(newRecording)
            setCurrentPlaying(newRecording["url"])
            // Reload audio when rowData changes
            if (audioRef.current) {
                audioRef.current.load();
            }
        }
        
    }, [newRecording]);
        
    const getAudioAccess = async () => {
        console.log(rowData["recording"])
        console.log(JSON.stringify({ key: rowData["recording"] }))
        try {
            const response = await fetch('http://' + serverURL + '/RepeatSentenceRoute/Access', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ key: rowData["recording"] }),
            });
            const result = await response.json();
            console.log(result)
            if (result["status"]==="success"){
                setCurrentPlaying(result["data"]["url"])
                if (audioRef.current) {
                    audioRef.current.load();
                }
                return;
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const saveToS3 = async () => {
        const formData = new FormData();
        formData.append('file', newRecording["file"]);
        try {
            const response = await fetch('http://' + serverURL + '/RepeatSentenceRoute/Save', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            console.log(result)
            if (result["status"]==="success"){
                return result["data"]["key"];
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const deleteFromS3 = async (recordingKey) => {
        try {
            const response = await fetch('http://' + serverURL + '/RepeatSentenceRoute/Delete', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ key: recordingKey }),
            });
            const result = await response.json();
            console.log(result)
            if (result["status"]==="success"){
                return;
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    const handleSave = async () => {
        setIsSaving(true);
        
        let params;
        if (isExisiting){
            if (newRecording!==null){
                const s3Key = await saveToS3();
                await deleteFromS3(rowData["recording"]);
                params = {
                    "activity": activity,
                    "update": [{
                        "_id" : deckID,
                        "exerciseID" : rowData["exerciseID"],
                        "sentence" : data["sentence"],
                        "recording": s3Key,
                    }]
                }
            }else{
                params = {
                    "activity": activity,
                    "update": [{
                        "_id" : deckID,
                        "exerciseID" : rowData["exerciseID"],
                        "sentence" : data["sentence"],
                        "recording": data["recording"],
                    }]
                }
            }
            
        }else{
            var s3Key = await saveToS3();
            params = {
                "activity": activity,
                "create": [{
                    "_id" : deckID,
                    "exercises": [{  "sentence" : data["sentence"], 
                                    "recording": s3Key,
                                }]
                    }
                ]
            }
        }

        

        try {
            const response = await fetch('http://' + serverURL + '/Decks/Update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(params),
            });
            const result = await response.json();
            console.log(result);
            setIsSaving(false);
            setIsSaved(true);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    };

    const handleDelete = async () => {
        let params = {
            "activity": activity,
            deleteData: [{
                "_id": data["_id"],
                "exerciseID": [data["exerciseID"]]
            }]
        };

        const deleteData = async () => {
            try {
                const response = await fetch('http://' + serverURL + '/Decks/Update', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(params),
                });
                setIsDeleting(true);
                const result = await response.json();
                setIsDeleting(false);
                navigate(0);
            } catch (error) {
                console.error('Error fetching data: ', error);
            }
        };

        await deleteData();
        await deleteFromS3(rowData["recording"]);
    };

    const handleModelClose = () => {
        if (isSaved) {
            navigate(0);
        }
        setData({ sentence: '', recording: '' });
        setIsSaving(false);
        setIsSaved(false);
        closeModal();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRecordingChange = (newRecording) => {
        setNewRecording(newRecording);
        // setData(prevData => ({ ...prevData, recording: newRecording.url }));

        // Reload the audio when new recording is set
        if (audioRef.current) {
            audioRef.current.load();
        }
    };

    return (
        <Modal show={isOpen} size="3xl" onClose={handleModelClose}>
            <Modal.Header>
                {isExisiting ? "Modify Exercise" : "Add New Exercise"}
            </Modal.Header>
            <Modal.Body>
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="text-lg font-medium mb-2" htmlFor="sentence">Sentence</label>
                        <input
                            id="sentence"
                            type="text"
                            name="sentence"
                            value={data["sentence"]}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="flex items-center space-x-4 items-end">
                        <div>
                            <label className="text-lg font-medium mb-2">Audio</label>
                            <div className="flex flex-row">
                                <audio controls ref={audioRef}>
                                    <source src={currentPlaying} key={data["recording"]} />
                                    Your browser does not support the audio element.
                                </audio>
                                <button
                                    onClick={() => setNewAudioView(true)}
                                    className="btn bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-1 mx-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                >
                                    Change Audio
                                </button>
                            </div>
                        </div>
                    </div>

                    {newAudioView && <AudioHandler isOpen={setNewAudioView} setRecording={handleRecordingChange} sentence={data["sentence"]}/>}
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

export default RepeatSentenceModal;
