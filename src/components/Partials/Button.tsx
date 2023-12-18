interface ButtonProps {
  children: string;
  onClick: () => void;
  disabled?: boolean;
  backgroundColor?: string; // Add backgroundColor prop
}

const Button = ({
  children,
  onClick,
  disabled,
  backgroundColor = "blue", // Set default value to "blue"
}: ButtonProps) => {
  return (
    <button
      className={`bg-${backgroundColor}-500 hover:bg-${backgroundColor}-700 text-white font-bold text-sm md:text-lg lg:text-xl py-2 px-4 md:w-40 h-20 rounded-full`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
