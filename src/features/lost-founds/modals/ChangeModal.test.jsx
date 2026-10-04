import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/lostFoundApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
}));

import { putLostFound } from "../api/lostFoundApi";
import ChangeModal from "./ChangeModal";
import { renderWithProviders } from "../../../test-utils";

const item = { id: 5, title: "Dompet", description: "Cokelat", status: "lost", is_completed: 0 };

describe("ChangeModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan nilai awal dan memvalidasi", async () => {
    renderWithProviders(<ChangeModal lostFound={item} onClose={() => {}} />);
    expect(screen.getByLabelText("Judul")).toHaveValue("Dompet");
    expect(screen.getByLabelText("Tandai laporan sudah selesai")).not.toBeChecked();
    await userEvent.clear(screen.getByLabelText("Judul"));
    await userEvent.clear(screen.getByLabelText("Deskripsi"));
    await userEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
    expect(screen.getByText("Judul wajib diisi")).toBeInTheDocument();
    expect(screen.getByText("Deskripsi wajib diisi")).toBeInTheDocument();
    expect(putLostFound).not.toHaveBeenCalled();
  });

  it("menyimpan perubahan termasuk status selesai", async () => {
    putLostFound.mockResolvedValue({ status: "success" });
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal lostFound={item} onClose={onClose} />);
    await userEvent.selectOptions(screen.getByLabelText("Jenis laporan"), "found");
    await userEvent.type(screen.getByLabelText("Judul"), " baru");
    await userEvent.click(screen.getByLabelText("Tandai laporan sudah selesai"));
    await userEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(putLostFound).toHaveBeenCalledWith({ id: 5, title: "Dompet baru", description: "Cokelat", status: "found", isCompleted: true });
  });

  it("menandai selesai dari data awal dan tetap terbuka saat gagal", async () => {
    putLostFound.mockResolvedValue({ status: "fail", message: "Gagal" });
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal lostFound={{ ...item, is_completed: 1 }} onClose={onClose} />);
    expect(screen.getByLabelText("Tandai laporan sudah selesai")).toBeChecked();
    await userEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
    await waitFor(() => expect(putLostFound).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
  });

  it("tombol Batal dan status menyimpan", async () => {
    const onClose = vi.fn();
    renderWithProviders(<ChangeModal lostFound={item} onClose={onClose} />, { preloadedState: { isLostFoundChange: true } });
    expect(screen.getByRole("button", { name: "Menyimpan..." })).toBeDisabled();
    await userEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });
});
