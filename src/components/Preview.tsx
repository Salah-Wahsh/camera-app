import { useEffect, useState } from "react";
import "../App.css";

interface PreviewProps {
  capturedImage: object | any;
  setShowPreview: (open: boolean) => void;
}

const Preview = ({ capturedImage, setShowPreview }: PreviewProps) => {
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

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
    // URL.revokeObjectURL(capturedImage);
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
        printWindow.onafterprint = () => {
          // Close the new window or iframe after a short delay
          window.setTimeout(() => {
            printWindow.close();
          }, 100);
        };
      };
    }
  };

  const handleRetakeClick = () => {
    setImageSrc(null);
    setShowPreview(false);
  };

  return (
    <div className="preview">
      <div className="button-container top-0 left-0 w-full flex justify-between p-4 absolute">
        <button
          onClick={handleRetakeClick}
          className="bg-red-500 hover:bg-red-700 text-white font-bold text-sm md:text-lg lg:text-xl py-2 px-4 md:w-40 h-20 rounded-full"
        >
          Retake
        </button>
        <div className="flex space-x-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm md:text-lg lg:text-xl py-2 px-4 md:w-40 h-20 rounded-full"
            onClick={handlePrintClick}
          >
            Print
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm md:text-lg lg:text-xl py-2 px-4 md:w-40 h-20 rounded-full">
            Record Audio
          </button>
        </div>
      </div>
      <div className="preview-frame mt-8">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <img
            src={imageSrc || ""}
            alt="Captured Preview"
            className="preview-image"
          />
        )}
      </div>
    </div>
  );
};

export default Preview;
