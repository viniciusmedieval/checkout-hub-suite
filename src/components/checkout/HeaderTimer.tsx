
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface HeaderTimerProps {
  backgroundColor?: string;
  textColor?: string;
  message?: string;
}

export function HeaderTimer({ 
  backgroundColor = "#1e1e1e", 
  textColor = "#FFFFFF",
  message = "Oferta especial por tempo limitado!"
}: HeaderTimerProps) {
  const [timer, setTimer] = useState({
    minutes: 14,
    seconds: 59
  });

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(countdown);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const formatTime = (num: number) => num.toString().padStart(2, '0');

  return (
    <div 
      className="py-3 text-sm font-medium text-center w-full"
      style={{ 
        backgroundColor, 
        color: textColor 
      }}
    >
      <div className="container max-w-md mx-auto px-4 flex items-center justify-center gap-2">
        <Clock size={16} />
        <p className="font-medium">{message} <strong>{formatTime(timer.minutes)}:{formatTime(timer.seconds)}</strong></p>
      </div>
    </div>
  );
}
