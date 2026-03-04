"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { DRAMATIC_EASE, SMOOTH_EASE, DURATION } from "@/lib/animations";

const VIDEO_SRC = "/images/aboutus/aboutus-video.mp4";

/** Format seconds to m:ss */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Inline auto-playing hero video with expandable cinema mode.
 * Collapsed: muted loop with hover-to-reveal expand affordance.
 * Cinema: fullscreen overlay with custom playback controls.
 */
export default function HeroVideoPlayer() {
  const inlineRef = useRef<HTMLVideoElement>(null);
  const cinemaRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const volumeRef = useRef(0.7);

  const [isCinema, setIsCinema] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState({ current: 0, total: 0 });
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const openCinema = useCallback(() => {
    setIsCinema(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeCinema = useCallback(() => {
    const cinema = cinemaRef.current;
    const inline = inlineRef.current;
    if (cinema && inline) inline.currentTime = cinema.currentTime;
    inline?.play().catch(() => {});
    setIsCinema(false);
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    if (!isCinema) return;
    const cinema = cinemaRef.current;
    const inline = inlineRef.current;
    if (!cinema || !inline) return;

    cinema.currentTime = inline.currentTime;
    cinema.volume = volumeRef.current;
    cinema.muted = false;
    cinema.play().catch(() => {});
    inline.pause();
    setIsPlaying(true);
    setIsMuted(false);
  }, [isCinema]);

  useEffect(() => {
    if (!isCinema) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCinema();
      if (e.key === " ") {
        e.preventDefault();
        const v = cinemaRef.current;
        if (v) v.paused ? v.play() : v.pause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isCinema, closeCinema]);

  useEffect(() => {
    const v = cinemaRef.current;
    if (!v || !isCinema) return;

    const onUpdate = () => {
      setTime({ current: v.currentTime, total: v.duration || 0 });
      setProgress(v.duration ? v.currentTime / v.duration : 0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    v.addEventListener("timeupdate", onUpdate);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    return () => {
      v.removeEventListener("timeupdate", onUpdate);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
    };
  }, [isCinema]);

  const resetControls = useCallback(() => {
    setControlsVisible(true);
    if (controlsTimer.current) clearTimeout(controlsTimer.current);
    controlsTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  }, []);

  useEffect(() => {
    if (isCinema) resetControls();
    return () => {
      if (controlsTimer.current) clearTimeout(controlsTimer.current);
    };
  }, [isCinema, resetControls]);

  const togglePlay = useCallback(() => {
    const v = cinemaRef.current;
    if (v) v.paused ? v.play() : v.pause();
  }, []);

  const toggleMute = useCallback(() => {
    const v = cinemaRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  }, []);

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const v = cinemaRef.current;
      if (!v) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const val = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      v.volume = val;
      volumeRef.current = val;
      setVolume(val);
      v.muted = val === 0;
      setIsMuted(val === 0);
    },
    []
  );

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const v = cinemaRef.current;
      const bar = progressBarRef.current;
      if (!v || !bar) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      v.currentTime = ratio * v.duration;
    },
    []
  );

  const showControls = controlsVisible || !isPlaying;

  return (
    <>
      <motion.div
        className="relative h-full w-full cursor-pointer overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={openCinema}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.hero, ease: DRAMATIC_EASE, delay: 0.5 }}
      >
        <video
          ref={inlineRef}
          className="pointer-events-none h-full w-full object-cover"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
        />

        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30"
          initial={false}
          animate={{ opacity: isHovered && !isCinema ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {isCinema && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.standard, ease: SMOOTH_EASE }}
            onMouseMove={resetControls}
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={closeCinema}
            />

            <motion.div
              className="relative z-10 w-[90vw] max-w-[1200px] overflow-hidden rounded-2xl bg-black"
              initial={{ scale: 0.85, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 30 }}
              transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
            >
              <motion.button
                className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                onClick={closeCinema}
                animate={{ opacity: showControls ? 1 : 0 }}
                style={{ pointerEvents: showControls ? "auto" : "none" }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </motion.button>

              <video
                ref={cinemaRef}
                className="w-full cursor-pointer"
                src={VIDEO_SRC}
                loop
                playsInline
                onClick={togglePlay}
              />

              <motion.div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12"
                animate={{ opacity: showControls ? 1 : 0, y: showControls ? 0 : 8 }}
                style={{ pointerEvents: showControls ? "auto" : "none" }}
                transition={{ duration: 0.3 }}
              >
                <div
                  ref={progressBarRef}
                  className="mb-3 cursor-pointer py-2"
                  onClick={handleSeek}
                >
                  <div className="h-1 rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-[#24ff00]"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 text-white">
                  <button
                    className="flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-80"
                    onClick={togglePlay}
                  >
                    {isPlaying ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    )}
                  </button>

                  <button
                    className="flex h-11 w-11 items-center justify-center transition-opacity hover:opacity-80"
                    onClick={toggleMute}
                  >
                    {isMuted ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a9 9 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                      </svg>
                    )}
                  </button>

                  <div
                    className="w-20 cursor-pointer py-2"
                    onClick={handleVolumeClick}
                  >
                    <div className="h-1 rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-white/60"
                        style={{
                          width: `${(isMuted ? 0 : volume) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  <span className="font-mono text-xs text-white/70">
                    {formatTime(time.current)} / {formatTime(time.total)}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
