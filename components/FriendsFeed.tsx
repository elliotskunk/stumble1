import React, { useState } from 'react';

// Mock Data for Friends Feed
const MOCK_FRIENDS_POSTS = [
  {
    id: 'f1',
    user: 'xabiFR',
    timestamp: '2h ago',
    challengeTitle: 'Sprint down the hallway',
    imageUrl: 'https://raw.githubusercontent.com/elliotskunk/stumble/main/xabi-before.jpg', 
    afterImageUrl: 'https://raw.githubusercontent.com/elliotskunk/stumble/main/xabi-after.jpg',
    status: 'completed',
    comments: [
        { user: 'jake_99', text: 'No way you actually did that! 😂' },
        { user: 'maddy.runs', text: 'That face is terrifying lol' }
    ]
  },
  {
    id: 'f2',
    user: 'mikeyway2001',
    timestamp: '4h ago',
    challengeTitle: 'High-five a stranger',
    imageUrl: 'https://raw.githubusercontent.com/elliotskunk/stumble/main/mike-before.jpg', // Gym
    afterImageUrl: 'https://raw.githubusercontent.com/elliotskunk/stumble/main/mike-after.jpg', // Gym selfie
    status: 'completed',
    comments: [
        { user: 'tommy_gun', text: 'Legend.' },
        { user: 'sarah_m', text: 'So brave haha I would have died' },
        { user: 'alex_c', text: 'The look on their face is priceless' }
    ]
  },
  {
    id: 'f3',
    user: 'krishkrush',
    timestamp: '1d ago',
    challengeTitle: 'Do 10 clapping pushups',
    imageUrl: 'https://raw.githubusercontent.com/elliotskunk/stumble/main/pushup-before.jpg', // Park
    afterImageUrl: 'https://raw.githubusercontent.com/elliotskunk/stumble/main/pushup-after.jpg', // Floor/Fail
    status: 'completed',
    comments: [
        { user: 'gym_rat', text: 'Form needs work 😉' }
    ]
  },
  {
    id: 'f4',
    user: 'Marcuspeeps',
    timestamp: '5h ago',
    challengeTitle: 'Scream into the ocean',
    imageUrl: '',
    afterImageUrl: '',
    status: 'failed',
    comments: [
        { user: 'sarah_j', text: 'You missed out! It was freeing.' },
        { user: 'marcus_g', text: 'Too many people watching 😓' }
    ]
  }
];

export const FriendsFeed: React.FC = () => {
  const [activeLikes, setActiveLikes] = useState<Record<string, boolean>>({});
  const [daredPostId, setDaredPostId] = useState<string | null>(null); // Null means dare is available
  const [openCommentsId, setOpenCommentsId] = useState<string | null>(null);

  const handleDoubleTap = (id: string) => {
    setActiveLikes(prev => ({...prev, [id]: true}));
    
    // Auto hide after animation duration (sync with CSS transition)
    setTimeout(() => {
        setActiveLikes(prev => ({...prev, [id]: false}));
    }, 800);
  };

  const handleDare = (postId: string, e: React.MouseEvent) => {
      e.stopPropagation(); 
      if (daredPostId) return; // Prevent if already dared today
      setDaredPostId(postId);
  };

  const toggleComments = (postId: string) => {
      setOpenCommentsId(prev => prev === postId ? null : postId);
  };

  return (
    <div className="h-full w-full bg-black text-white flex flex-col pb-20">
      <div className="px-4 py-6 border-b border-neutral-800 bg-neutral-900 sticky top-0 z-10">
        <h1 className="text-2xl font-black tracking-tighter">Friends</h1>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-8 p-4">
        {MOCK_FRIENDS_POSTS.map(post => {
            const isDared = daredPostId === post.id;
            const dareDisabled = daredPostId !== null && !isDared;
            const isFailed = post.status === 'failed';

            return (
          <div key={post.id} className="bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-800 shadow-xl relative transition-all">
            {/* Header */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white ${isFailed ? 'bg-neutral-700' : 'bg-gradient-to-tr from-purple-500 to-orange-500'}`}>
                  {post.user.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{post.user}</h3>
                  <p className="text-xs text-neutral-400">{post.timestamp}</p>
                </div>
              </div>
              
              {/* Dare Button */}
              <button 
                onClick={(e) => handleDare(post.id, e)}
                disabled={dareDisabled || isDared}
                className={`
                    px-5 py-2 rounded-full text-xs font-black tracking-widest transition-all duration-300 border
                    ${isDared 
                        ? 'bg-white text-black border-white scale-105' 
                        : dareDisabled
                            ? 'bg-neutral-800 text-neutral-600 border-neutral-800 cursor-not-allowed opacity-50'
                            : 'bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white active:scale-95'
                    }
                `}
              >
                {isDared ? 'DARED' : 'DARE'}
              </button>
            </div>

            {/* Content Area: Carousel OR Failed State */}
            <div className="relative aspect-[4/5] bg-black group">
               {isFailed ? (
                   // FAILED STATE UI
                   <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 relative overflow-hidden">
                        <span className="text-[200px] font-black text-neutral-800 leading-none select-none opacity-50">X</span>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-red-500 font-black text-xl md:text-2xl tracking-widest border-4 border-red-500 px-6 py-4 rounded-lg transform -rotate-12 shadow-2xl bg-black/50 backdrop-blur-sm">
                                DID NOT ATTEMPT
                            </span>
                        </div>
                   </div>
               ) : (
                   // NORMAL CAROUSEL UI
                   <>
                       {/* Horizontal Scroll Container */}
                       <div 
                        className="w-full h-full overflow-x-auto snap-x snap-mandatory flex no-scrollbar scroll-smooth"
                        onDoubleClick={() => handleDoubleTap(post.id)}
                       >
                           {/* Before Image */}
                           <div className="w-full h-full flex-shrink-0 snap-center relative">
                                <img 
                                    src={post.imageUrl} 
                                    alt={`${post.challengeTitle} before`} 
                                    className="w-full h-full object-cover pointer-events-none" 
                                    loading="lazy" 
                                />
                           </div>

                           {/* After Image */}
                           <div className="w-full h-full flex-shrink-0 snap-center relative">
                                <img 
                                    src={post.afterImageUrl} 
                                    alt={`${post.challengeTitle} after`} 
                                    className="w-full h-full object-cover pointer-events-none" 
                                    loading="lazy" 
                                />
                           </div>
                       </div>
                       
                       {/* Stumble Badge (Overlay on top of carousel) */}
                       <div className="absolute top-4 right-4 bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10 z-10 pointer-events-none">
                          <span className="text-xs font-bold text-white">Stumble</span>
                       </div>

                       {/* Pagination Dots (Visual Cue) */}
                       <div className="absolute bottom-4 left-0 w-full flex justify-center space-x-1 pointer-events-none">
                            <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-sm" />
                            <div className="w-1.5 h-1.5 rounded-full bg-white/40 shadow-sm" />
                       </div>

                       {/* High Five Animation Layer */}
                       <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 ease-out transform ${activeLikes[post.id] ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-50 translate-y-10'}`}>
                            <span className="text-9xl drop-shadow-2xl filter grayscale-0">🙌</span>
                       </div>
                   </>
               )}
            </div>

            {/* Footer */}
            <div className="p-4">
               <div className="flex justify-between items-start">
                   <p className={`font-bold text-lg leading-tight flex-1 mr-4 ${isFailed ? 'text-white/60 line-through' : 'text-white'}`}>
                       {post.challengeTitle}
                   </p>
                   
                   {/* Comment Button */}
                   <button 
                        onClick={() => toggleComments(post.id)}
                        className={`transition-colors p-1 ${openCommentsId === post.id ? 'text-white' : 'text-neutral-500 hover:text-white'}`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={openCommentsId === post.id ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
                        </svg>
                   </button>
               </div>
               
               {/* Expandable Comments Section */}
               {openCommentsId === post.id && (
                   <div className="mt-4 pt-4 border-t border-white/10 space-y-3 animate-fade-in-down">
                       {post.comments.map((comment, idx) => (
                           <div key={idx} className="flex space-x-2 text-sm">
                               <span className="font-bold text-white shrink-0">{comment.user}</span>
                               <span className="text-neutral-300">{comment.text}</span>
                           </div>
                       ))}
                       <div className="pt-2 flex items-center space-x-2">
                           <div className="w-6 h-6 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] font-bold">Me</div>
                           <input 
                                type="text" 
                                placeholder="Add a comment..." 
                                className="bg-transparent text-sm text-white placeholder-neutral-600 focus:outline-none flex-1"
                           />
                       </div>
                   </div>
               )}
            </div>
          </div>
        );
        })}
        
        <div className="text-center text-neutral-600 text-xs py-8">
            You're all caught up!
        </div>
      </div>
    </div>
  );
};