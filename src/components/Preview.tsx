import { useEffect, useState } from "react";
import "../App.css";
import Button from "./Partials/Button";
import Record from "./Record";

interface PreviewProps {
  capturedImage: object | any;
  setShowPreview: (open: boolean) => void;
}

const Preview = ({ capturedImage, setShowPreview }: PreviewProps) => {
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [userText, setUserText] = useState("");
  const [recording, setRecording] = useState(false);

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
    printContent.style.textAlign = "center";

    const printImage = new Image();
    printImage.src = capturedImage;
    printImage.style.maxWidth = "100%";
    printImage.style.maxHeight = "100vh";
    printContent.appendChild(printImage);

    if (userText) {
      const textElement = document.createElement("div");
      textElement.innerText = userText;
      textElement.style.marginTop = "10px";
      printContent.appendChild(textElement);
    }

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Image</title>
          </head>
          <body style="margin: 0;">
            ${printContent.outerHTML}
          </body>
        </html>
      `);

      // Wait for the image to load before printing
      printImage.onload = () => {
        printWindow.print();
      };

      // Close the new window or iframe after a short delay
      window.setTimeout(() => {
        printWindow.close();
      }, 100);

      // Handle closing the window after printing
      window.onafterprint = () => {
        // Close the new window or iframe after a short delay
        window.setTimeout(() => {
          printWindow.close();
        }, 100);
      };
    }
  };

  const handleRetakeClick = () => {
    setImageSrc(null);
    setShowPreview(false);
  };

  const handleWriteClick = () => {
    // setShowWriteModal(true);
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

        <div className="flex space-x-8 mb-3">
          {/* {!recording && <Button onClick={handleWriteClick}>Write</Button>} */}
          {!recording && (
            <Button
              onClick={handleWriteClick}
              backgroundColor={showWriteModal ? "red" : "blue"}
            >
              {showWriteModal ? "Cancel Write" : " Write"}
            </Button>
          )}

          {!showWriteModal && (
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
      <div className="preview-frame mt-20">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <img
              src={imageSrc || ""}
              alt="Captured Preview"
              className="preview-image"
            />
            {showWriteModal && (
              <div className="modal ">
                <textarea
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={userText}
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
            {/* <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={() => {
                    setShowWriteModal(false);
                  }}
                >
                  Cancel
                </button> */}
            {userText && !showWriteModal && (
              <div className="text-preview text-white text-lg ">
                {/* Style this as needed */}
                {userText}
              </div>
            )}

            {recording && <Record />}
          </>
        )}
      </div>
    </div>
  );
};

export default Preview;
