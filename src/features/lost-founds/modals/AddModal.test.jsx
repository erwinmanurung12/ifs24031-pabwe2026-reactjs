import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/lostFoundApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
}));

import { postLostFound } from "../api/lostFoundApi";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import AddModal from "./AddModal";
import { renderWithProviders } from "../../../test-utils";

describe("AddModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memvalidasi judul dan deskripsi", async () => {
    renderWithProviders(<AddModal onClose={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    expect(screen.getByText("Judul wajib diisi")).toBeInTheDocument();
    expect(screen.getByText("Deskripsi wajib diisi")).toBeInTheDocument();
    expect(postLostFound).not.toHaveBeenCalled();
  });

  it("menyimpan laporan baru dan menutup modal", async () => {
    postLostFound.mockResolvedValue({ status: "success", data: { lost_found_id: 1 } });
    const onClose = vi.fn();
    const { store } = renderWithProviders(<AddModal onClose={onClose} />);
    await userEvent.click(screen.getByLabelText("Barang ditemukan"));
    await userEvent.type(screen.getByLabelText("Judul"), " Kunci ");
    await userEvent.type(screen.getByLabelText("Deskripsi"), " Gantungan biru ");
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(postLostFound).toHaveBeenCalledWith({ title: "Kunci", description: "Gantungan biru", status: "found" });
    expect(store.getState().isLostFoundAdded).toBe(true);
  });

  it("gagal menyimpan: modal tetap terbuka", async () => {
    postLostFound.mockResolvedValue({ status: "fail", message: "Data tidak valid" });
    const onClose = vi.fn();
    renderWithProviders(<AddModal onClose={onClose} />);
    await userEvent.type(screen.getByLabelText("Judul"), "A");
    await userEvent.type(screen.getByLabelText("Deskripsi"), "B");
    await userEvent.click(screen.getByRole("button", { name: "Simpan" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Data tidak valid"));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("tombol Batal menutup modal dan tombol dinonaktifkan saat menyimpan", async () => {
    const onClose = vi.fn();
    renderWithProviders(<AddModal onClose={onClose} />, { preloadedState: { isLostFoundAdd: true } });
    expect(screen.getByRole("button", { name: "Menyimpan..." })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });
});
