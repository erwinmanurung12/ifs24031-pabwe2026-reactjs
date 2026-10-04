import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";

vi.mock("../api/lostFoundApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
  showConfirmDialog: vi.fn(),
  formatDate: () => "28 Februari 2024",
}));

import * as api from "../api/lostFoundApi";
import { showConfirmDialog } from "../../../helpers/toolsHelper";
import DetailPage from "./DetailPage";
import { renderWithProviders } from "../../../test-utils";

const item = {
  id: 5, user_id: 1, title: "Dompet", description: "Cokelat\nberisi KTP", status: "lost", is_completed: 0,
  cover: "img/lost-founds/cover/5.png", created_at: "2024-02-28T07:49:32.000000Z",
  author: { name: "Ani", photo: null },
};

function ui() {
  return (
    <Routes>
      <Route path="/" element={<p>Beranda</p>} />
      <Route path="/lost-founds/:id" element={<DetailPage />} />
    </Routes>
  );
}

const render = (profileId = 1) =>
  renderWithProviders(ui(), { route: "/lost-founds/5", preloadedState: { profile: { id: profileId, name: "Ani" } } });

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchLostFound.mockResolvedValue({ status: "success", data: { lost_found: item } });
  });

  it("menampilkan detail laporan untuk pemilik", async () => {
    render();
    expect(await screen.findByRole("heading", { level: 1, name: "Dompet" })).toBeInTheDocument();
    expect(document.title).toBe("Dompet | Lost & Founds");
    expect(screen.getByAltText("Foto Dompet")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ubah cover" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ubah data" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Hapus" })).toBeInTheDocument();
  });

  it("menyembunyikan aksi untuk bukan pemilik dan menampilkan placeholder cover", async () => {
    api.fetchLostFound.mockResolvedValue({ status: "success", data: { lost_found: { ...item, cover: null } } });
    render(99);
    await screen.findByRole("heading", { name: "Dompet" });
    expect(screen.getByText("Belum ada foto")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Hapus" })).not.toBeInTheDocument();
  });

  it("fallback bila gambar cover gagal dimuat", async () => {
    render();
    fireEvent.error(await screen.findByAltText("Foto Dompet"));
    expect(screen.getByText("Belum ada foto")).toBeInTheDocument();
  });

  it("menampilkan loading lalu pesan tidak ditemukan", async () => {
    api.fetchLostFound.mockResolvedValue({ status: "fail", message: "Tidak ada" });
    render();
    expect(screen.getByRole("status")).toHaveTextContent("Memuat detail...");
    expect(await screen.findByText("Laporan tidak ditemukan.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Kembali ke beranda/ })).toHaveAttribute("href", "/");
  });

  it("mengubah data lalu memuat ulang detail", async () => {
    api.putLostFound.mockResolvedValue({ status: "success" });
    render();
    await userEvent.click(await screen.findByRole("button", { name: "Ubah data" }));
    expect(screen.getByRole("dialog", { name: "Ubah laporan" })).toBeInTheDocument();
    const before = api.fetchLostFound.mock.calls.length;
    await userEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(api.fetchLostFound.mock.calls.length).toBeGreaterThan(before));
  });

  it("mengubah cover lalu memuat ulang detail", async () => {
    api.postLostFoundCover.mockResolvedValue({ status: "success" });
    render();
    await userEvent.click(await screen.findByRole("button", { name: "Ubah cover" }));
    fireEvent.change(screen.getByLabelText("Pilih gambar"), { target: { files: [new File(["x"], "a.png", { type: "image/png" })] } });
    const before = api.fetchLostFound.mock.calls.length;
    await userEvent.click(screen.getByRole("button", { name: "Unggah cover" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(api.fetchLostFound.mock.calls.length).toBeGreaterThan(before));
  });

  it("tidak memperbarui state bila komponen sudah dilepas sebelum fetch selesai", async () => {
    let resolve;
    api.fetchLostFound.mockReturnValue(new Promise((r) => (resolve = r)));
    const { unmount } = render();
    unmount();
    resolve({ status: "success", data: { lost_found: item } });
    await Promise.resolve();
    expect(api.fetchLostFound).toHaveBeenCalledTimes(1);
  });

  it("hapus dibatalkan bila tidak dikonfirmasi", async () => {
    showConfirmDialog.mockResolvedValue(false);
    render();
    await userEvent.click(await screen.findByRole("button", { name: "Hapus" }));
    expect(api.deleteLostFound).not.toHaveBeenCalled();
  });

  it("hapus terkonfirmasi kembali ke beranda", async () => {
    showConfirmDialog.mockResolvedValue(true);
    api.deleteLostFound.mockResolvedValue({ status: "success" });
    render();
    await userEvent.click(await screen.findByRole("button", { name: "Hapus" }));
    expect(await screen.findByText("Beranda")).toBeInTheDocument();
    expect(api.deleteLostFound).toHaveBeenCalledWith("5");
  });
});
