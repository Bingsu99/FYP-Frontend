import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState(null); // State to hold the audio Blob
  const [hasRecorded, setHasRecorded] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    if (hasRecorded) {
      // Inform the parent that recording has been completed, passing both the URL and the Blob
      onRecordingComplete({url:audioURL, file:audioBlob});
    }
  }, [hasRecorded, audioURL, audioBlob, onRecordingComplete]);

  const startRecording = async () => {
    if (hasRecorded && audioRef.current && !isRecording) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setAudioURL('');
      setAudioBlob(null);
      setHasRecorded(false);
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.addEventListener('dataavailable', event => {
        audioChunksRef.current.push(event.data);
      });
      mediaRecorderRef.current.addEventListener('stop', () => {
        const newAudioBlob = new Blob(audioChunksRef.current, { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(newAudioBlob);
        setAudioURL(audioUrl);
        setAudioBlob(newAudioBlob); // Save the Blob in the state
        setHasRecorded(true);
      });
      mediaRecorderRef.current.start();
      setIsRecording(true);
      audioChunksRef.current = [];
    } catch (err) {
      console.error('Error accessing the microphone', err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const playAudio = () => {
    if (audioRef.current) {
      setIsPlaying(true);
      audioRef.current.play();
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
            isRecording ? 'bg-red-500 hover:bg-red-700' : ''
          }`}
        >
          {isRecording ? 'Stop Recording' : (hasRecorded ? 'Re-record' : 'Start Recording')}
        </button>
        {audioURL && (
          <button
            onClick={playAudio}
            disabled={isPlaying}
            className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2 ${
              isPlaying ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isPlaying ? 'Playing...' : 'Play Audio'}
          </button>
        )}
      </div>
      {audioURL && <audio ref={audioRef} src={audioURL} className="hidden" />}
    </div>
  );
};

export default AudioRecorder;
