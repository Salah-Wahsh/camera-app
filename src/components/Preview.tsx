import { useEffect, useState } from "react";
import "../App.css";
import Button from "./Partials/Button";
import Record from "./Record";
import frame from '../assets/frame.png'
import { QRCodeSVG } from "qrcode.react";
import ReactDOMServer from "react-dom/server";

interface PreviewProps {
  capturedImage: string;
  setShowPreview: (open: boolean) => void;
  setShowCameraContainer: (open: boolean) => void;
}

const Preview = ({
  capturedImage,
  setShowPreview,
  setShowCameraContainer,
}: PreviewProps) => {
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [userText, setUserText] = useState("");
  const [husbandName, sethusbandName] = useState<string>(() => {
    return localStorage.getItem("husbandName") || "";
  });
  const [wifeName, setwifeName] = useState<string>(() => {
    return localStorage.getItem("wifeName") || "";
  });
  const [recording, setRecording] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [audioURL, setAudioURL] = useState<string>("");
  const [isRecordPressed, setIsRecordPressed] = useState(false) 
  const [printButton, setPrintButton] = useState<string>("Print");

  useEffect(()=>{
    if(isRecordPressed){
      setPrintButton("Uploading...");
    }
    else{
      setPrintButton("Print");
    }
  },[isRecordPressed])
  useEffect(() => {
    localStorage.setItem("husbandName", husbandName);
    const timeout = setTimeout(() => {
      localStorage.removeItem("husbandName");
    }, 3600000);
    return () => clearTimeout(timeout);
  }, [husbandName]);

  useEffect(() => {
    localStorage.setItem("wifeName", wifeName);
    const timeout = setTimeout(() => {
      localStorage.removeItem("wifeName");
    }, 3600000);
    return () => clearTimeout(timeout);
  }, [wifeName]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setLoading(false);
      setImageSrc(capturedImage);
    };
    img.onerror = (error) => {
      console.error("Error loading image:", error);
      setLoading(false);
    };
    img.src = capturedImage;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [capturedImage]);

  const handlePrintClick = () => {
    // if(audioURL){
    printImage(capturedImage);
  // }
  };

  const printImage = (capturedImage: string): void => {
    const container = document.createElement("div");
    container.style.display = "flex";
    const printContent = document.createElement("div");
    printContent.style.textAlign = "center";
    container.appendChild(printContent);
  
    const printImage = new Image();
    printImage.src = capturedImage; 

    printImage.style.maxWidth = "75%";
    printImage.style.position = "relative";
    printImage.style.zIndex = "-1";
    console.log(printImage);
    printContent.appendChild(printImage);


    // recording
    if (isSaved && userText.length === 0) {
      const qrCodeElement = <QRCodeSVG value={audioURL} size={64} />;
      const qrCodeHTML = ReactDOMServer.renderToString(qrCodeElement);
    
      const qrCodeWrapper = document.createElement("div");
      qrCodeWrapper.innerHTML = qrCodeHTML;
      
      // Set styles for qrCodeWrapper
      qrCodeWrapper.style.position = "absolute";
      qrCodeWrapper.style.bottom = "-17%";
      qrCodeWrapper.style.left = "2%";
      qrCodeWrapper.style.width = "80px";
      qrCodeWrapper.style.height = "80px";
      
      printContent.appendChild(qrCodeWrapper);
    }
    
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const doc = document.implementation.createHTMLDocument("Print Image");
      doc.documentElement.innerHTML = `
  <html>
    <head>
      <title>Print Image</title>
      <style>
        @page {
          size: A5 landscape;
          margin: 0;
        }
        body {
          margin: 0;
        }
        .container {
          position: relative;
        }
        .frame {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .overlay {
          position: absolute;
          bottom: -1%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          background-color: white;
          padding: 10px 20px;
          border-radius: 5px;
        }
        .center {
          text-align: center;
        }
        .wedDate {
          position: absolute;
          right: 2%;
          bottom: 1%;
          font-size: 1.5rem;
          font-weight: bold;
        }
        .overlay p {
          margin: 0;
          padding: 0;
          font-size: 1rem;
          font-family: 'Noto Sans Arabic', sans-serif;
          font-weight: 300;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <img src="${frame}" alt="frame" class="frame">
        ${printContent.outerHTML}

      </div>
      <div class="wedDate">
        <p style="font-size:1.2rem">${new Date().toLocaleDateString()}</p>
      </div>
      ${husbandName && wifeName ? `
        <div class="center">
          <p style="font-size:1.2rem; font-family: 'Montserrat', sans-serif; font-weight:500;">
            ${husbandName} & ${wifeName}
          </p>
        </div>` 
      : ""}
      ${userText ? `
        <div id="test" class="userText center">
          <p style="font-size:1.1rem">${userText}</p>
        </div>` 
      : ""}
    </body>
  </html>
`;
      printWindow.document.replaceChild(
        printWindow.document.importNode(doc.documentElement, true),
        printWindow.document.documentElement
      );
      
      printWindow.print();

      window.setTimeout(() => {
        printWindow.close();
      }, 1);
    }
  };
  
  const handleRetakeClick = () => {
    setImageSrc(null);
    setShowPreview(false);
    setShowCameraContainer(true);
  };

  const handleWriteClick = () => {
    setShowWriteModal(!showWriteModal);
    setUserText("");
  };

  const handleInsertText = () => {
    setShowWriteModal(false);
  };

  return (
    <div className="preview">
      <div className="button-container top-0 left-0 w-full flex justify-between p-4 absolute ">
        <button
          onClick={handleRetakeClick}
          className="bg-red-500 hover:bg-red-700 text-white font-bold text-sm md:text-lg lg:text-xl py-2 px-4 md:w-40 h-20 rounded-full"
        >
          Retake
        </button>
        <div className="flex mx-2">
        <label className="text-white font-medium mr-4" htmlFor="husbandName">Husband Name
        <br/>
        <input
        className="mt-2 h-12 rounded-lg text-black"
        id="husbandName"  
         value={husbandName}
          onChange={(e) => sethusbandName(e.target.value)}/></label>
       

       <label className="text-white font-medium" htmlFor="husbandName">Wife's Name
        <br/>
        <input
        className="mt-2 h-12 rounded-lg text-black"
        id="wifeName"  
         value={wifeName}
          onChange={(e) => setwifeName(e.target.value)}/></label>
      </div>
      </div>

      <div className="preview-frame mt-20 mr-40 relative">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
          {isSaved && userText.length === 0 && !isRecordPressed&& (
            <QRCodeSVG
              value={audioURL}
              className="absolute top-0 right-0 p-4"
            />
          )}
          
            <img
              src={imageSrc || ""}
              alt="Captured Preview"
              className="preview-image"
            />

            {showWriteModal && (
              <div className="modal ">
                <textarea
                  className="block p-2.5 w-full text-xl text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={userText}
                  maxLength={100}
                  rows={2}
                  onChange={(e) => setUserText(e.target.value)}
                />
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-4 mr-4"
                  onClick={handleInsertText}
                >
                  Insert
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full "
                  onClick={() => {
                    setUserText("");
                  }}
                >
                  Clear
                </button>
              </div>
            )}
            {userText && !showWriteModal && (
              <div className="text-preview text-white text-xl max-w-2xl text-wrap ">
                <p className="">{userText}</p>
              </div>
            )}

            {recording && <Record setIsRecordPressed={setIsRecordPressed} setUserText={setUserText} setIsSaved={setIsSaved} setRecord={setRecording} setAudioURL={setAudioURL}/>}
          </>
        )}
      </div>
      <div className="flex flex-col justify-end space-y-8 absolute right-12">
          {!recording && (
            <Button
              onClick={handleWriteClick}
              backgroundColor={showWriteModal ? "red" : "blue"}
            >
              {showWriteModal ? "Cancel Write" : " Write"}
            </Button>
          )}

          {!showWriteModal && userText.length === 0 && (
            <Button
              onClick={() => {
                setRecording(!recording);
              }}
              backgroundColor={recording ? "red" : "blue"}
            >
              {recording ? "Cancel Record" : " Record"}
            </Button>
          )}

          <Button onClick={handlePrintClick} disabled={isRecordPressed} backgroundColor={`${isRecordPressed? `gray`: `blue`}`}>{printButton}</Button>
        </div>
    </div>
  );
};

export default Preview;
