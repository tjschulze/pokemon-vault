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
            width: { ideal: 3840 },
            height: { ideal: 2160 },
          },
          audio: false,
        });

        setStream(cameraStream);

        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream;
          const track = cameraStream.getVideoTracks()[0];

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
    console.log("Capture resolution:", video.videoWidth, video.videoHeight);
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

  async function focusCamera() {
      const activeStream = videoRef.current?.srcObject as MediaStream | null;
      const track = activeStream?.getVideoTracks()[0];

      if (!track) return false;

      try {
        await track.applyConstraints({
          advanced: [
            { focusMode: "continuous" } as MediaTrackConstraintSet,
          ],
        });

        return true;
      } catch {
        return false;
      }
  }

  async function restartCamera() {
    stopCamera();

    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
        audio: false,
      });

      setStream(cameraStream);

      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }

      return true;
    } catch {
      setError("Camera access was denied or unavailable.");
      return false;
    }
  }

  return {
    videoRef,
    error,
    stopCamera,
    captureFrame,
    focusCamera,
    restartCamera,
  };
}