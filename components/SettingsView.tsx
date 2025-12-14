import React, { useState } from 'react';

interface SettingsViewProps {
  currentGoal: string;
  onSave: (goal: string) => void;
  onCancel: () => void;
  onLockPhone?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentGoal, onSave, onCancel, onLockPhone }) => {
  const [goal, setGoal] = useState(currentGoal);

  return (
    <div className="h-full w-full bg-black text-white p-6 flex flex-col animate-fade-in">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold tracking-tight">Your Journey</h1>
        <button 
          onClick={onCancel}
          className="text-white/60 hover:text-white"
        >
          Cancel
        </button>
      </header>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <label htmlFor="goal" className="block text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">
          What is your growth goal?
        </label>
        <p className="text-xs text-gray-500 mb-6">
          The AI will create challenges specific to this goal and your environment.
        </p>
        
        <textarea
          id="goal"
          rows={6}
          className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-lg text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none"
          placeholder="e.g., I want to overcome my fear of rejection and talk to more strangers..."
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />

        <div className="mt-8 space-y-3">
          <p className="text-xs font-mono text-center text-neutral-600">
            Examples: <br/>
            "Become more confident at the gym"<br/>
            "Learn to laugh at my mistakes"<br/>
            "Practice public speaking skills"
          </p>
        </div>
      </div>

      <div className="mt-auto pt-6 space-y-4">
        <button
          onClick={() => onSave(goal)}
          className="w-full bg-white text-black font-bold text-lg py-4 rounded-full shadow-lg active:scale-95 transition-transform"
        >
          Save Goal
        </button>
        
        {onLockPhone && (
            <button
            onClick={onLockPhone}
            className="w-full bg-neutral-900 text-red-500 font-bold text-sm py-4 rounded-full border border-neutral-800"
            >
            Lock Phone (Reset Demo)
            </button>
        )}
      </div>
    </div>
  );
};