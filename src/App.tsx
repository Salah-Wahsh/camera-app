import "./App.css";
import { useState } from "react";
import CameraContainer from "./components/CameraContainer";
import Preview from "./components/Preview";
import Gallery from "./components/Gallery";
import galleryIcon from "./assets/gallery.png";

function App() {
  const [showPreview, setShowPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedImages, setCapturedImages] = useState<any>([]); // State to store captured images
  const [showGallery, setShowGallery] = useState(false);

  const handleCapture = (imageData: any) => {
    setCapturedImage(imageData);
    setCapturedImages((prevImages: any) => [imageData, ...prevImages]); // Store the captured image
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
        !showGallery && <CameraContainer onCapture={handleCapture} />
      )}
      {capturedImages.length > 0 &&
        !showPreview &&
        (showGallery ? (
          <div className="gallery-overlay">
            <button onClick={() => setShowGallery(false)}>Back</button>
          </div>
        ) : (
          <div className="gallery-overlay">
            <img
              src={galleryIcon}
              alt="Gallery"
              className="mb-12 ml-8"
              onClick={() => setShowGallery(true)}
            />
          </div>
        ))}
      {showGallery && <Gallery images={capturedImages} />}
    </>
  );
}

export default App;
