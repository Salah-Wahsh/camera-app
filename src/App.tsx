import "./App.css";
import { useEffect, useState } from "react";
import CameraContainer from "./components/CameraContainer";
import Preview from "./components/Preview";
import Gallery from "./components/Gallery";

function App() {
  const [showPreview, setShowPreview] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showCameraContainer, setShowCameraContainer] = useState(true);
  const [capturedImage, setCapturedImage] =useState< string | null>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);


  const handleCapture = (image: string) => {
    setCapturedImage(image);
    setCapturedImages((prevImages) => [image, ...prevImages]);
    setShowPreview(true);
    setShowCameraContainer(false);
  };

  const handleShowGallery = () => {
    setShowGallery(true);
    setShowCameraContainer(false);
  };

  const handleBackButton = () => {
    setShowCameraContainer(true);
    setShowGallery(false);
  };
  useEffect(() => {
    !showGallery && !showPreview && setShowCameraContainer(true);
  }, [showGallery, showPreview]);

  return (
    <>
      {showPreview && (
        <Preview
          capturedImage={capturedImage!}
          setShowPreview={setShowPreview}
          setShowCameraContainer={setShowCameraContainer}
        />
      )}
      {showCameraContainer && !showPreview && (
        <CameraContainer
          onCapture={handleCapture}
          setShowGallery={handleShowGallery}
          setShowCameraContainer={setShowCameraContainer}
          capturedImages={capturedImages}
        />
      )}
    {showGallery && !showPreview && (
      <Gallery images={capturedImages} handleBackButton={handleBackButton} />
    )}

    </>
  );
}

export default App;
