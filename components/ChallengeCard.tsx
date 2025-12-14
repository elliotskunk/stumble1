import React, { useEffect, useState } from 'react';
import { ChallengeData } from '../types';

interface ChallengeCardProps {
  challenge: ChallengeData;
  onTimeExpired: () => void;
  onComplete: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onTimeExpired, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(challenge.timeLimitSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeExpired();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeExpired]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isUrgent = timeLeft < 30;

  return (
    <div className="h-full w-full bg-black text-white flex flex-col p-6 items-center justify-center relative overflow-hidden">
        {/* Animated Background Blob */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[60%] bg-purple-900/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[140%] h-[60%] bg-blue-900/30 rounded-full blur-3xl animate-pulse delay-75" />

        <div className="z-10 w-full max-w-md text-center space-y-8">
            <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-medium text-white/70 uppercase tracking-widest">
                    Detected: {challenge.locationIdentified}
                </span>
                <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                    {challenge.title}
                </h1>
            </div>

            <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
                <p className="text-xl md:text-2xl font-medium leading-relaxed">
                    "{challenge.description}"
                </p>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <div className={`text-6xl font-mono font-bold tracking-tighter tabular-nums transition-colors duration-500 ${isUrgent ? 'text-red-500 scale-110' : 'text-white'}`}>
                    {formatTime(timeLeft)}
                </div>
                <p className="text-white/50 text-sm">left to stumble</p>
            </div>
        </div>

        <button 
            onClick={onComplete}
            className="z-10 absolute bottom-10 w-[90%] max-w-sm bg-white text-black font-bold text-lg py-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
            I Did It! Take Proof
        </button>
    </div>
  );
};