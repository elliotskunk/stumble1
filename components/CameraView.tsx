import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraMode } from '../types';

interface CameraViewProps {
  onCapture: (base64Image: string) => void;
  label: string;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, label }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>('');

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' }, // Prefer rear camera for environment analysis
          width: { ideal: 1280 },
          height: { ideal: 1920 }
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access error:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video stream
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const context = canvas.getContext('2d');
    if (context) {
      // Draw the video frame to the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Convert to base64
      const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
      onCapture(imageBase64);
    }
  };

  return (
    <div className="relative h-full w-full bg-black flex flex-col items-center justify-center overflow-hidden">
      {error ? (
        <div className="text-white p-6 text-center">
          <p className="text-red-500 mb-4 text-xl">⚠️</p>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white text-black rounded-full"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          <video 
            ref={videoRef}
            autoPlay 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Overlay UI */}
          <div className="absolute top-0 left-0 w-full p-8 bg-gradient-to-b from-black/50 to-transparent">
            <h2 className="text-white text-center font-bold text-lg tracking-wider uppercase opacity-90">{label}</h2>
            <p className="text-white/70 text-center text-xs mt-1">Simulating Dual Capture</p>
          </div>

          <div className="absolute bottom-0 left-0 w-full p-10 flex justify-center items-center bg-gradient-to-t from-black/80 to-transparent">
            <button 
              onClick={handleCapture}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-90"
              aria-label="Take Photo"
            >
              <div className="w-16 h-16 bg-white rounded-full" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};