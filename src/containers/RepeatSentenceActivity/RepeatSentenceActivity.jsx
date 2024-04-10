import React, { useState, useEffect, useContext } from 'react';
import ActivityContext from '../../context/ActivityContext';
import AuthContext from '../../context/AuthContext';
import { serverURL } from '../../Constants';
import AudioRecorder from '../../components/AudioRecorder/AudioRecorder';
import SentenceSlot from '../../components/SentenceSlot/SentenceSlot';
import gestaltSimilarity from "gestalt-pattern-matcher";

function RepeatSentenceActivity({ data }) {
    const { activityStartTime, handleEndOfActivity } = useContext(ActivityContext);
    const { userID } = useContext(AuthContext);
    const [isLoading, setIsLoading] = useState(false);
    const [wordsInSentence, setWordsInSentence] = useState([]);
    const [isRecorded, setRecorded] = useState(null);
    const [recording, setRecording] = useState(null);
    const [forceReset, setForceReset] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        console.log(data)
        getAudioAccess();
        setWordsInSentence(data["sentence"].split(" "))
        setForceReset((prev)=>!prev);
        setRecorded(null)
        setSubmitted(false)
    }, [data]);

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

    async function handleGetTranscribe() {
        const formData = new FormData();
        formData.append('file', isRecorded["file"]);
        try {
            const response = await fetch('http://' + serverURL + '/RepeatSentenceRoute/Transcribe', {
                method: 'POST',
                body: formData,
            });
            const result = await response.json();
            console.log(result)
            if (result["status"]==="success"){
                return result["data"];
            }
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    async function handleSubmit() {   
        const activityDuration = Date.now() - activityStartTime;
        setIsLoading(true);
        
        var response = await handleGetTranscribe();
        console.log(response)
        var similarity = gestaltSimilarity(data["sentence"], response["transcribe"]);

        var isCorrect;
        if (similarity >= 0.75){
            isCorrect = true;
        }else{
            isCorrect = false;
        }

        var transcribe = response["transcribe"]
        if (transcribe === ""){
            transcribe = "Invalid";
        }

        var params = {
            deckID: data["deckID"],
            userID: userID,
            sentence: data["sentence"],
            response: transcribe,
            recording: response["key"],
            similarity: similarity,
            isCorrect: isCorrect,
            duration: activityDuration,
        }

        console.log(params)
        try {
            const response = await fetch('http://' + serverURL + '/ResultManagement/Add', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                "activity": data["activity"],
                "params": params,
                "dailyAssignment": data["dailyAssignment"] ? data["dailyAssignment"] : false
                
              }),
            });
            const result = await response.json();
            console.log(result)
            setIsLoading(false);
            setSubmitted(true)
            isCorrect ? handleEndOfActivity(isCorrect, activityDuration, correctHeader, correctSubHeader):handleEndOfActivity(isCorrect, activityDuration, incorrectHeader, incorrectSubHeader + transcribe);
        } catch (error) {
            console.error('Error fetching data: ', error);
        }
    }

    return (
        <div className="flex flex-col space-y-5 w-full">
            <div className="h-[15%] sm:text-md md:text-2xl font-bold sm:py-3 sm:px-5 md:p-5">
                    Repeat the Sentence
                </div>
            <div className="h-[20%] justify-center p-2">
                <SentenceSlot key={forceReset} words={wordsInSentence}/>
            </div>
            
            <div className='flex justify-center'>
                <button 
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold sm:text-sm md:text-lg py-2 px-4 rounded"
                    onClick={playAudio}
                >
                    Play Sentence
                </button>
            </div>
            
            
            <div className="flex h-[20%] space-x-4 justify-center w-full">
                <AudioRecorder key={forceReset} onRecordingComplete={setRecorded}/>
            </div>

            <div className="flex h-[20%] items-center justify-center">
                {!submitted&&<button 
                    onClick={handleSubmit} 
                    disabled={!isRecorded || (isLoading && isRecorded)} 
                    className={`${
                        isRecorded && !isLoading
                        ? "bg-white text-gray-700 hover:shadow-md"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                    } font-normal py-2 px-4 text-lg md:text-3xl rounded focus:outline-none transform transition duration-300 ease-in-out`}
                    >
                    {isLoading ? "Submitting" : "Submit"}
                </button>}
            </div>

            
        </div>
      );
}

const correctHeader = "You got it right!";
const correctSubHeader = "Let's try the next activity!";
const incorrectHeader = "You got it wrong";
const incorrectSubHeader = "Sounds like: ";

export default RepeatSentenceActivity;
