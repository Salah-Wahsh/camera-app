import { useState, useRef } from "react";
import recordEffect from "../assets/recordEffect.gif";
interface RecordProps {
  setIsSaved: (isSaved: boolean) => void;
  setUserText: (isSaved: string) => void;
  setRecord: (Record: boolean) => void; 
}
const Record = ({setIsSaved, setUserText, setRecord}: RecordProps) => {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [showDownload, setShowDownload] = useState(false);

  const startRecording = () => {
    setUserText("");
    setShowDownload(false);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setAudioBlob(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorderRef.current = mediaRecorder;
        setRecording(true);
        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setShowDownload(true);
    }
  };

  const handleSave = () => {
    setIsSaved(true);
    setRecord(false);
    if (audioBlob) {
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(audioBlob);
      downloadLink.download = "recorded_audio.wav";
      downloadLink.click();
      setShowDownload(false);
    }
  };

  return (
    <div>
      <button
        className=" text-lg text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg  px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? "Stop Recording" : "Start Recording"}
        {recording && (
          <div className="flex justify-center">
            <img src={recordEffect} alt="recording-gif" width="60px" />
          </div>
        )}
      </button>

      {audioBlob && showDownload && (
        <div>
          <p className="text-white">Recording saved!</p>
          <button
            onClick={handleSave}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <svg
              className="fill-current w-4 h-4 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
            </svg>
            Save Recording
          </button>
        </div>
      )}
    </div>
  );
};

export default Record;
