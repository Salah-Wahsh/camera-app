import { useState, useRef } from "react";
import recordEffect from "../assets/recordEffect.gif";
import { Dropbox } from "dropbox";

interface RecordProps {
  setIsSaved: (isSaved: boolean) => void;
  setUserText: (isSaved: string) => void;
  setRecord: (Record: boolean) => void; 
  setAudioURL: (audioURL: string) => void;
}
const Record = ({setIsSaved, setUserText, setRecord, setAudioURL}: RecordProps) => {
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

  // const handleSave = () => {
  //   setIsSaved(true);
  //   setRecord(false);
  //   if (audioBlob) {
  //     const downloadLink = document.createElement("a");
  //     downloadLink.href = URL.createObjectURL(audioBlob);
  //     downloadLink.download = "recorded_audio.wav";
  //     downloadLink.click();
  //     setShowDownload(false);
  //   }
  // };
  const dbx = new Dropbox({ accessToken: "sl.BxvgNSShYyLFBsfQEwOyhcbIT2nSmpZiDB6uzJkcJPzxEI2pahOgQBh-OCGcsTvB5FcgP6yAZMXf4BeiEJQRY9xV856zB4EjqNvudLmm_VakfIdCcw_geGnSBbMIDxoHJSy6ehjMW_qpBCo" });

  const handleSave = async () => {
    setIsSaved(true);
    setRecord(false);
  
    if (audioBlob) {
      const currentDate = new Date();
      const fileName = `recorded_audio_${currentDate.toISOString()}.wav`;
      try {
        const response = await dbx.filesUpload({
          path: `/${fileName}`,
          contents: audioBlob,
        });
        console.log("File uploaded successfully!", response);
        setShowDownload(false);
  
        // const uploadedFile = response.result;
        const url = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';
        const accessToken = 'sl.BxvgNSShYyLFBsfQEwOyhcbIT2nSmpZiDB6uzJkcJPzxEI2pahOgQBh-OCGcsTvB5FcgP6yAZMXf4BeiEJQRY9xV856zB4EjqNvudLmm_VakfIdCcw_geGnSBbMIDxoHJSy6ehjMW_qpBCo';
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        };
        const data = {
          // /recorded_audio_2024-03-18T17:29:59.177Z.wav
          path: `${response.result.path_display}`
        };
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
          });
  
          if (response.ok) {
            const result = await response.json();
            // console.log('Shared link created:', result);
            // console.log('Shared link:', result.url);
            setAudioURL(result.url);
          } else {
            console.error('Failed to create shared link:', response.statusText);
          }
        } catch (error) {
          console.error('Error:', error);
        } 
      } finally {
          console.log('Shared link creation attempt complete');
        }
    }
  };
  
  // const handleSave = async () => {
  //   setIsSaved(true);
  //   setRecord(false);
  
  //   if (audioBlob) {
  //     const currentDate = new Date();
  //     const fileName = `recorded_audio_${currentDate.toISOString()}.wav`;
  //     try {
  //       // const response = await dbx.filesUpload({
  //       //   path: `/${fileName}`,
  //       //   contents: audioBlob,
  //       // });
  //       const formData = new FormData();
  //       formData.append('path', `/${fileName}`); // Replace with desired path
  //       formData.append('file', audioBlob);
  //       const response = await fetch('https://content.dropboxapi.com/2/files/upload', {
  //       method: 'POST',
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: formData,
  //     });
      
  //     if (!response.ok) {
  //       throw new Error('Error uploading to Dropbox');
  //     }

  //     const data = await response.json();
  //     console.log('Upload successful:', data);
  //     setShowDownload(false);

  //   } catch (error) {
  //     console.error('Error uploading to Dropbox:', error);
  //     // Handle errors appropriately, like showing an error message to the user
  //   }
  //   }
  // };

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
