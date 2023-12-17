import React, { useState, useEffect } from "react";
interface SelectCamProps {
  selectedCamera: string | undefined;
  setSelectedCamera: React.Dispatch<React.SetStateAction<string | undefined>>;
}
const SelectCam = ({ selectedCamera, setSelectedCamera }: SelectCamProps) => {
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);

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
    <>
      <div
        className="p-4"
        style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
      >
        <select
          id="cameraDropdown"
          value={selectedCamera || ""}
          onChange={handleCameraChange}
          className=" rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
        >
          <option
            value=""
            disabled
            className="text-gray-700 block px-4 py-2 text-sm"
          >
            Select a camera
          </option>
          {cameras.map((camera) => (
            <option
              key={camera.deviceId}
              value={camera.deviceId}
              className="text-gray-700 block px-4 py-2 text-sm"
            >
              {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};
export default SelectCam;
