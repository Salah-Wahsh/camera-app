import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import CaptureButton from "./CaptureButton";
import SelectCam from "./SelectCam";
import dataURLtoBlob from "../utils/dataURLtoBlob";
import Countdown from "./Countdown";
import "../App.css";
import galleryIcon from "../assets/gallery.png";
import ImageType from "../utils/generalTypes";
interface CameraContainerProps {
  onCapture: (imageData: any) => void;
  setShowGallery: (open: boolean) => void;
  setShowCameraContainer: (open: boolean) => void;
  capturedImages: ImageType[];
}

const CameraContainer = ({
  onCapture,
  setShowGallery,
  setShowCameraContainer,
  capturedImages,
}: CameraContainerProps) => {
  const webcamRef = useRef<any>(null);
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>();
  const [countdownActive, setCountdownActive] = useState(false);

  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current!.getScreenshot();
    if (imageSrc) {
      const blobImage = dataURLtoBlob(imageSrc);
      const blobUrl = URL.createObjectURL(blobImage);
      onCapture(blobUrl); // Pass the captured image data to the parent component
    }
  }, [webcamRef, onCapture]);

  const handleCountdownEnd = () => {
    setCountdownActive(false);
    // setShowPreview(true);
    capture();
  };
  const handleShowGallery = () => {
    setShowCameraContainer(false);
    setShowGallery(true);
  };

  const startCountdown = () => {
    setCountdownActive(true);
  };

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative h-screen w-screen">
      <SelectCam
        selectedCamera={selectedCamera}
        setSelectedCamera={setSelectedCamera}
      />

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        mirrored={true}
        screenshotQuality={1}
        width={dimensions.width}
        height={dimensions.height}
        videoConstraints={{
          deviceId: selectedCamera,
        }}
        style={{ width: "100%", height: "100%" }}
      />

      {countdownActive && (
        <Countdown initialCount={1} onCountdownEnd={handleCountdownEnd} />
      )}

      <CaptureButton onClick={startCountdown} />
      {capturedImages.length > 0 && (<img
        className="absolute bottom-10 left-10 transform -translate-x-1 w-28 h-28  transition "
        src={galleryIcon}
        onClick={handleShowGallery}
      />)} 
    </div>
  );
};

export default CameraContainer;
