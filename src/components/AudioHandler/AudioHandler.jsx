import React, { useState, useEffect } from 'react';
import { serverURL } from "../../Constants";
import { Spinner } from 'flowbite-react';

function AudioHandler({isOpen, setRecording, sentence}) {
  const [selectedOption, setSelectedOption] = useState('upload');   //State to determine either file upload or TTS
  const [recordingFile, setRecordingFile] = useState(null); //State to save audiofile
  const [audioSource, setAudioSource] = useState(null); //State to save localhost URL to audiofile
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isGeneratingTTS, setIsGeneratingTTS] = useState(false);

  const generateTTS = async () =>{
    setIsGeneratingTTS(true);
    try {
        const response = await fetch('http://' + serverURL + '/RepeatSentenceRoute/Get', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({"sentence":sentence}),
        });
        const blob = await response.blob(); // Get a Blob for the audio file
        console.log(blob);
        setRecordingFile(blob);
        const audioUrl = URL.createObjectURL(blob);
        setAudioSource(audioUrl);
        setIsGeneratingTTS(false);
        setIsConfirmed(true);
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
  }

  useEffect(() => {
    if (selectedOption === 'tts' && isConfirmed) {
      generateTTS()
    }
  }, [selectedOption, isConfirmed]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
        setRecordingFile(file);
        setAudioSource(URL.createObjectURL(file));
        setIsConfirmed(false);
    }
  };

  const handleOptionChange = (event) => {
    const newSelectedOption = event.target.value;
    setSelectedOption(newSelectedOption);
    setIsConfirmed(false);

    // Clear audio source if the user switches to TTS or back to upload
    if (newSelectedOption !== 'upload' || selectedOption === 'tts') {
      setAudioSource(null);
    }
  };

  const handleConfirmSelection = () => {
    setIsConfirmed(true);
  };

  const handleReplaceAudio = () => {
    setRecording({"file": recordingFile, "url": URL.createObjectURL(recordingFile)})
    setAudioSource(null);
    setIsConfirmed(false);
    setIsGeneratingTTS(false);
    isOpen(false);
  };

  const handleCancel = () => {
    setSelectedOption('upload');
    setAudioSource(null);
    setIsConfirmed(false);
    setIsGeneratingTTS(false);
    isOpen(false);
  };

  return (
    <div className="p-4 bg-gray-100">
      {!isConfirmed && (
        <div className="flex flex-col space-y-4">
          <div >
            <label className="inline-flex items-center">
              <input type="radio" value="upload" name="audioOption" className="form-radio" onChange={handleOptionChange} checked={selectedOption === 'upload'} />
              <span className="ml-2">Upload Audio</span>
            </label>

            <label className="inline-flex items-center ml-6">
              <input type="radio" value="tts" name="audioOption" className="form-radio" onChange={handleOptionChange} checked={selectedOption === 'tts'} />
              <span className="ml-2">Text-to-Speech</span>
            </label>
          </div>

          {selectedOption === 'upload' && (
            <input type="file" accept="audio/*" onChange={handleFileChange} className="file-input" />
          )}

          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleConfirmSelection}
              disabled={(!audioSource && selectedOption === 'upload') || isGeneratingTTS}
              className={`btn ${(!audioSource && selectedOption === 'upload') || isGeneratingTTS ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-700 hover:shadow-md'} font-normal text-sm py-2 px-4 rounded focus:outline-none transform transition duration-300 ease-in-out`}
            >
              Confirm Selection
            </button>

            <button
              onClick={handleCancel}
              className="btn bg-red-500 text-white font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:bg-red-700 transform transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {isConfirmed && isGeneratingTTS && (
        <div className="flex justify-center items-center h-32">
          <Spinner aria-label="Audio loading" />
          <span className="sr-only">Generating audio...</span>
        </div>
      )}

      {audioSource && isConfirmed && !isGeneratingTTS && (
        <div>
          <audio controls className="w-full">
            <source src={audioSource} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
          <div className="flex justify-center space-x-4 mt-4">
            <button 
              onClick={handleReplaceAudio}
              className="btn bg-white text-gray-700 font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:shadow-md transform transition duration-300 ease-in-out"
            >
              Replace Audio
            </button>
            <button
              onClick={handleCancel}
              className="btn bg-red-500 text-white font-normal text-sm py-2 px-4 rounded focus:outline-none shadow hover:bg-red-700 transform transition duration-300 ease-in-out"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AudioHandler;
