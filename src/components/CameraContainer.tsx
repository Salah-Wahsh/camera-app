import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react"; // import useRef
const CameraContainer: React.FC = () => {
  const webcamRef = useRef(null);
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
    <div className="h-screen w-screen ">
      <Webcam
        ref={webcamRef}
        // audio={true}
        screenshotFormat="image/jpeg"
        width={dimensions.width}
        height={dimensions.height}
        style={{ objectFit: "cover", width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default CameraContainer;
