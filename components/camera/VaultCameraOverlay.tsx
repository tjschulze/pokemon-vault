import { Camera, X } from "lucide-react";
import type { CameraStatus } from "./useCameraAnalysis";

export function VaultCameraOverlay({
  cameraHint,
  cameraStatus,
  onClose,
}: {
  cameraHint: string;
  cameraStatus: CameraStatus;
  onClose: () => void;
}) {
  return (
    <>
      <div className="absolute inset-0 bg-black/40" />

      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 rounded-full bg-slate-950/80 border border-slate-700 p-3"
      >
        <X />
      </button>

      <div className="relative z-10 min-h-screen flex flex-col justify-between p-5 pt-12 pb-56 text-center">
        <div>
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <Camera size={30} />
          </div>

          <h1 className="text-4xl font-black">The Vault Camera</h1>
          <p className="mt-2 text-slate-300">
            Center the card. Archive the story.
          </p>
        </div>

        <div className="mx-auto w-full max-w-xs">
          <div className="relative aspect-[2.5/3.5] rounded-[2rem] bg-emerald-400/5 backdrop-blur-[1px] shadow-2xl shadow-emerald-500/30">
            <div className={"absolute -top-1 -left-1 h-12 w-12 border-t-4 border-l-4 ${cameraStatus === "ready" ? "border-emerald-300" : cameraStatus === "glare" ? "border-red-300" : "border-yellow-300"}"} />
            <div className={"absolute -top-1 -right-1 h-12 w-12 border-t-4 border-r-4 ${cameraStatus === "ready" ? "border-emerald-300" : cameraStatus === "glare" ? "border-red-300" : "border-yellow-300"}"} />
            <div className={"absolute -bottom-1 -left-1 h-12 w-12 border-b-4 border-l-4 ${cameraStatus === "ready" ? "border-emerald-300" : cameraStatus === "glare" ? "border-red-300" : "border-yellow-300"}"} />
            <div className={"absolute -bottom-1 -right-1 h-12 w-12 border-b-4 border-r-4 ${cameraStatus === "ready" ? "border-emerald-300" : cameraStatus === "glare" ? "border-red-300" : "border-yellow-300"}"} />

            <div className="absolute inset-4 rounded-[1.5rem] border border-emerald-300/40" />

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="rounded-full bg-slate-950/70 border border-emerald-400/40 px-4 py-2 text-sm text-emerald-300">
                {cameraHint}
              </div>
            </div>
          </div>

          <p className="mt-4 text-sm text-emerald-300">
            Every card has a story. Every story deserves a home.
          </p>
        </div>
      </div>
    </>
  );
}