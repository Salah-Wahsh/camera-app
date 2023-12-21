import "./App.css";
import { useEffect, useState } from "react";
import CameraContainer from "./components/CameraContainer";
import Preview from "./components/Preview";
import Gallery from "./components/Gallery";
import ImageType  from "./utils/generalTypes";

function App() {
  const [showPreview, setShowPreview] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showCameraContainer, setShowCameraContainer] = useState(true);
  const [capturedImage, setCapturedImage] =useState<ImageType | null>(null);
  const [capturedImages, setCapturedImages] = useState<ImageType[]>([]);


  const handleCapture = (imageData: ImageType) => {
    setCapturedImage(imageData);
    setCapturedImages((prevImages: ImageType[]) => [imageData, ...prevImages]);
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
  //to set the camera view by default
  useEffect(() => {
    !showGallery && !showPreview && setShowCameraContainer(true);
  }, []);

  return (
    <>
      {showPreview && (
        <Preview
          capturedImage={capturedImage}
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
