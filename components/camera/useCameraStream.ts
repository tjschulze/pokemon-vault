import { useEffect, useRef, useState } from "react";

export function useCameraStream() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function startCamera() {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        setStream(cameraStream);

        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream;
        }
      } catch {
        setError("Camera access was denied or unavailable.");
      }
    }

    startCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  function stopCamera() {
    stream?.getTracks().forEach((track) => track.stop());
  }

  async function captureFrame() {
    if (!videoRef.current) throw new Error("Camera is not ready.");

    const video = videoRef.current;
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

  return {
    videoRef,
    error,
    stopCamera,
    captureFrame,
  };
}