"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type AudioContextValue = {
  isPlaying: boolean;
  isMuted: boolean;
  toggleMute: () => void;
  startPlayback: () => void;
  pausePlayback: () => void;
};

const AudioContext = createContext<AudioContextValue | null>(null);

const AUDIO_SRC = "/Audio/AIMBgMusic.mp3";
const VOLUME = 0.15;

/**
 * Provides shared audio state and controls for routes that support background music.
 * Handles browser autoplay policy by setting up interaction listeners when blocked.
 */
export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const interactionListenerRef = useRef<(() => void) | null>(null);

  /** Removes any existing interaction listeners to prevent duplicates/races. */
  const clearInteractionListeners = useCallback(() => {
    if (interactionListenerRef.current) {
      document.removeEventListener("click", interactionListenerRef.current);
      document.removeEventListener("touchstart", interactionListenerRef.current);
      interactionListenerRef.current = null;
    }
  }, []);

  /** Sets up listeners to play audio on next user interaction (for autoplay policy). */
  const setupInteractionListener = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    clearInteractionListeners();

    const playOnInteraction = () => {
      audio.play().catch(() => {});
      clearInteractionListeners();
    };

    interactionListenerRef.current = playOnInteraction;
    document.addEventListener("click", playOnInteraction);
    document.addEventListener("touchstart", playOnInteraction);
  }, [clearInteractionListeners]);

  /** Plays audio and falls back to next interaction if autoplay is blocked. */
  const playAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.play().catch(() => {
      setupInteractionListener();
    });
  }, [setupInteractionListener]);

  /** Starts playback only when not muted, used for automatic start flows. */
  const startPlayback = useCallback(() => {
    if (isMuted) return;
    playAudio();
  }, [isMuted, playAudio]);

  useEffect(() => {
    const audio = new Audio(AUDIO_SRC);
    audio.volume = VOLUME;
    audio.loop = true;
    audio.preload = "auto";
    audioRef.current = audio;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    startPlayback();

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.pause();
      audio.src = "";
      clearInteractionListeners();
    };
  }, [clearInteractionListeners, startPlayback]);

  const pausePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    clearInteractionListeners();

    if (isMuted) {
      setIsMuted(false);
      playAudio();
    } else {
      audio.pause();
      setIsMuted(true);
    }
  }, [isMuted, clearInteractionListeners, playAudio]);

  return (
    <AudioContext.Provider
      value={{ isPlaying, isMuted, toggleMute, startPlayback, pausePlayback }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio(): AudioContextValue {
  const ctx = useContext(AudioContext);
  if (!ctx) {
    throw new Error("useAudio must be used within AudioProvider");
  }
  return ctx;
}

/** Returns audio controls when the current route is wrapped with audio support. */
export function useOptionalAudio(): AudioContextValue | null {
  return useContext(AudioContext);
}
