import { useState, useEffect, useRef } from 'react';

export interface UseTimerOptions {
  initialTime: number;
  onTick?: (timeLeft: number) => void;
  onComplete?: () => void;
  autoStart?: boolean;
}

export function useTimer(options: UseTimerOptions) {
  const { initialTime, onTick, onComplete, autoStart = false } = options;
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          onTick?.(newTime);
          
          if (newTime <= 0) {
            setIsActive(false);
            onComplete?.();
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft, onTick, onComplete]);

  const start = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pause = () => {
    setIsPaused(true);
  };

  const resume = () => {
    setIsPaused(false);
  };

  const stop = () => {
    setIsActive(false);
    setIsPaused(false);
  };

  const reset = (newTime?: number) => {
    setTimeLeft(newTime ?? initialTime);
    setIsActive(false);
    setIsPaused(false);
  };

  const addTime = (seconds: number) => {
    setTimeLeft(prev => prev + seconds);
  };

  return {
    timeLeft,
    isActive,
    isPaused,
    start,
    pause,
    resume,
    stop,
    reset,
    addTime,
    formatTime: (seconds: number = timeLeft) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    },
    formatTimeDetailed: (seconds: number = timeLeft) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
  };
}