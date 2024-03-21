import React, { useState, useEffect, useContext } from 'react';
import ActivityContext from '../../context/ActivityContext';
import AuthContext from '../../context/AuthContext';
import { serverURL } from '../../Constants';
import AudioRecorder from '../../components/AudioRecorder/AudioRecorder';

function RepeatSentenceActivity({ data }) {
    const { activityStartTime, setDisplayResponse } = useContext(ActivityContext);
    const { userID } = useContext(AuthContext);
    const [wordsInSentence, setWordsInSentence] = useState([]);
    const [isRecorded, setRecorded] = useState(false);
    const [recording, setRecording] = useState(null);

    console.log(isRecorded)

    useEffect(() => {
        console.log(data)
        getAudioAccess();
        setWordsInSentence(data["sentence"].split(" "))
    }, []);

    const playAudio = () => {   
        recording.play()
          .catch(error => {
            console.error("Error occurred while playing audio:", error);
          });
    };

    const getAudioAccess = async () => {
        try {
            const response = await fetch('http://' + serverURL + '/RepeatSentenceRoute/Access', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ key: data["recording"] }),
            });
            const result = await response.json();
            console.log(result)
            if (result["status"]==="success"){
                setRecording(new Audio(result["data"]["url"]))
                return;
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    async function handleSubmit() {   
        const activityDuration = Date.now() - activityStartTime;
        
        const isCorrect = "Validation Function to Check if Correct or Wrong";

        var params = {
            deckID: data["deckID"],
            userID: userID,
            isCorrect: isCorrect,
            duration: activityDuration,
        }
        try {
            const response = await fetch('http://' + serverURL + '/ActivityResult/Add', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                "activity": data["activity"],
                "params": params
                
              }),
            });
            const result = await response.json();
            console.log(result)
            isCorrect ? setDisplayResponse(isCorrect, correctHeader, correctSubHeader):setDisplayResponse(isCorrect, incorrectHeader, incorrectSubHeader);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
            <div className="flex mb-4 space-x-2 justify-center w-full">
                {wordsInSentence.map((word)=>
                    <div key={word} className="sm:text-md md:text-3xl border-2 mx-5 px-5 py-3 rounded bg-gray-300">{word}</div>
                )}
            </div>
            
            <button 
                className="mb-4 bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded w-1/4"
                onClick={playAudio}
            >
                Play Sentence
            </button>
            
            <div className="flex space-x-4 justify-center w-full">
                <AudioRecorder onRecordingComplete={setRecorded}/>
            </div>

            <div className="flex items-center justify-center">
                <button 
                    onClick={handleSubmit} 
                    disabled={!isRecorded} 
                    className={`${
                        isRecorded
                        ? "bg-white text-gray-700 hover:shadow-md"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    } font-normal h-20 w-36 text-lg md:text-3xl rounded focus:outline-none transform transition duration-300 ease-in-out`}
                    >
                    Submit
                </button>
            </div>

            
        </div>
      );
}

const correctHeader = "You got it right!";
const correctSubHeader = "Let's try the next activity";
const incorrectHeader = "You got it wrong";
const incorrectSubHeader = "Let's try the next activity";

export default RepeatSentenceActivity;
