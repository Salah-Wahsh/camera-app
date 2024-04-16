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

  const appAccessToken = useRef<string>('');
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

  const getNewAccessToken = async () => {
    return new Promise<string>((resolve, reject) => {
      fetch("https://api.dropbox.com/oauth2/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          'refresh_token': import.meta.env.VITE_DROPBOX_REFRSEH_TOKEN as string,
          'grant_type': 'refresh_token',
          'client_id': import.meta.env.VITE_APP_KEY as string,
          'client_secret': import.meta.env.VITE_APP_SECRET as string,
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        const accessToken = data.access_token;
        // console.log(accessToken, 'accessToken in the use state in getNewAccess');
        resolve(accessToken); 
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        reject(error);
      });
    });
  };

  const handleSave = async () => {
    setIsSaved(true);
    setRecord(false);
    setIsRecordPressed(true);
  
    try {
      const accessToken = await getNewAccessToken();
      appAccessToken.current = accessToken;
  
      const dbx = new Dropbox({ accessToken });
  
      if (audioBlob) {
        const currentDate = new Date();
        const fileName = `recorded_audio_${currentDate.toISOString()}.wav`;
        // console.log('accesssToken in handle SAVE', appAccessToken.current);
  
        try {
          const response = await dbx.filesUpload({
            path: `/${fileName}`,
            contents: audioBlob,
          });
          console.log('File uploaded successfully!');
          // console.log("File uploaded successfully!", response);
          setShowDownload(false);
          const url = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';
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
              setAudioURL(result.url);
              setIsRecordPressed(false);
            } 
          } catch (err) {
            console.log(err);
            console.log(response.result);
          } 
        } finally {
          console.log('Shared link creation attempt complete');
        }
      }
    } catch (error) {
      console.error('Error while getting access token:', error);
    }
  };
  
  

  return (
    <div>
      {!showDownload && ( <button
        className=" text-lg text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg  px-4 py-1 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
        onClick={recording ? stopRecording : startRecording}
      >
        <div className="flex">
          <div className=" self-center">
        {recording ? "Stop Recording" : "Start Recording"}
        </div>
        {recording && (
          <div className="ml-2">
            <img src={recordEffect} alt="recording-gif" width="50px" />
          </div>
        )}
        </div>
      </button>) }
     

      {audioBlob && showDownload && (
        <div>
          {/* <p className="text-white">Recording saved!</p> */}
          <button
            onClick={handleSave}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
          >
                    <svg
            className="fill-current w-4 h-4 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
          <path d="M17 17H17.01M15.6 14H18C18.9319 14 19.3978 14 19.7654 14.1522C20.2554 14.3552 20.6448 14.7446 20.8478 15.2346C21 15.6022 21 16.0681 21 17C21 17.9319 21 18.3978 20.8478 18.7654C20.6448 19.2554 20.2554 19.6448 19.7654 19.8478C19.3978 20 18.9319 20 18 20H6C5.06812 20 4.60218 20 4.23463 19.8478C3.74458 19.6448 3.35523 19.2554 3.15224 18.7654C3 18.3978 3 17.9319 3 17C3 16.0681 3 15.6022 3.15224 15.2346C3.35523 14.7446 3.74458 14.3552 4.23463 14.1522C4.60218 14 5.06812 14 6 14H8.4M12 15V4M12 4L15 7M12 4L9 7" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>

            Upload Record
          </button>
        </div>
      )}
    </div>
  );
};

export default Record;
