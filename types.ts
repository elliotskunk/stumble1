export type AppPhase = 
  | 'lock-screen'
  | 'idle' 
  | 'settings'
  | 'portfolio'
  | 'friends'
  | 'capture-before' 
  | 'analyzing' 
  | 'challenge-active' 
  | 'capture-after' 
  | 'review';

export interface ChallengeData {
  title: string;
  description: string;
  locationIdentified: string;
  timeLimitSeconds: number;
}

export interface StumbleSession {
  id: string;
  timestamp: number;
  beforePhoto: string | null; // Base64
  afterPhoto: string | null;  // Base64
  challenge: ChallengeData | null;
  note?: string;
  isPrivate: boolean;
}

export enum CameraMode {
  ENVIRONMENT = 'environment',
  USER = 'user'
}