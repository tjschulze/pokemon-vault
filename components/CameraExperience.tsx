"use client";

import { useEffect, useState } from "react";
import type { CardCopy } from "@/types/card";
import { useCameraStream } from "./camera/useCameraStream";
import { VaultCameraOverlay } from "./camera/VaultCameraOverlay";
import { CaptureReview } from "./camera/CaptureReview";
import { archiveCardImage } from "./camera/archiveCard";
import { vibrate } from "./camera/vaultFeedback";
import { useCameraAnalysis } from "./camera/useCameraAnalysis";

export function CameraExperience({
  onClose,
  onCardCreated,
  nextId,
}: {
  onClose: () => void;
  onCardCreated: (card: CardCopy) => void;
  nextId: string;
}) {
  const { videoRef, error, stopCamera, captureFrame, restartCamera } = useCameraStream();
  const { cameraStatus, cameraHint } = useCameraAnalysis(videoRef);

  const [capturedBlob, setCapturedBlob] = useState<Blob | null>(null);
  const [capturedPreview, setCapturedPreview] = useState("");
  const [archiving, setArchiving] = useState(false);

  useEffect(() => {
    const hints = [
      "Center the card in the frame",
      "Hold steady",
      "Avoid glare on the surface",
      "Fill the brass corners with the card",
    ];

    let hintIndex = 0;

    const hintTimer = window.setInterval(() => {
      hintIndex = (hintIndex + 1) % hints.length;
    }, 2500);

    return () => window.clearInterval(hintTimer);
  }, []);

  async function handleCapture() {
    try {
      setArchiving(true);
      const blob = await captureFrame();
      vibrate(35);
      const previewUrl = URL.createObjectURL(blob);

      setCapturedBlob(blob);
      setCapturedPreview(previewUrl);
      setArchiving(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Capture failed.";
      alert(message);
      setArchiving(false);
    }
  }

  async function handleManualFocus() {
    const restarted = await restartCamera();

    if (restarted) {
      vibrate(25);
    } else {
      alert("Could not restart the camera. Try closing and reopening The Vault Camera.");
    }
  }

  async function handleConfirmArchive() {
    if (!capturedBlob) return;

    try {
      setArchiving(true);
      vibrate([30, 40, 30]);vibrate([30, 40, 30]);
      const card = await archiveCardImage({
        blob: capturedBlob,
        nextId,
      });

      stopCamera();
      onCardCreated(card);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Archive failed.";
      alert(message);
      setArchiving(false);
    }
  }

  function handleRetake() {
    if (capturedPreview) URL.revokeObjectURL(capturedPreview);
    setCapturedPreview("");
    setCapturedBlob(null);
  }

  function handleClose() {
    stopCamera();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />

      <VaultCameraOverlay
        cameraHint={cameraHint}
        cameraStatus={cameraStatus}
        onClose={handleClose}
        onManualFocus={handleManualFocus}
      />

      <CaptureReview
        previewUrl={capturedPreview}
        archiving={archiving}
        error={error}
        onCapture={handleCapture}
        onConfirm={handleConfirmArchive}
        onRetake={handleRetake}
      />
    </div>
  );
}