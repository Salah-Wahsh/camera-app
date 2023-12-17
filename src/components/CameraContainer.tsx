import React, { useRef, useState, useEffect } from "react";
import CaptureButton from "./CaptureButton";
import Webcam from "react-webcam";
import dataURLtoBlob from "../utils/dataURLtoBlob";

const CameraContainer: React.FC = () => {
  const webcamRef = useRef<any>(null);
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
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | undefined>();

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

  useEffect(() => {
    const getCameraDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setCameras(videoDevices);
      } catch (error) {
        console.error("Error getting camera devices:", error);
      }
    };

    getCameraDevices();
  }, []);

  const handleCameraChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCamera(event.target.value);
  };

  return (
    <div className="relative h-screen w-screen">
      <div
        className="p-4"
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      >
        <label htmlFor="cameraDropdown">Select Camera:</label>
        <select
          id="cameraDropdown"
          value={selectedCamera || ""}
          onChange={handleCameraChange}
        >
          <option value="" disabled>
            Select a camera
          </option>
          {cameras.map((camera) => (
            <option key={camera.deviceId} value={camera.deviceId}>
              {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
            </option>
          ))}
        </select>
      </div>
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
      {/* <button onClick={capture}>Capture photo</button> */}
      <CaptureButton onClick={capture} />
    </div>
  );
};

export default CameraContainer;
