import React, { useState } from 'react';
import { StumbleSession } from '../types';

interface PortfolioViewProps {
  history: StumbleSession[];
  onUpdateSession: (session: StumbleSession) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ history, onUpdateSession }) => {
  const reversedHistory = [...history].reverse(); // Show newest first
  const [columns, setColumns] = useState(3);
  const [selectedSession, setSelectedSession] = useState<StumbleSession | null>(null);

  // Detail View State
  const [isViewingBefore, setIsViewingBefore] = useState(false);
  const [currentNote, setCurrentNote] = useState("");
  const [currentIsPrivate, setCurrentIsPrivate] = useState(false);

  const handleSelectSession = (session: StumbleSession) => {
    setSelectedSession(session);
    setCurrentNote(session.note || "");
    setCurrentIsPrivate(session.isPrivate);
    setIsViewingBefore(false);
  };

  const handleCloseDetail = () => {
    // Auto-save note/privacy on close
    if (selectedSession) {
        if (currentNote !== selectedSession.note || currentIsPrivate !== selectedSession.isPrivate) {
             onUpdateSession({ ...selectedSession, note: currentNote, isPrivate: currentIsPrivate });
        }
    }
    setSelectedSession(null);
  };

  if (history.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center text-white/50 p-6 text-center">
        <div className="w-16 h-16 border-2 border-white/20 rounded-full flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Stumbles Yet</h3>
        <p className="text-sm">Complete challenges to build your portfolio.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-black text-white flex flex-col relative">
      {/* Detail Overlay */}
      {selectedSession && (
        <div className="absolute inset-0 z-50 bg-black flex flex-col animate-fade-in overflow-y-auto no-scrollbar">
          {/* Top Bar */}
          <div className="sticky top-0 bg-black/80 backdrop-blur-md p-4 flex justify-between items-center z-10 border-b border-white/10">
            <button onClick={handleCloseDetail} className="p-2 text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div className="text-sm font-semibold text-white/90">
                {new Date(selectedSession.timestamp).toLocaleDateString(undefined, {
                    weekday: 'short', month: 'long', day: 'numeric'
                })}
            </div>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          {/* Content */}
          <div className="p-0 space-y-6 pb-20">
            {/* Image Container */}
            <div className="relative w-full aspect-[3/4] bg-neutral-900">
                <img 
                    src={isViewingBefore ? selectedSession.beforePhoto! : selectedSession.afterPhoto!}
                    alt="Stumble"
                    className="w-full h-full object-cover"
                />
                
                {/* Toggle Button for Images */}
                <button 
                    onClick={() => setIsViewingBefore(!isViewingBefore)}
                    className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-xs font-bold border border-white/20 shadow-lg hover:bg-black/80 transition-all"
                >
                    View {isViewingBefore ? 'After' : 'Before'}
                </button>
            </div>

            <div className="px-6 space-y-6">
                {/* Challenge Info */}
                <div>
                    <h2 className="text-2xl font-black leading-tight mb-2">{selectedSession.challenge?.title}</h2>
                    <div className="p-4 bg-neutral-900 rounded-xl border border-white/10">
                        <p className="text-gray-300 italic">"{selectedSession.challenge?.description}"</p>
                        <p className="text-xs text-gray-500 mt-2 uppercase tracking-widest text-right">— at {selectedSession.challenge?.locationIdentified}</p>
                    </div>
                </div>

                {/* Privacy Toggle In Detail View */}
                <div className="flex items-center justify-between p-4 bg-neutral-900 rounded-xl">
                    <span className="text-sm font-bold text-white">
                        {currentIsPrivate ? "🔒 Locked (Private)" : "🌍 Public (Friends)"}
                    </span>
                    <button 
                        onClick={() => setCurrentIsPrivate(!currentIsPrivate)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${currentIsPrivate ? 'bg-white' : 'bg-gray-700'}`}
                    >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${currentIsPrivate ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>

                {/* Reflection Notes */}
                <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">Reflections</label>
                    <textarea 
                        className="w-full bg-neutral-900 text-white rounded-lg p-4 border border-white/10 focus:outline-none focus:border-white/40 transition-colors"
                        placeholder="How did it feel? What did you learn?"
                        rows={4}
                        value={currentNote}
                        onChange={(e) => setCurrentNote(e.target.value)}
                    />
                    <button 
                        onClick={handleCloseDetail}
                        className="w-full py-3 bg-white text-black font-bold rounded-lg mt-2"
                    >
                        Save & Close
                    </button>
                </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid Header */}
      <div className="flex justify-between items-center px-4 py-3 bg-black z-10 border-b border-white/10">
        <h1 className="font-bold text-lg tracking-tight">Portfolio</h1>
        
        {/* Zoom Slider */}
        <div className="flex items-center space-x-2">
            <span className="text-[10px] text-gray-500">ZOOM</span>
            <input 
                type="range" 
                min="1" 
                max="5" 
                step="1"
                value={6 - columns} // Invert: 1 (left) = small (5 cols), 5 (right) = big (1 col)
                onChange={(e) => setColumns(6 - parseInt(e.target.value))}
                className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
            />
        </div>
      </div>

      {/* Grid Layout */}
      <div 
        className="flex-1 overflow-y-auto pb-20 p-[2px]"
        style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: '2px',
            alignContent: 'start'
        }}
      >
        {reversedHistory.map((session) => (
          <div 
            key={session.id} 
            onClick={() => handleSelectSession(session)}
            className="relative aspect-square cursor-pointer overflow-hidden bg-neutral-800 active:opacity-80 transition-opacity group"
          >
            <img 
              src={session.afterPhoto || session.beforePhoto || ''} 
              alt={session.challenge?.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Gradient Overlay for Text Readability if needed, mostly clean for iOS feel */}
            {columns <= 2 && (
                <div className="absolute bottom-0 left-0 p-2 w-full bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-white text-xs font-bold truncate">{session.challenge?.title}</p>
                </div>
            )}
            
            <div className="absolute top-1 right-1 flex space-x-1">
                 {/* Lock Icon if Private */}
                 {session.isPrivate && (
                    <div className="w-5 h-5 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-white">
                            <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
                {/* Note Indicator */}
                {session.note && (
                    <div className="w-2 h-2 bg-white rounded-full shadow-sm mt-1 mr-1" />
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};