import { Archive } from "lucide-react";

export function CaptureReview({
  previewUrl,
  archiving,
  error,
  onCapture,
  onHighQualityCapture,
  onConfirm,
  onRetake,
}: {
  previewUrl: string;
  archiving: boolean;
  error: string;
  onCapture: () => void;
  onHighQualityCapture: (file?: File) => void;
  onConfirm: () => void;
  onRetake: () => void;
}) {
  return (
    <div className="fixed left-0 right-0 bottom-0 z-30 px-5 pb-[calc(env(safe-area-inset-bottom)+6rem)]">
      {previewUrl && (
        <div className="mb-4 mx-auto max-w-xs rounded-2xl border border-emerald-400/40 overflow-hidden bg-slate-950">
          <img src={previewUrl} alt="Captured preview" className="w-full" />
          <button
            onClick={onRetake}
            className="w-full py-3 bg-slate-900 text-slate-300 font-bold"
          >
            Retake
          </button>
        </div>
      )}

      {error && <p className="mb-4 text-center text-red-300">{error}</p>}
      <label className="mb-3 mx-auto w-full max-w-sm rounded-2xl bg-slate-950/90 border border-emerald-400/40 px-6 py-4 text-emerald-300 font-black text-lg flex items-center justify-center gap-2">
        High Quality Capture
        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onHighQualityCapture(e.target.files?.[0])}
        />
      </label>
      <button
        onClick={previewUrl ? onConfirm : onCapture}
        disabled={archiving || !!error}
        className="mx-auto w-full max-w-sm rounded-2xl bg-emerald-400 px-6 py-4 text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        <Archive size={22} />
        {archiving
          ? "Creating Passport..."
          : previewUrl
            ? "Confirm Archive"
            : "Archive Card"}
      </button>
    </div>
  );
}