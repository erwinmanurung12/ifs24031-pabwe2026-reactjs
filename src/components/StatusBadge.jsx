import { cn } from "../helpers/classHelper";

export default function StatusBadge({ status, isCompleted }) {
  const isLost = status === "lost";
  return (
    <span className="inline-flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "rounded-full px-2.5 py-0.5 text-xs font-bold",
          isLost ? "bg-rose-100 text-rose-800" : "bg-emerald-100 text-emerald-900"
        )}
      >
        {isLost ? "Hilang" : "Ditemukan"}
      </span>
      {isCompleted && (
        <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-bold text-slate-800">Selesai</span>
      )}
    </span>
  );
}
