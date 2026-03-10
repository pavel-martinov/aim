"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { isDataImage } from "@/lib/utils";
import { SMOOTH_EASE, DURATION, DRAMATIC_EASE } from "@/lib/animations";
import { PRESET_AVATARS } from "@/lib/mockUser";
import OpaqueButton from "@/components/ui/OpaqueButton";
import GhostButton from "@/components/ui/GhostButton";

const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const CAMERA_CAPTURE_SIZE = 400;
const CAPTURE_QUALITY = 0.9;

interface AvatarPickerModalProps {
  isOpen: boolean;
  currentAvatar?: string;
  onClose: () => void;
  onSelect: (avatarUrl: string) => void;
}

type PickerTab = "presets" | "upload" | "camera";

/**
 * Netflix-style avatar picker modal with preset avatars, upload, and camera options.
 */
export default function AvatarPickerModal({
  isOpen,
  currentAvatar,
  onClose,
  onSelect,
}: AvatarPickerModalProps) {
  const [activeTab, setActiveTab] = useState<PickerTab>("presets");
  const [selectedAvatar, setSelectedAvatar] = useState<string | undefined>(currentAvatar);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Reset state and stop camera when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedAvatar(currentAvatar);
      setActiveTab("presets");
      setCapturedImage(null);
      setCameraError(null);
      setUploadError(null);
      if (cameraStream) {
        cameraStream.getTracks().forEach((track) => track.stop());
        setCameraStream(null);
      }
    }
  }, [isOpen, currentAvatar, cameraStream]);

  // Start/stop camera when tab changes
  useEffect(() => {
    if (activeTab === "camera" && !cameraStream && !cameraError) {
      startCamera();
    } else if (activeTab !== "camera" && cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: CAMERA_CAPTURE_SIZE, height: CAMERA_CAPTURE_SIZE },
      });
      setCameraStream(stream);
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      setCameraError("Camera access denied or not available");
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = CAMERA_CAPTURE_SIZE;
    canvas.height = CAMERA_CAPTURE_SIZE;
    ctx.drawImage(videoRef.current, 0, 0, CAMERA_CAPTURE_SIZE, CAMERA_CAPTURE_SIZE);

    const dataUrl = canvas.toDataURL("image/jpeg", CAPTURE_QUALITY);
    setCapturedImage(dataUrl);
    setSelectedAvatar(dataUrl);
  }, []);

  const retakePhoto = () => {
    setCapturedImage(null);
    setSelectedAvatar(currentAvatar);
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }
    if (file.size > MAX_AVATAR_FILE_SIZE) {
      setUploadError("Image must be less than 5MB");
      return;
    }

    setUploadError(null);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      setSelectedAvatar(event.target?.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleConfirm = () => {
    if (selectedAvatar) {
      onSelect(selectedAvatar);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.fast }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: DURATION.standard, ease: DRAMATIC_EASE }}
            className="fixed inset-x-4 top-1/2 z-50 mx-auto w-[calc(100vw-2rem)] max-h-[92vh] max-w-3xl -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-[var(--background)] shadow-[0_32px_120px_rgba(0,0,0,0.55)]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-white/10 p-5 sm:p-6">
              <div>
                <h2 className="text-2xl text-white font-sans sm:text-3xl">Choose Avatar</h2>
                <p className="mt-1 text-sm text-white/50 font-sans">
                  Pick a cleaner profile image from the preset collection or upload your own.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
              {(["presets", "upload", "camera"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "flex-1 py-3 text-sm font-sans transition-colors capitalize",
                    activeTab === tab
                      ? "border-b-2 border-[var(--color-brand)] text-[var(--color-brand)]"
                      : "text-white/60 hover:text-white"
                  )}
                >
                  {tab === "presets" ? "Avatars" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-5 sm:p-6">
              {activeTab === "presets" && (
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                  {PRESET_AVATARS.map((avatar) => (
                    <button
                      key={avatar}
                      onClick={() => setSelectedAvatar(avatar)}
                      className={cn(
                        "relative aspect-square overflow-hidden rounded-xl transition-all duration-300",
                        "ring-2 ring-offset-2 ring-offset-[var(--background)]",
                        selectedAvatar === avatar
                          ? "ring-[var(--color-brand)]"
                          : "ring-transparent hover:ring-white/30"
                      )}
                    >
                      <div className="absolute inset-0 bg-white/5" />
                      <Image
                        src={avatar}
                        alt="Preset avatar"
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 160px, (min-width: 640px) 25vw, 33vw"
                      />
                      {selectedAvatar === avatar && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-brand)]/20">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[var(--color-brand)]">
                            <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {activeTab === "upload" && (
                <div className="flex flex-col items-center gap-4 py-8">
                  {selectedAvatar?.startsWith("data:") ? (
                    <div className="relative h-32 w-32 overflow-hidden rounded-full ring-2 ring-[var(--color-brand)]">
                      <Image
                        src={selectedAvatar}
                        alt="Preview"
                        fill
                        unoptimized={isDataImage(selectedAvatar)}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-32 w-32 items-center justify-center rounded-full bg-white/10 text-white/40">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                        <path d="M24 32V16M16 24h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}

                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

                  {uploadError && (
                    <p className="text-sm text-red-400 font-sans">{uploadError}</p>
                  )}

                  <GhostButton onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Choose from Device"}
                  </GhostButton>

                  <p className="text-xs text-white/40 font-sans">Max file size: 5MB</p>
                </div>
              )}

              {activeTab === "camera" && (
                <div className="flex flex-col items-center gap-4 py-4">
                  {cameraError ? (
                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-white/40">
                        <rect x="4" y="10" width="40" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
                        <circle cx="24" cy="24" r="8" stroke="currentColor" strokeWidth="2" />
                        <path d="M4 44L44 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                      <p className="text-sm text-white/60 font-sans">{cameraError}</p>
                      <button
                        onClick={() => { setCameraError(null); startCamera(); }}
                        className="text-sm text-[var(--color-brand)] hover:underline"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : capturedImage ? (
                    <>
                      <div className="relative h-48 w-48 overflow-hidden rounded-full ring-2 ring-[var(--color-brand)]">
                        <Image
                          src={capturedImage}
                          alt="Captured"
                          fill
                          unoptimized={isDataImage(capturedImage)}
                          className="object-cover"
                        />
                      </div>
                      <button onClick={retakePhoto} className="text-sm text-white/60 font-sans hover:text-white">
                        Retake Photo
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="relative h-48 w-48 overflow-hidden rounded-full bg-white/10">
                        <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                      </div>
                      <button
                        onClick={capturePhoto}
                        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand)] text-black transition-transform hover:scale-105"
                        aria-label="Capture photo"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="8" fill="currentColor" />
                        </svg>
                      </button>
                    </>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-white/10 p-4">
              <GhostButton onClick={onClose} className="flex-1">
                Cancel
              </GhostButton>
              <OpaqueButton
                variant="brand"
                onClick={handleConfirm}
                disabled={!selectedAvatar}
                showIcon={false}
                className="h-auto flex-1 py-3"
              >
                Save Avatar
              </OpaqueButton>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
