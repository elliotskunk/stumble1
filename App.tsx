import React, { useState, useEffect } from 'react';
import { CameraView } from './components/CameraView';
import { ChallengeCard } from './components/ChallengeCard';
import { ResultFeed } from './components/ResultFeed';
import { SettingsView } from './components/SettingsView';
import { PortfolioView } from './components/PortfolioView';
import { FriendsFeed } from './components/FriendsFeed';
import { BottomNav } from './components/BottomNav';
import { LockScreen } from './components/LockScreen';
import { generateChallengeFromEnvironment } from './services/geminiService';
import { AppPhase, StumbleSession } from './types';

// Hardcoded examples for the portfolio to demonstrate variety
const MOCK_HISTORY: StumbleSession[] = [
  {
    id: 'mock-1',
    timestamp: Date.now() - 1000 * 60 * 60 * 5, // 5 hours ago
    beforePhoto: 'https://unsplash.com/photos/a-modern-dining-area-with-artwork-on-wall-ytlpJqcMvh4',
    afterPhoto: 'https://raw.githubusercontent.com/elliotskunk/stumble/main/xabi-after.jpg',
    challenge: {
      title: "Distorted Face",
      description: "Make the most distorted face you can and hold it for 10 seconds.",
      locationIdentified: "Living Room",
      timeLimitSeconds: 60
    },
    note: "Actually hilarious. Felt stupid but good.",
    isPrivate: false
  },
  {
    id: 'mock-2',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    beforePhoto: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop', // Gym
    afterPhoto: 'https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?q=80&w=1000&auto=format&fit=crop', // Workout face
    challenge: {
      title: "Push to Failure",
      description: "Drop down and do pushups until you literally cannot do one more.",
      locationIdentified: "Gym",
      timeLimitSeconds: 120
    },
    note: "Arms felt like jelly. People looked, but I felt strong.",
    isPrivate: false
  },
  {
    id: 'mock-3',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5, // 5 days ago
    beforePhoto: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop', // Book/Cafe
    afterPhoto: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop', // Art
    challenge: {
      title: "Bad Art Challenge",
      description: "Draw the person sitting across from you without looking at the paper.",
      locationIdentified: "Coffee Shop",
      timeLimitSeconds: 180
    },
    note: "It looked nothing like him. I showed him and we laughed.",
    isPrivate: true
  },
  {
    id: 'mock-4',
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 1, // 1 day ago
    beforePhoto: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop', // Yoga/Nature
    afterPhoto: 'https://images.unsplash.com/photo-1544367563-12123d8965cd?q=80&w=1000&auto=format&fit=crop', // Pose
    challenge: {
      title: "Tree Pose Hold",
      description: "Hold a tree pose for 2 minutes or until you fall.",
      locationIdentified: "Park",
      timeLimitSeconds: 120
    },
    note: "Windy day made it hard to balance.",
    isPrivate: false
  }
];

const App: React.FC = () => {
  // Start on Lock Screen
  const [phase, setPhase] = useState<AppPhase>('lock-screen');
  const [session, setSession] = useState<Partial<StumbleSession>>({});
  const [loading, setLoading] = useState(false);
  
  // History State
  const [history, setHistory] = useState<StumbleSession[]>(() => {
    try {
      const saved = localStorage.getItem('stumble_history');
      const parsed = saved ? JSON.parse(saved) : [];
      // Use mocks if history is empty
      return parsed.length > 0 ? parsed : MOCK_HISTORY;
    } catch (e) {
      console.error("Failed to load history", e);
      return MOCK_HISTORY;
    }
  });

  // User Goal State
  const [userGoal, setUserGoal] = useState<string>(() => {
    return localStorage.getItem('stumble_user_goal') || "Become more outgoing and care less about what strangers think.";
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('stumble_user_goal', userGoal);
  }, [userGoal]);

  useEffect(() => {
    try {
        const historyToSave = history.slice(-10);
        localStorage.setItem('stumble_history', JSON.stringify(historyToSave));
    } catch (e) {
        console.error("Failed to save history (likely quota exceeded)", e);
    }
  }, [history]);

  // Handle clicking the notification on Lock Screen
  const handleUnlockWithNotification = () => {
    setSession({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      isPrivate: false 
    });
    // Jump straight to capture
    setPhase('capture-before');
  };

  // Handle standard unlock (swiping up) - Goes to friends/portfolio, bypasses capture
  const handleUnlockNormally = () => {
    setPhase('friends');
  };

  const handleBeforeCapture = async (base64: string) => {
    setSession(prev => ({ ...prev, beforePhoto: base64 }));
    setPhase('analyzing');
    setLoading(true);

    const challenge = await generateChallengeFromEnvironment(base64, userGoal);
    
    setSession(prev => ({ ...prev, challenge }));
    setLoading(false);
    setPhase('challenge-active');
  };

  const handleAfterCapture = (base64: string) => {
    setSession(prev => ({ ...prev, afterPhoto: base64 }));
    setPhase('review');
  };

  const handleChallengeComplete = () => {
    setPhase('capture-after');
  };

  const handleTimeExpired = () => {
    alert("Time's up! The moment passed. Try again later.");
    setPhase('friends'); // Go to feed if failed
    setSession({});
  };

  // Called when closing the review screen
  const handleSaveAndClose = (note: string, isPrivate: boolean) => {
    if (session.id && session.challenge && session.afterPhoto) {
        const completedSession: StumbleSession = {
            ...(session as StumbleSession),
            note: note,
            isPrivate: isPrivate
        };
        setHistory(prev => [...prev, completedSession]);
    }
    // After saving, go to Friends feed (Home)
    setPhase('friends');
    setSession({});
  };

  const handleUpdateSession = (updatedSession: StumbleSession) => {
    setHistory(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  };

  const handleUpdateGoal = (newGoal: string) => {
    setUserGoal(newGoal);
    setPhase('friends');
  };

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden font-sans flex flex-col">
      
      <div className="flex-1 relative overflow-hidden">
        
        {/* 0. Lock Screen */}
        {phase === 'lock-screen' && (
            <LockScreen 
                onUnlockWithNotification={handleUnlockWithNotification}
                onUnlockNormally={handleUnlockNormally}
            />
        )}

        {/* 1. Friends View (Default Home) */}
        {(phase === 'friends' || phase === 'idle') && (
            <FriendsFeed />
        )}

        {/* 2. Portfolio View */}
        {phase === 'portfolio' && (
            <PortfolioView 
              history={history} 
              onUpdateSession={handleUpdateSession}
            />
        )}

        {/* 3. Settings View */}
        {phase === 'settings' && (
            <SettingsView 
            currentGoal={userGoal}
            onSave={handleUpdateGoal}
            onCancel={() => setPhase('friends')}
            onLockPhone={() => setPhase('lock-screen')} // Reset Demo
            />
        )}

        {/* 4. Capture Environment (Before) */}
        {phase === 'capture-before' && (
            <CameraView 
            onCapture={handleBeforeCapture} 
            label="Where are you?" 
            />
        )}

        {/* 5. Analyzing State */}
        {phase === 'analyzing' && (
            <div className="h-full flex flex-col items-center justify-center bg-black relative">
            {session.beforePhoto && (
                <img 
                src={session.beforePhoto} 
                className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm" 
                alt="Context"
                />
            )}
            <div className="z-10 flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4" />
                <h2 className="text-xl font-bold animate-pulse">Scanning Vibes...</h2>
                <p className="text-sm text-white/60 mt-2">Checking your goal...</p>
            </div>
            </div>
        )}

        {/* 6. Challenge Active */}
        {phase === 'challenge-active' && session.challenge && (
            <ChallengeCard 
            challenge={session.challenge}
            onComplete={handleChallengeComplete}
            onTimeExpired={handleTimeExpired}
            />
        )}

        {/* 7. Capture Proof (After) */}
        {phase === 'capture-after' && (
            <CameraView 
            onCapture={handleAfterCapture} 
            label="Capture the Aftermath" 
            />
        )}

        {/* 8. Review / Feed */}
        {phase === 'review' && (
            <ResultFeed 
            session={session as StumbleSession} 
            onSave={handleSaveAndClose} 
            />
        )}
      </div>

      {/* Navigation Bar (Only visible in inside-app views) */}
      <BottomNav currentPhase={phase} onChangePhase={setPhase} />

    </div>
  );
};

export default App;