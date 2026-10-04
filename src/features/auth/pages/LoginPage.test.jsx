import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/authApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
}));

import { postLogin } from "../api/authApi";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import LoginPage from "./LoginPage";
import { renderWithProviders } from "../../../test-utils";

describe("LoginPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan form dan mengatur title", () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Masuk ke akun Anda" })).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(document.title).toBe("Masuk | Lost & Founds");
    expect(screen.getByRole("link", { name: "Daftar sekarang" })).toHaveAttribute("href", "/auth/register");
  });

  it("memvalidasi field kosong", async () => {
    renderWithProviders(<LoginPage />);
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    expect(screen.getByText("Email wajib diisi")).toBeInTheDocument();
    expect(screen.getByText("Kata sandi wajib diisi")).toBeInTheDocument();
    expect(postLogin).not.toHaveBeenCalled();
  });

  it("mengubah visibilitas kata sandi lewat checkbox", async () => {
    renderWithProviders(<LoginPage />);
    const password = screen.getByLabelText("Kata sandi");
    expect(password).toHaveAttribute("type", "password");
    const toggle = screen.getByLabelText("Tampilkan kata sandi");
    await userEvent.click(toggle);
    expect(password).toHaveAttribute("type", "text");
    await userEvent.click(toggle);
    expect(password).toHaveAttribute("type", "password");
  });

  it("tombol submit adalah satu-satunya tombol di dalam form", () => {
    const { container } = renderWithProviders(<LoginPage />);
    const buttons = container.querySelectorAll("form button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveAttribute("type", "submit");
    expect(container.querySelector("input[name='email']")).toBeInTheDocument();
    expect(container.querySelector("input[name='password']")).toBeInTheDocument();
  });

  it("login berhasil memperbarui state", async () => {
    postLogin.mockResolvedValue({ status: "success", data: { token: "tok" } });
    const { store } = renderWithProviders(<LoginPage />);
    await userEvent.type(screen.getByLabelText("Email"), " a@b.c ");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "rahasia");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(store.getState().isAuthLogin).toBe(true));
    expect(postLogin).toHaveBeenCalledWith({ email: "a@b.c", password: "rahasia" });
  });

  it("login gagal menampilkan dialog error", async () => {
    postLogin.mockResolvedValue({ status: "fail", message: "Email atau sandi salah" });
    renderWithProviders(<LoginPage />);
    await userEvent.type(screen.getByLabelText("Email"), "a@b.c");
    await userEvent.type(screen.getByLabelText("Kata sandi"), "salah");
    await userEvent.click(screen.getByRole("button", { name: "Masuk" }));
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith("Email atau sandi salah"));
    expect(screen.getByRole("button", { name: "Masuk" })).toBeEnabled();
  });
});
