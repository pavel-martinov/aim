"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { DRAMATIC_EASE, DURATION, SMOOTH_EASE } from "@/lib/animations";

type Easing = [number, number, number, number];
const EASE_DRAMATIC = [...DRAMATIC_EASE] as Easing;
const EASE_SMOOTH = [...SMOOTH_EASE] as Easing;

const VIDEO_SRC = "/images/aboutus/aboutus-video.mp4";

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Clamp a pointer event's X position to a 0–1 ratio within an element. */
function pointerRatio(e: { clientX: number }, el: HTMLElement): number {
  const { left, width } = el.getBoundingClientRect();
  return Math.max(0, Math.min(1, (e.clientX - left) / width));
}

// --- SVG icon paths (inline to avoid extra deps) ---
const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
  </svg>
);
const VolumeOnIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);
const VolumeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.8 8.8 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a9 9 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </svg>
);
const CloseIcon = () => (
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
);

/**
 * Inline auto-playing hero video with expandable cinema mode.
 * Preview: muted loop with hover play-button overlay.
 * Cinema: fullscreen portal overlay with custom controls (seek, volume, play/pause).
 */
export default function HeroVideoPlayer() {
  const previewRef = useRef<HTMLVideoElement>(null);
  const cinemaRef = useRef<HTMLVideoElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  const controlsTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const seekingRef = useRef(false);
  const volumeDragging = useRef(false);
  const savedVolume = useRef(0.7);

  const [isCinema, setIsCinema] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const v = previewRef.current;
    if (v) v.play().catch(() => {});
  }, []);

  // ─── Cinema open / close ───────────────────────────────────────────

  const openCinema = useCallback(() => {
    setIsCinema(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeCinema = useCallback(() => {
    const cinema = cinemaRef.current;
    const preview = previewRef.current;
    if (cinema && preview) preview.currentTime = cinema.currentTime;
    preview?.play().catch(() => {});
    setIsCinema(false);
    document.body.style.overflow = "";
  }, []);

  /** Ref callback: syncs time + starts unmuted playback the instant the cinema video mounts. */
  const cinemaRefCallback = useCallback(
    (node: HTMLVideoElement | null) => {
      cinemaRef.current = node;
      if (!node) return;
      const preview = previewRef.current;
      if (preview) {
        node.currentTime = preview.currentTime;
        preview.pause();
      }
      node.volume = savedVolume.current;
      node.muted = false;
      node.play().catch(() => {});
      setIsPlaying(true);
      setIsMuted(false);
      setVolume(savedVolume.current);
    },
    []
  );

  // ─── Cinema video event listeners ──────────────────────────────────

  useEffect(() => {
    if (!isCinema) return;

    const attach = () => {
      const v = cinemaRef.current;
      if (!v) return;

      const onTime = () => {
        if (seekingRef.current) return;
        setCurrentTime(v.currentTime);
        setDuration(v.duration || 0);
        setProgress(v.duration ? v.currentTime / v.duration : 0);
      };
      const onPlay = () => setIsPlaying(true);
      const onPause = () => setIsPlaying(false);

      v.addEventListener("timeupdate", onTime);
      v.addEventListener("play", onPlay);
      v.addEventListener("pause", onPause);
      return () => {
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("play", onPlay);
        v.removeEventListener("pause", onPause);
      };
    };

    const cleanup = attach();
    return cleanup;
  }, [isCinema]);

  // ─── Keyboard: Escape & Space ──────────────────────────────────────

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

  // ─── Controls auto-hide ────────────────────────────────────────────

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

  const showControls = controlsVisible || !isPlaying;

  // ─── Playback controls ─────────────────────────────────────────────

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

  // ─── Progress bar: pointer-event drag seek ─────────────────────────

  const seekTo = useCallback((clientX: number) => {
    const bar = progressRef.current;
    const v = cinemaRef.current;
    if (!bar || !v || !v.duration) return;
    const ratio = pointerRatio({ clientX }, bar);
    v.currentTime = ratio * v.duration;
    setProgress(ratio);
    setCurrentTime(ratio * v.duration);
  }, []);

  const onSeekDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      seekingRef.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      seekTo(e.clientX);
    },
    [seekTo]
  );

  const onSeekMove = useCallback(
    (e: React.PointerEvent) => {
      if (!seekingRef.current) return;
      seekTo(e.clientX);
    },
    [seekTo]
  );

  const onSeekUp = useCallback(() => {
    seekingRef.current = false;
  }, []);

  // ─── Volume bar: pointer-event drag ────────────────────────────────

  const applyVolume = useCallback((clientX: number) => {
    const bar = volumeBarRef.current;
    const v = cinemaRef.current;
    if (!bar || !v) return;
    const val = pointerRatio({ clientX }, bar);
    v.volume = val;
    savedVolume.current = val;
    setVolume(val);
    v.muted = val === 0;
    setIsMuted(val === 0);
  }, []);

  const onVolDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      volumeDragging.current = true;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      applyVolume(e.clientX);
    },
    [applyVolume]
  );

  const onVolMove = useCallback(
    (e: React.PointerEvent) => {
      if (!volumeDragging.current) return;
      applyVolume(e.clientX);
    },
    [applyVolume]
  );

  const onVolUp = useCallback(() => {
    volumeDragging.current = false;
  }, []);

  // ─── Render ────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Preview ── */}
      <motion.div
        className="relative h-full w-full cursor-pointer overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={openCinema}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: DURATION.hero,
          ease: EASE_DRAMATIC,
          delay: 0.5,
        }}
      >
        <video
          ref={previewRef}
          className="pointer-events-none h-full w-full object-cover"
          src={VIDEO_SRC}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          onCanPlay={(e) => e.currentTarget.play().catch(() => {})}
        />

        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/30"
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
            <PlayIcon />
          </div>
        </motion.div>
      </motion.div>

      {/* ── Cinema overlay (portal) ── */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isCinema && (
              <motion.div
                key="cinema"
                className="fixed inset-0 z-[100000] flex items-center justify-center"
                onPointerMove={resetControls}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: DURATION.exit,
                  ease: EASE_SMOOTH,
                }}
              >
                {/* Backdrop */}
                <motion.div
                  className="absolute inset-0 bg-black/90 backdrop-blur-md"
                  onClick={closeCinema}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />

                {/* Video container */}
                <motion.div
                  className="relative z-10 w-[92vw] max-w-[1200px] overflow-hidden rounded-2xl bg-black"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{
                    duration: 0.6,
                    ease: EASE_DRAMATIC,
                  }}
                >
                  {/* Close button */}
                  <button
                    className={`absolute right-3 top-3 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-opacity duration-300 hover:bg-black/70 ${
                      showControls
                        ? "opacity-100"
                        : "pointer-events-none opacity-0"
                    }`}
                    onClick={closeCinema}
                  >
                    <CloseIcon />
                  </button>

                  <video
                    ref={cinemaRefCallback}
                    className="block aspect-video w-full cursor-pointer bg-black"
                    src={VIDEO_SRC}
                    loop
                    playsInline
                    preload="auto"
                    disablePictureInPicture
                    controlsList="nodownload nofullscreen noremoteplayback"
                    onClick={togglePlay}
                  />

                  {/* Controls bar */}
                  <div
                    className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-12 transition-all duration-300 ${
                      showControls
                        ? "translate-y-0 opacity-100"
                        : "pointer-events-none translate-y-2 opacity-0"
                    }`}
                  >
                    {/* Progress bar with drag seek */}
                    <div
                      ref={progressRef}
                      className="group mb-3 cursor-pointer touch-none py-2"
                      onPointerDown={onSeekDown}
                      onPointerMove={onSeekMove}
                      onPointerUp={onSeekUp}
                    >
                      <div className="relative h-1 rounded-full bg-white/20 transition-[height] duration-150 group-hover:h-1.5">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full bg-[#24ff00]"
                          style={{ width: `${progress * 100}%` }}
                        />
                        <div
                          className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full bg-[#24ff00] opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100"
                          style={{ left: `${progress * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-white sm:gap-3">
                      {/* Play / Pause */}
                      <button
                        className="flex h-11 w-11 shrink-0 items-center justify-center transition-opacity hover:opacity-80"
                        onClick={togglePlay}
                      >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                      </button>

                      {/* Mute / Unmute */}
                      <button
                        className="flex h-11 w-11 shrink-0 items-center justify-center transition-opacity hover:opacity-80"
                        onClick={toggleMute}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeOffIcon />
                        ) : (
                          <VolumeOnIcon />
                        )}
                      </button>

                      {/* Volume slider */}
                      <div
                        ref={volumeBarRef}
                        className="hidden w-20 cursor-pointer touch-none py-2 sm:block"
                        onPointerDown={onVolDown}
                        onPointerMove={onVolMove}
                        onPointerUp={onVolUp}
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

                      {/* Time */}
                      <span className="ml-auto whitespace-nowrap font-mono text-xs text-white/70">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
