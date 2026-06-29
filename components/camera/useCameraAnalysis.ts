import { useEffect, useState } from "react";

export type CameraStatus = "searching" | "steady" | "glare" | "blurry" | "ready";

export function useCameraAnalysis(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [cameraStatus, setCameraStatus] = useState<CameraStatus>("searching");
  const [cameraHint, setCameraHint] = useState("Center the card in the frame");

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    let lastBrightness = 0;

    const timer = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || !ctx || video.videoWidth === 0) return;

      canvas.width = 160;
      canvas.height = 224;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;

      let brightness = 0;
      let brightPixels = 0;
      let contrast = 0;

      for (let i = 0; i < data.length; i += 4) {
        const value = (data[i] + data[i + 1] + data[i + 2]) / 3;
        brightness += value;

        if (value > 235) brightPixels++;

        if (i > 4) {
          const previous = (data[i - 4] + data[i - 3] + data[i - 2]) / 3;
          contrast += Math.abs(value - previous);
        }
      }

      const pixels = data.length / 4;
      const avgBrightness = brightness / pixels;
      const glareRatio = brightPixels / pixels;
      const avgContrast = contrast / pixels;
      const movement = Math.abs(avgBrightness - lastBrightness);

      lastBrightness = avgBrightness;

      if (glareRatio > 0.08) {
        setCameraStatus("glare");
        setCameraHint("Reduce glare");
      } else if (avgContrast < 3) {
        setCameraStatus("blurry");
        setCameraHint("Move closer or improve lighting");
      } else if (movement > 8) {
        setCameraStatus("steady");
        setCameraHint("Hold steady");
      } else {
        setCameraStatus("ready");
        setCameraHint("Ready to archive");
      }
    }, 600);

    return () => window.clearInterval(timer);
  }, [videoRef]);

  return { cameraStatus, cameraHint };
}