export default function Spinner({ label = "Memuat..." }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-12 text-slate-700">
      <span
        aria-hidden="true"
        className="h-6 w-6 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700"
      />
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}
