import { useEffect, useState } from "react";

export type CameraStatus =
  | "searching"
  | "steady"
  | "glare"
  | "blurry"
  | "ready";

export function useCameraAnalysis(
  videoRef: React.RefObject<HTMLVideoElement | null>
) {
  const [cameraStatus, setCameraStatus] =
    useState<CameraStatus>("searching");

  const [cameraHint, setCameraHint] = useState(
    "Bring the card to the outer brass frame"
  );

  const [sharpness, setSharpness] = useState(0);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const timer = window.setInterval(() => {
      const video = videoRef.current;
      if (!video || !ctx || video.videoWidth === 0) return;

      canvas.width = 120;
      canvas.height = 168;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frame.data;

      let brightPixels = 0;
      let edgeEnergy = 0;

      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          const i = (y * canvas.width + x) * 4;

          const gray =
            (data[i] + data[i + 1] + data[i + 2]) / 3;

          if (gray > 240) brightPixels++;

          const leftIndex = (y * canvas.width + (x - 1)) * 4;
          const rightIndex = (y * canvas.width + (x + 1)) * 4;
          const upIndex = ((y - 1) * canvas.width + x) * 4;
          const downIndex = ((y + 1) * canvas.width + x) * 4;

          const left =
            (data[leftIndex] + data[leftIndex + 1] + data[leftIndex + 2]) / 3;
          const right =
            (data[rightIndex] + data[rightIndex + 1] + data[rightIndex + 2]) / 3;
          const up =
            (data[upIndex] + data[upIndex + 1] + data[upIndex + 2]) / 3;
          const down =
            (data[downIndex] + data[downIndex + 1] + data[downIndex + 2]) / 3;

          const gx = right - left;
          const gy = down - up;

          edgeEnergy += Math.sqrt(gx * gx + gy * gy);
        }
      }

      const pixels = canvas.width * canvas.height;
      const glareRatio = brightPixels / pixels;
      const sharpnessScore = Math.round(edgeEnergy / pixels);

      setSharpness(sharpnessScore);

      if (glareRatio > 0.08) {
        setCameraStatus("glare");
        setCameraHint("Reduce glare");
      } else if (sharpnessScore < 12) {
        setCameraStatus("blurry");
        setCameraHint("Move closer, tap Refocus, then pull back");
      } else if (sharpnessScore < 20) {
        setCameraStatus("steady");
        setCameraHint("Hold steady");
      } else {
        setCameraStatus("ready");
        setCameraHint("Ready to archive");
      }
    }, 500);

    return () => window.clearInterval(timer);
  }, [videoRef]);

  return { cameraStatus, cameraHint, sharpness };
}