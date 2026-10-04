import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/lostFoundApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
  formatDate: () => "28 Februari 2024",
}));

import * as api from "../api/lostFoundApi";
import HomePage from "./HomePage";
import { renderWithProviders } from "../../../test-utils";

const make = (id, title, status, done, description = "Deskripsi " + title) => ({
  id, user_id: 1, title, description, status, is_completed: done, cover: null,
  created_at: "2024-02-28T07:49:32.000000Z", author: { name: "Ani", photo: null },
});

const items = [make(1, "Dompet", "lost", 0), make(2, "Kunci", "found", 1), make(3, "Payung", "lost", 1)];

const stats = {
  stats_losts: { "01-10-2024": 2, "02-10-2024": 0 },
  stats_founds: { "01-10-2024": 0, "02-10-2024": 1 },
};

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchLostFounds.mockResolvedValue({ status: "success", data: { lost_founds: items } });
    api.fetchLostFoundStatsDaily.mockResolvedValue({ status: "success", data: stats });
  });

  it("menampilkan ringkasan metrik, grafik, dan daftar", async () => {
    renderWithProviders(<HomePage />);
    expect(await screen.findByRole("link", { name: "Dompet" })).toBeInTheDocument();
    expect(document.title).toBe("Beranda | Lost & Founds");
    const summary = screen.getByRole("region", { name: "Ringkasan laporan" });
    expect(within(summary).getByText("Total laporan").nextSibling).toHaveTextContent("3");
    expect(within(summary).getByText("Barang hilang").nextSibling).toHaveTextContent("2");
    expect(within(summary).getByText("Barang ditemukan").nextSibling).toHaveTextContent("1");
    expect(within(summary).getByText("Selesai").nextSibling).toHaveTextContent("2");
    expect(await screen.findByRole("img", { name: /Grafik laporan harian/ })).toBeInTheDocument();
  });

  it("tanpa grafik bila statistik gagal dimuat", async () => {
    api.fetchLostFoundStatsDaily.mockResolvedValue({ status: "fail" });
    renderWithProviders(<HomePage />);
    await screen.findByRole("link", { name: "Dompet" });
    expect(screen.queryByRole("img", { name: /Grafik/ })).not.toBeInTheDocument();
  });

  it("tanpa grafik bila data statistik kosong", async () => {
    api.fetchLostFoundStatsDaily.mockResolvedValue({ status: "success", data: { stats_losts: {}, stats_founds: {} } });
    renderWithProviders(<HomePage />);
    await screen.findByRole("link", { name: "Dompet" });
    expect(screen.queryByRole("img", { name: /Grafik/ })).not.toBeInTheDocument();
  });

  it("memfilter berdasarkan jenis, status selesai, dan kata kunci", async () => {
    renderWithProviders(<HomePage />);
    await screen.findByRole("link", { name: "Dompet" });

    await userEvent.click(screen.getByRole("button", { name: "Hilang" }));
    expect(screen.getByRole("button", { name: "Hilang" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByRole("link", { name: "Kunci" })).not.toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText("Status"), "1");
    expect(screen.queryByRole("link", { name: "Dompet" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Payung" })).toBeInTheDocument();

    await userEvent.selectOptions(screen.getByLabelText("Status"), "0");
    expect(screen.getByRole("link", { name: "Dompet" })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Semua" }));
    await userEvent.selectOptions(screen.getByLabelText("Status"), "all");
    await userEvent.type(screen.getByLabelText("Cari laporan"), "kunci");
    expect(screen.getAllByRole("link")).toHaveLength(1);

    await userEvent.clear(screen.getByLabelText("Cari laporan"));
    await userEvent.type(screen.getByLabelText("Cari laporan"), "tidak-ada");
    expect(screen.getByText("Tidak ada laporan yang sesuai.")).toBeInTheDocument();
  });

  it("memfilter laporan milik saya lewat API", async () => {
    renderWithProviders(<HomePage />);
    await screen.findByRole("link", { name: "Dompet" });
    await userEvent.click(screen.getByLabelText("Hanya laporan saya"));
    await waitFor(() => expect(api.fetchLostFounds).toHaveBeenLastCalledWith({ isMe: true }));
  });

  it("menampilkan indikator memuat", async () => {
    api.fetchLostFounds.mockReturnValue(new Promise(() => {}));
    renderWithProviders(<HomePage />);
    expect(await screen.findByRole("status")).toHaveTextContent("Memuat laporan...");
  });

  it("menambah laporan lalu memuat ulang data", async () => {
    api.postLostFound.mockResolvedValue({ status: "success", data: { lost_found_id: 9 } });
    renderWithProviders(<HomePage />);
    await screen.findByRole("link", { name: "Dompet" });
    await userEvent.click(screen.getByRole("button", { name: "Tambah laporan" }));
    expect(screen.getByRole("dialog", { name: "Tambah laporan" })).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Judul"), "Tas");
    await userEvent.type(screen.getByLabelText("Deskripsi"), "Tas biru");
    const before = api.fetchLostFounds.mock.calls.length;
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(api.fetchLostFounds.mock.calls.length).toBeGreaterThan(before));
  });
});
