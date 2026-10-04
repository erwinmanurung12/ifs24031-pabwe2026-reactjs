import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/lostFoundApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
}));

import { postLostFoundCover } from "../api/lostFoundApi";
import ChangeCoverModal from "./ChangeCoverModal";
import { renderWithProviders } from "../../../test-utils";

const image = () => new File(["x"], "a.png", { type: "image/png" });

describe("ChangeCoverModal", () => {
  beforeEach(() => vi.clearAllMocks());

  it("meminta gambar bila belum dipilih", async () => {
    renderWithProviders(<ChangeCoverModal lostFoundId={1} onClose={() => {}} />);
    await userEvent.click(screen.getByRole("button", { name: "Unggah cover" }));
    expect(screen.getByText("Pilih gambar terlebih dahulu")).toBeInTheDocument();
    expect(postLostFoundCover).not.toHaveBeenCalled();
  });

  it("menolak berkas non-gambar dan membersihkan pilihan", () => {
    renderWithProviders(<ChangeCoverModal lostFoundId={1} onClose={() => {}} />);
    const input = screen.getByLabelText("Pilih gambar");
    fireEvent.change(input, { target: { files: [new File(["x"], "a.txt", { type: "text/plain" })] } });
    expect(screen.getByText("Berkas harus berupa gambar")).toBeInTheDocument();
    expect(screen.queryByAltText("Pratinjau cover baru")).not.toBeInTheDocument();
  });

  it("menampilkan pratinjau, lalu mengosongkannya bila pilihan dibatalkan", async () => {
    renderWithProviders(<ChangeCoverModal lostFoundId={1} onClose={() => {}} />);
    const input = screen.getByLabelText("Pilih gambar");
    fireEvent.change(input, { target: { files: [image()] } });
    expect(await screen.findByAltText("Pratinjau cover baru")).toBeInTheDocument();
    fireEvent.change(input, { target: { files: [] } });
    await waitFor(() => expect(screen.queryByAltText("Pratinjau cover baru")).not.toBeInTheDocument());
  });

  it("mengunggah cover dan menutup modal", async () => {
    postLostFoundCover.mockResolvedValue({ status: "success" });
    const onClose = vi.fn();
    const file = image();
    renderWithProviders(<ChangeCoverModal lostFoundId={9} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText("Pilih gambar"), { target: { files: [file] } });
    await userEvent.click(screen.getByRole("button", { name: "Unggah cover" }));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(postLostFoundCover).toHaveBeenCalledWith({ id: 9, file });
  });

  it("gagal unggah: modal tetap terbuka; tombol Batal dan status unggah", async () => {
    postLostFoundCover.mockResolvedValue({ status: "fail", message: "Gagal" });
    const onClose = vi.fn();
    renderWithProviders(<ChangeCoverModal lostFoundId={9} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText("Pilih gambar"), { target: { files: [image()] } });
    await userEvent.click(screen.getByRole("button", { name: "Unggah cover" }));
    await waitFor(() => expect(postLostFoundCover).toHaveBeenCalled());
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Batal" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("menonaktifkan tombol saat mengunggah", () => {
    renderWithProviders(<ChangeCoverModal lostFoundId={1} onClose={() => {}} />, { preloadedState: { isLostFoundChangeCover: true } });
    expect(screen.getByRole("button", { name: "Mengunggah..." })).toBeDisabled();
  });
});
