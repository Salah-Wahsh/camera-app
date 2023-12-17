import "./App.css";
import { useState } from "react";
import CameraContainer from "./components/CameraContainer";
import Preview from "./components/Preview";

function App() {
  const [showPreview, setShowPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const handleCapture = (imageData: any) => {
    setCapturedImage(imageData);
    setShowPreview(true);
  };
  return (
    <>
      {showPreview ? (
        <Preview
          capturedImage={capturedImage}
          setShowPreview={setShowPreview}
        />
      ) : (
        <CameraContainer onCapture={handleCapture} />
      )}
    </>
  );
}

export default App;
