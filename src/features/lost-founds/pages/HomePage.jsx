import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import LostFoundCard from "../components/LostFoundCard";
import AddModal from "../modals/AddModal";
import Spinner from "../../../components/Spinner";
import useInput from "../../../hooks/useInput";
import useDocumentTitle from "../../../hooks/useDocumentTitle";
import { cn, btnPrimary } from "../../../helpers/classHelper";
import {
  asyncSetLostFounds,
  asyncSetLostFoundStats,
  setIsLostFoundAddedActionCreator,
} from "../states/action";

const statusFilters = [
  { value: "all", label: "Semua" },
  { value: "lost", label: "Hilang" },
  { value: "found", label: "Ditemukan" },
];

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-medium text-slate-700">{label}</p>
      <p className="mt-1 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

function StatsChart({ stats }) {
  const days = Object.keys(stats.stats_losts);
  const max = Math.max(1, ...days.flatMap((day) => [stats.stats_losts[day], stats.stats_founds[day]]));
  const summary = days
    .map((day) => `${day}: ${stats.stats_losts[day]} hilang, ${stats.stats_founds[day]} ditemukan`)
    .join("; ");

  return (
    <section aria-labelledby="stats-heading" className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h2 id="stats-heading" className="text-base font-bold text-slate-900">
        Aktivitas 7 hari terakhir
      </h2>
      <div role="img" aria-label={`Grafik laporan harian. ${summary}`} className="mt-4 flex h-32 items-end gap-2">
        {days.map((day) => (
          <div key={day} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
            <div className="flex h-full w-full items-end justify-center gap-1">
              <span className="w-1/3 rounded-t bg-rose-600" style={{ height: `${(stats.stats_losts[day] / max) * 100}%`, minHeight: 2 }} />
              <span className="w-1/3 rounded-t bg-emerald-700" style={{ height: `${(stats.stats_founds[day] / max) * 100}%`, minHeight: 2 }} />
            </div>
            <span className="text-xs text-slate-700">{day.slice(0, 2)}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 flex gap-4 text-xs font-medium text-slate-700">
        <span className="flex items-center gap-1.5"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-rose-600" />Hilang</span>
        <span className="flex items-center gap-1.5"><span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm bg-emerald-700" />Ditemukan</span>
      </p>
    </section>
  );
}

export default function HomePage() {
  useDocumentTitle("Beranda");
  const dispatch = useDispatch();
  const lostFounds = useSelector((state) => state.lostFounds);
  const stats = useSelector((state) => state.lostFoundStats);
  const isLoading = useSelector((state) => state.isLostFound);
  const isAdded = useSelector((state) => state.isLostFoundAdded);

  const [keyword, onKeywordChange] = useInput("");
  const [status, setStatus] = useState("all");
  const [completion, onCompletionChange] = useInput("all");
  const [onlyMe, setOnlyMe] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    dispatch(asyncSetLostFounds({ isMe: onlyMe }));
  }, [dispatch, onlyMe]);

  useEffect(() => {
    dispatch(asyncSetLostFoundStats());
  }, [dispatch]);

  useEffect(() => {
    if (!isAdded) return;
    dispatch(setIsLostFoundAddedActionCreator(false));
    dispatch(asyncSetLostFounds({ isMe: onlyMe }));
    dispatch(asyncSetLostFoundStats());
  }, [dispatch, isAdded, onlyMe]);

  const metrics = useMemo(
    () => ({
      total: lostFounds.length,
      lost: lostFounds.filter((item) => item.status === "lost").length,
      found: lostFounds.filter((item) => item.status === "found").length,
      completed: lostFounds.filter((item) => Number(item.is_completed) === 1).length,
    }),
    [lostFounds]
  );

  const visible = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    return lostFounds.filter((item) => {
      if (status !== "all" && item.status !== status) return false;
      if (completion !== "all" && String(Number(item.is_completed)) !== completion) return false;
      return !query || `${item.title} ${item.description}`.toLowerCase().includes(query);
    });
  }, [lostFounds, keyword, status, completion]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">Laporan barang</h1>
          <p className="mt-1 text-slate-700">Pantau barang hilang dan temuan di sekitar Anda.</p>
        </div>
        <button type="button" onClick={() => setShowAdd(true)} className={btnPrimary}>
          <IconPlus size={18} aria-hidden="true" />
          Tambah laporan
        </button>
      </div>

      <section aria-label="Ringkasan laporan" className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard label="Total laporan" value={metrics.total} />
        <MetricCard label="Barang hilang" value={metrics.lost} />
        <MetricCard label="Barang ditemukan" value={metrics.found} />
        <MetricCard label="Selesai" value={metrics.completed} />
      </section>

      {stats && Object.keys(stats.stats_losts).length > 0 && <StatsChart stats={stats} />}

      <section aria-label="Filter laporan" className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="relative">
          <label htmlFor="search" className="sr-only">
            Cari laporan
          </label>
          <IconSearch size={18} aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            id="search"
            type="search"
            value={keyword}
            onChange={onKeywordChange}
            placeholder="Cari judul atau deskripsi..."
            className="block w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-3 text-sm placeholder:text-slate-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div role="group" aria-label="Filter jenis laporan" className="flex gap-2">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                type="button"
                aria-pressed={status === filter.value}
                onClick={() => setStatus(filter.value)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-semibold",
                  status === filter.value
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="completion" className="text-sm font-medium text-slate-800">
              Status
            </label>
            <select
              id="completion"
              value={completion}
              onChange={onCompletionChange}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-900"
            >
              <option value="all">Semua</option>
              <option value="0">Belum selesai</option>
              <option value="1">Selesai</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <input type="checkbox" checked={onlyMe} onChange={(event) => setOnlyMe(event.target.checked)} />
            Hanya laporan saya
          </label>
        </div>
      </section>

      <section aria-label="Daftar laporan">
        {isLoading ? (
          <Spinner label="Memuat laporan..." />
        ) : visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-700">
            Tidak ada laporan yang sesuai.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visible.map((item) => (
              <li key={item.id}>
                <LostFoundCard item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {showAdd && <AddModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
