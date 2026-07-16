import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useExecution } from './ExecutionContext';

const PlaybackContext = createContext(null);

export const PlaybackProvider = ({ children }) => {
  const { snapshots } = useExecution();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [bookmarks, setBookmarks] = useState([]);

  const timerRef = useRef(null);

  // Reset index when active execution session snapshots change
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [snapshots]);

  // Auto-advance snapshots when isPlaying is active
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.round(1000 / playbackSpeed);
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prevIndex) => {
          if (prevIndex < snapshots.length - 1) {
            return prevIndex + 1;
          } else {
            setIsPlaying(false);
            return prevIndex;
          }
        });
      }, intervalMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, snapshots.length]);

  const nextStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.min(snapshots.length - 1, prev + 1));
  }, [snapshots.length]);

  const prevStep = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((index) => {
    setIsPlaying(false);
    if (index >= 0 && index < snapshots.length) {
      setCurrentStepIndex(index);
    }
  }, [snapshots.length]);

  const togglePlay = useCallback(() => {
    if (currentStepIndex === snapshots.length - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((prev) => !prev);
    }
  }, [currentStepIndex, snapshots.length]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  const restart = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(true);
  }, []);

  const toggleBookmark = useCallback((stepIndex) => {
    setBookmarks((prev) =>
      prev.includes(stepIndex)
        ? prev.filter((idx) => idx !== stepIndex)
        : [...prev, stepIndex].sort((a, b) => a - b)
    );
  }, []);

  const currentSnapshot = snapshots[currentStepIndex] || snapshots[0] || null;

  return (
    <PlaybackContext.Provider
      value={{
        currentStepIndex,
        currentSnapshot,
        isPlaying,
        playbackSpeed,
        bookmarks,
        nextStep,
        prevStep,
        goToStep,
        togglePlay,
        stop,
        restart,
        setSpeed: setPlaybackSpeed,
        toggleBookmark
      }}
    >
      {children}
    </PlaybackContext.Provider>
  );
};

export const usePlayback = () => {
  const context = useContext(PlaybackContext);
  if (!context) {
    throw new Error('usePlayback must be used within a PlaybackProvider');
  }
  return context;
};
