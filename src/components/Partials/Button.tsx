interface ButtonProps {
  children: string;
  onClick: () => void;
}
const Button = ({ children, onClick }: ButtonProps) => {
  return (
    <button
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-sm md:text-lg lg:text-xl py-2 px-4 md:w-40 h-20 rounded-full"
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
