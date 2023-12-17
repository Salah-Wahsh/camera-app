import { useState, useEffect } from "react";

interface CountdownProps {
  initialCount: number;
  onCountdownEnd: () => void;
}

const Countdown: React.FC<CountdownProps> = ({
  initialCount,
  onCountdownEnd,
}) => {
  const [countdown, setCountdown] = useState<number | null>(initialCount);

  useEffect(() => {
    if (countdown === null) {
      onCountdownEnd();
      return;
    }

    const intervalId = setInterval(() => {
      setCountdown((prevCount) => {
        if (prevCount === 1) {
          clearInterval(intervalId);
          onCountdownEnd();
          return null;
        } else {
          return prevCount! - 1;
        }
      });
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [countdown, onCountdownEnd]);

  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-bold text-white">
      {countdown}
    </div>
  );
};

export default Countdown;
