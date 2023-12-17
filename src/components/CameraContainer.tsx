import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import CaptureButton from "./CaptureButton";
import SelectCam from "./SelectCam";
import dataURLtoBlob from "../utils/dataURLtoBlob";

const CameraContainer: React.FC = () => {
  const webcamRef = useRef<any>(null);
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>();
  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current!.getScreenshot();
    if (imageSrc) {
      const blobImage = dataURLtoBlob(imageSrc);
      const blobUrl = URL.createObjectURL(blobImage);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = "captured_photo.jpg";
      anchor.click();
      URL.revokeObjectURL(blobUrl);
    }
  }, [webcamRef]);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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
        width={dimensions.width}
        height={dimensions.height}
        videoConstraints={{
          deviceId: selectedCamera,
        }}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
      <CaptureButton onClick={capture} />
    </div>
  );
};

export default CameraContainer;
