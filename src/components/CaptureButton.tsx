interface CaptureButtonProps {
  onClick: () => void;
}
const CaptureButton = ({ onClick }: CaptureButtonProps) => {
  return (
    <div
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-white rounded-full z-5"
      onClick={onClick}
    />
  );
};
export default CaptureButton;
