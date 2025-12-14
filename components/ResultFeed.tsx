import React, { useState } from 'react';
import { StumbleSession } from '../types';

interface ResultFeedProps {
  session: StumbleSession;
  onSave: (note: string, isPrivate: boolean) => void;
}

export const ResultFeed: React.FC<ResultFeedProps> = ({ session, onSave }) => {
  const [caption, setCaption] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  if (!session.beforePhoto || !session.afterPhoto) return null;

  return (
    <div className="h-full w-full bg-black text-white flex flex-col animate-fade-in">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-20 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pointer-events-none">
        <h1 className="text-2xl font-black tracking-tighter text-shadow-sm">stumble.</h1>
      </header>

      {/* Snap Container - Takes available space */}
      <div className="flex-1 w-full overflow-x-auto snap-x snap-mandatory flex no-scrollbar relative z-10">
        
        {/* Before Slide */}
        <div className="w-full flex-shrink-0 h-full snap-center relative bg-black">
          <img 
            src={session.beforePhoto} 
            alt="Before" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* After Slide */}
        <div className="w-full flex-shrink-0 h-full snap-center relative bg-black">
          <img 
            src={session.afterPhoto} 
            alt="After" 
            className="w-full h-full object-cover" 
          />
        </div>
      </div>

      {/* Swipe Indicator Overlay */}
      <div className="absolute top-[50%] left-0 w-full flex justify-between px-4 z-20 pointer-events-none opacity-50">
        <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur flex items-center justify-center text-white">‹</div>
        <div className="w-8 h-8 rounded-full bg-black/20 backdrop-blur flex items-center justify-center text-white">›</div>
      </div>

      {/* Footer Controls */}
      <div className="bg-neutral-900 border-t border-white/10 p-4 z-30 flex flex-col gap-3 pb-8">
        
        {/* Privacy Toggle */}
        <div className="flex items-center justify-between mb-1">
            <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-full ${isPrivate ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>
                    {isPrivate ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                    )}
                </div>
                <span className="text-xs font-medium text-white/80">{isPrivate ? "Locked (Private)" : "Public (Friends)"}</span>
            </div>
            <button 
                onClick={() => setIsPrivate(!isPrivate)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isPrivate ? 'bg-white' : 'bg-gray-700'}`}
            >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
        </div>

        {/* Caption Input */}
        <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Caption</label>
            <textarea 
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption..."
                rows={2}
                className="w-full bg-black/50 text-white text-sm rounded-lg p-3 border border-white/10 focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
        </div>
        <button 
          onClick={() => onSave(caption, isPrivate)}
          className="w-full bg-white text-black font-bold text-lg py-3 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          {isPrivate ? "Save to Portfolio" : "Post to Friends"}
        </button>
      </div>
    </div>
  );
};