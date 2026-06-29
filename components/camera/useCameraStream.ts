import { useEffect, useRef, useState } from "react";

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState("");

  async function startCamera() {
    try {
      stopCamera();

      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = cameraStream;

      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
        await videoRef.current.play().catch(() => {});
      }

      setError("");
      return true;
    } catch {
      setError("Camera access was denied or unavailable.");
      return false;
    }
  }

  useEffect(() => {
    startCamera();

    return () => {
      stopCamera();
    };
  }, []);

  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  async function captureFrame() {
    if (!videoRef.current) throw new Error("Camera is not ready.");

    const video = videoRef.current;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      throw new Error("Camera image is not ready yet.");
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Could not capture image.");

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Could not create image file."));
        },
        "image/jpeg",
        0.92
      );
    });
  }

  async function restartCamera() {
    return await startCamera();
  }

  return {
    videoRef,
    error,
    stopCamera,
    captureFrame,
    restartCamera,
  };
}