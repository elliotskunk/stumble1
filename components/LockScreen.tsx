import React, { useState, useEffect } from 'react';

interface LockScreenProps {
  onUnlockWithNotification: () => void;
  onUnlockNormally: () => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ onUnlockWithNotification, onUnlockNormally }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false
  });

  const dateString = currentTime.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div 
      className="h-full w-full bg-cover bg-center flex flex-col items-center relative text-white overflow-hidden"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2664&auto=format&fit=crop')`, // Abstract gradient wallpaper
      }}
    >
        {/* Overlay for legibility */}
        <div className="absolute inset-0 bg-black/20" />

        {/* Status Bar Spacer */}
        <div className="w-full h-12" />

        {/* Date & Time */}
        <div className="z-10 flex flex-col items-center mt-8 space-y-1">
            <div className="flex items-center space-x-2 opacity-90">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shadow-sm">
                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-medium drop-shadow-md">{dateString}</span>
            </div>
            <h1 className="text-8xl font-bold tracking-tighter drop-shadow-lg font-[system-ui]">{timeString}</h1>
        </div>

        {/* Notification Stack */}
        <div className="flex-1 w-full max-w-sm px-4 flex flex-col justify-end pb-32 z-20 space-y-2">
            {/* Stumble Notification */}
            <div 
                onClick={onUnlockWithNotification}
                className="bg-white/60 backdrop-blur-xl rounded-2xl p-4 shadow-lg cursor-pointer active:scale-95 transition-transform animate-bounce-slight"
            >
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                            <span className="text-white font-bold text-[10px]">St.</span>
                        </div>
                        <span className="text-xs font-bold text-black/70 uppercase tracking-wide">Stumble</span>
                    </div>
                    <span className="text-xs text-black/50">now</span>
                </div>
                <div className="space-y-1">
                    <h4 className="text-black font-bold text-sm">⚠️ Time to Stumble!</h4>
                    <p className="text-black text-sm leading-snug">Capture your surroundings to get your daily challenge.</p>
                </div>
            </div>
        </div>

        {/* Bottom Actions */}
        <div className="absolute bottom-12 w-full px-12 flex justify-between items-center z-10">
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
            </div>
        </div>

        {/* Home Indicator / Swipe Hint */}
        <div 
            onClick={onUnlockNormally}
            className="absolute bottom-2 w-1/3 h-1 bg-white rounded-full opacity-80 cursor-pointer"
        />
        <p className="absolute bottom-5 text-[10px] text-white/60 font-medium">Swipe up to unlock</p>
    </div>
  );
};