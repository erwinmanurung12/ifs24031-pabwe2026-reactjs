import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";

vi.mock("../api/authApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
}));

import { postRegister } from "../api/authApi";
import RegisterPage from "./RegisterPage";
import { renderWithProviders } from "../../../test-utils";

function ui() {
  return (
    <Routes>
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/login" element={<p>Halaman login</p>} />
    </Routes>
  );
}

describe("RegisterPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("memvalidasi input", async () => {
    renderWithProviders(ui(), { route: "/auth/register" });
    expect(document.title).toBe("Daftar | Lost & Founds");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "123");
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    expect(screen.getByText("Nama wajib diisi")).toBeInTheDocument();
    expect(screen.getByText("Email wajib diisi")).toBeInTheDocument();
    expect(screen.getByText("Kata sandi minimal 6 karakter")).toBeInTheDocument();
    expect(postRegister).not.toHaveBeenCalled();
  });

  it("registrasi berhasil mengarahkan ke login", async () => {
    postRegister.mockResolvedValue({ status: "success" });
    renderWithProviders(ui(), { route: "/auth/register" });
    await userEvent.type(screen.getByLabelText("Nama lengkap"), " Budi ");
    await userEvent.type(screen.getByLabelText("Email"), "b@b.c");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "123456");
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    expect(await screen.findByText("Halaman login")).toBeInTheDocument();
    expect(postRegister).toHaveBeenCalledWith({ name: "Budi", email: "b@b.c", password: "123456" });
  });

  it("registrasi gagal tetap di halaman", async () => {
    postRegister.mockResolvedValue({ status: "fail", message: "Email dipakai" });
    renderWithProviders(ui(), { route: "/auth/register" });
    await userEvent.type(screen.getByLabelText("Nama lengkap"), "Budi");
    await userEvent.type(screen.getByLabelText("Email"), "b@b.c");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "123456");
    await userEvent.click(screen.getByRole("button", { name: "Daftar" }));
    await waitFor(() => expect(postRegister).toHaveBeenCalled());
    await waitFor(() => expect(screen.getByRole("button", { name: "Daftar" })).toBeEnabled());
    expect(screen.queryByText("Halaman login")).not.toBeInTheDocument();
  });
});
