import { useState, useRef } from "react";
import recordEffect from "../assets/recordEffect.gif";
import { Dropbox } from "dropbox";

interface RecordProps {
  setIsSaved: (isSaved: boolean) => void;
  setUserText: (isSaved: string) => void;
  setRecord: (Record: boolean) => void; 
  setIsRecordPressed: (Record: boolean) => void; 
  setAudioURL: (audioURL: string) => void;
}
const Record = ({setIsSaved, setUserText, setRecord, setAudioURL, setIsRecordPressed}: RecordProps) => {
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
  // dasdsasdadssddddddddddddddd

  const getToken = async () => {
    const requestData = new URLSearchParams();
    requestData.append('code', import.meta.env.VITE_APP_CODE as string);
    requestData.append('grant_type', 'authorization_code');
    requestData.append('client_id', import.meta.env.VITE_APP_KEY as string);
    requestData.append('client_secret', import.meta.env.VITE_APP_SECRET as string);

    fetch("https://api.dropbox.com/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: requestData
    })
    .then(response => {
      if (!response.ok) {
        console.log(response);
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);  
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
  };
  const dbx = new Dropbox({ accessToken: import.meta.env.VITE_DROPBOX_ACCESS_TOKEN as string });
  //   setIsSaved(true);
  //   setRecord(false);
  //   setIsRecordPressed(true);
  //   if (audioBlob) {
  //     const currentDate = new Date();
  //     const fileName = `recorded_audio_${currentDate.toISOString()}.wav`;
  //     try {
  //       const response = await dbx.filesUpload({
  //         path: `/${fileName}`,
  //         contents: audioBlob,
  //       });
  //       console.log("File uploaded successfully!", response);
  //       setShowDownload(false);
  //       const url = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';
  //       const accessToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN as string;
  //       const headers = {
  //         'Authorization': `Bearer ${accessToken}`,
  //         'Content-Type': 'application/json'
  //       };
  //       const data = {
  //         path: `${response.result.path_display}`
  //       };
  //       try {
  //         const response = await fetch(url, {
  //           method: 'POST',
  //           headers: headers,
  //           body: JSON.stringify(data)
  //         });
  
  //         if (response.ok) {
  //           const result = await response.json();
  //           // console.log('Shared link created:', result);
  //           // console.log('Shared link:', result.url);
  //           setAudioURL(result.url);
  //           setIsRecordPressed(false);
  //         } else {
  //           console.error('Failed to create shared link:', response.statusText);
  //         }
  //       } catch (error) {
  //         console.error('Error:', error);
  //       } 
  //     } finally {
  //         console.log('Shared link creation attempt complete');
  //       }
  //   }
  // };

  const handleSave = async () => {
    setIsSaved(true);
    setRecord(false);
    setIsRecordPressed(true);
    // await getToken();
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
        const url = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';
        const accessToken = import.meta.env.VITE_DROPBOX_ACCESS_TOKEN as string;
        const headers = {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        };
        const data = {
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
            setIsRecordPressed(false);
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
