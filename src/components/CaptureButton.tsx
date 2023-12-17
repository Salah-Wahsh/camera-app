import camera from "../assets/camera.png";
interface CaptureButtonProps {
  onClick: () => void;
}
const CaptureButton = ({ onClick }: CaptureButtonProps) => {
  return (
    <div
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-white rounded-full z-5 hover:bg-gray-200 transition flex items-center justify-center "
      onClick={onClick}
    >
      <img src={camera} width="50%" alt="camera icon"></img>
    </div>
  );
};
export default CaptureButton;
