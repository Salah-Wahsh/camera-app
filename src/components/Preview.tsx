import { useEffect, useState } from "react";
import "../App.css";
import Button from "./Partials/Button";
import Record from "./Record";
import { QRCodeSVG } from "qrcode.react";
import ReactDOM from 'react-dom';
// import { JSX } from "react/jsx-runtime";


// const componentToHtmlString = (component: JSX.Element) => {
//   const wrapper = document.createElement("div");
//   ReactDOM.render(component, wrapper);
//   return wrapper.innerHTML;
// };


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
  const [recording, setRecording] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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
    const anchor = document.createElement("a");
    anchor.href = capturedImage;
    anchor.download = "captured_photo.jpg";
    anchor.click();
    printImage(capturedImage);
  };

  const printImage = (capturedImage: string): void => {
    const printContent = document.createElement("div");
    // printContent.style.textAlign = "center";
   printContent.style.display = "flex";
   printContent.style.justifyContent = "space-around";
    const printImage = new Image();
    printImage.src = capturedImage;
    printImage.style.alignSelf = "left";
    printImage.style.maxWidth = "70%";
    printContent.appendChild(printImage);
  
    if (userText && !recording) {
      const textElement = document.createElement("div");
      textElement.innerText = userText;
      textElement.style.wordWrap = "break-word"; // Allow long words to wrap to new lines
      textElement.style.maxWidth = "20%"; // Adjust max-width as needed
      textElement.style.justifyContent = "center";
      textElement.style.alignSelf = "center";
      textElement.style.fontSize = "16px";
      
      printContent.appendChild(textElement);
    }
    if (isSaved && userText.length==0) {
      const qrCodeWrapper = document.createElement("div");
      ReactDOM.render(<QRCodeSVG value="https://reactjs.org/" size={128} />, qrCodeWrapper);
      qrCodeWrapper.style.justifySelf = "center";
      qrCodeWrapper.style.alignSelf = "center";
      printContent.appendChild(qrCodeWrapper);
    }
  
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      const doc = document.implementation.createHTMLDocument("Print Image");
      doc.documentElement.innerHTML = `
        <html>
          <head>
            <title>Print Image</title>
          </head>
          <body style="margin: 0;">
              ${printContent.outerHTML}
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
    // setShowWriteModal(true);
    setShowWriteModal(!showWriteModal);
    setIsSaved(false)
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

        <div className="flex space-x-8 mb-3">
          {!recording && (
            <Button
              onClick={handleWriteClick}
              backgroundColor={showWriteModal ? "red" : "blue"}
            >
              {showWriteModal ? "Cancel Write" : " Write"}
            </Button>
          )}

          {!showWriteModal && userText.length==0 && (
            <Button
              onClick={() => {
                setRecording(!recording);
              }}
              backgroundColor={recording ? "red" : "blue"}
            >
              {recording ? "Cancel Record" : " Record"}
            </Button>
          )}

          <Button onClick={handlePrintClick}>Print</Button>
        </div>
      </div>
      <div className="preview-frame mt-20 flex">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
         
          
            <img
              src={imageSrc || ""}
              alt="Captured Preview"
              className={`preview-image ${userText? `max-w-[80%]` : `max-w-[100%]`}`}
            />
             {isSaved && !recording && userText.length==0&&(  <QRCodeSVG
              value="https://reactjs.org/"
              // className="absolute top-0 right-0 p-4"
            />)}

            {showWriteModal && (
              <div className="modal ml-5 mt-5">
                <textarea
                  className="block p-2.5 w-full text-2xl text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={userText}
                  rows={10}
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
              <div className="text-white text-2xl w-[20rem] self-center" style={{ wordWrap: 'break-word' }}>
              {userText}
            </div>
            )}

            {recording && <Record setUserText={setUserText} setIsSaved={setIsSaved} setRecord={setRecording}/>}
          </>
        )}
      </div>
    </div>
  );
};

export default Preview;
