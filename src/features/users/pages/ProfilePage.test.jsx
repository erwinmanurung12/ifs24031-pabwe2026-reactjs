import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/userApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
}));

import * as api from "../api/userApi";
import ProfilePage from "./ProfilePage";
import { renderWithProviders } from "../../../test-utils";

const profile = { id: 1, name: "Budi", email: "budi@mail.com", photo: null };
const render = (state = {}) => renderWithProviders(<ProfilePage />, { preloadedState: { profile, ...state } });

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchProfile.mockResolvedValue({ status: "success", data: { user: profile } });
  });

  it("menampilkan nilai awal profil", () => {
    render();
    expect(document.title).toBe("Profil Saya | Lost & Founds");
    expect(screen.getByLabelText("Nama lengkap")).toHaveValue("Budi");
    expect(screen.getByLabelText("Email")).toHaveValue("budi@mail.com");
  });

  it("memvalidasi dan menyimpan informasi akun", async () => {
    api.putProfile.mockResolvedValue({ status: "success" });
    render();
    await userEvent.clear(screen.getByLabelText("Nama lengkap"));
    await userEvent.clear(screen.getByLabelText("Email"));
    await userEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
    expect(screen.getByText("Nama wajib diisi")).toBeInTheDocument();
    expect(screen.getByText("Email wajib diisi")).toBeInTheDocument();
    expect(api.putProfile).not.toHaveBeenCalled();

    await userEvent.type(screen.getByLabelText("Nama lengkap"), " Budi Baru ");
    await userEvent.type(screen.getByLabelText("Email"), "baru@mail.com");
    await userEvent.click(screen.getByRole("button", { name: "Simpan perubahan" }));
    await waitFor(() => expect(api.putProfile).toHaveBeenCalledWith({ name: "Budi Baru", email: "baru@mail.com" }));
  });

  it("memvalidasi dan mengunggah foto", async () => {
    api.postProfilePhoto.mockResolvedValue({ status: "success" });
    render();
    await userEvent.click(screen.getByRole("button", { name: "Unggah foto" }));
    expect(screen.getByText("Pilih foto terlebih dahulu")).toBeInTheDocument();

    const file = new File(["x"], "a.png", { type: "image/png" });
    fireEvent.change(screen.getByLabelText("Pilih foto"), { target: { files: [file] } });
    expect(screen.queryByText("Pilih foto terlebih dahulu")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Unggah foto" }));
    await waitFor(() => expect(api.postProfilePhoto).toHaveBeenCalledWith(file));

    fireEvent.change(screen.getByLabelText("Pilih foto"), { target: { files: [] } });
    await userEvent.click(screen.getByRole("button", { name: "Unggah foto" }));
    expect(screen.getByText("Pilih foto terlebih dahulu")).toBeInTheDocument();
  });

  it("memvalidasi dan mengganti kata sandi, lalu mengosongkan form", async () => {
    api.putProfilePassword.mockResolvedValue({ status: "success" });
    render();
    await userEvent.type(screen.getByLabelText("Kata sandi baru"), "123");
    await userEvent.click(screen.getByRole("button", { name: "Ubah kata sandi" }));
    expect(screen.getByText("Kata sandi saat ini wajib diisi")).toBeInTheDocument();
    expect(screen.getByText("Kata sandi baru minimal 6 karakter")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText("Kata sandi saat ini"), "lama123");
    await userEvent.type(screen.getByLabelText("Kata sandi baru"), "456");
    await userEvent.click(screen.getByRole("button", { name: "Ubah kata sandi" }));
    await waitFor(() => expect(api.putProfilePassword).toHaveBeenCalledWith({ password: "lama123", newPassword: "123456" }));
    await waitFor(() => expect(screen.getByLabelText("Kata sandi baru")).toHaveValue(""));
  });

  it("gagal mengganti kata sandi: form tidak dikosongkan", async () => {
    api.putProfilePassword.mockResolvedValue({ status: "fail", message: "Salah" });
    render();
    await userEvent.type(screen.getByLabelText("Kata sandi saat ini"), "lama123");
    await userEvent.type(screen.getByLabelText("Kata sandi baru"), "baru123");
    await userEvent.click(screen.getByRole("button", { name: "Ubah kata sandi" }));
    await waitFor(() => expect(api.putProfilePassword).toHaveBeenCalled());
    expect(screen.getByLabelText("Kata sandi baru")).toHaveValue("baru123");
  });

  it("menonaktifkan tombol saat proses berjalan", () => {
    render({ isChangeProfile: true, isChangeProfilePhoto: true, isChangeProfilePassword: true });
    expect(screen.getByRole("button", { name: "Simpan perubahan" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Unggah foto" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Ubah kata sandi" })).toBeDisabled();
  });
});
