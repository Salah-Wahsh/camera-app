import { useEffect, useState } from "react";
import "../App.css";
interface PreviewProps {
  capturedImage: any;
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
      // Clean up the image object if the component is unmounted
      img.onload = null;
      img.onerror = null;
    };
  }, [capturedImage]);

  const handlePrintClick = () => {
    const anchor = document.createElement("a");
    anchor.href = capturedImage;
    anchor.download = "captured_photo.jpg";
    anchor.click();
    URL.revokeObjectURL(capturedImage);

    //print the image not the window
    // window.print();
  };
  const handleRetakeClick = () => {
    setImageSrc(null);
    setShowPreview(false);
  };

  return (
    <div className="preview">
      <div className=" ">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <img src={imageSrc || ""} alt="Captured Preview" width="200px" />
        )}

        <button
          className="bg-blue-500 hover:bg-blue-700
       text-white font-bold py-2 px-4 rounded"
          onClick={handlePrintClick}
        >
          Print
        </button>
        <button
          onClick={handleRetakeClick}
          className="bg-red-500 hover:bg-red-700
       text-white font-bold py-2 px-4 rounded"
        >
          Retake
        </button>
      </div>
    </div>
  );
};

export default Preview;
