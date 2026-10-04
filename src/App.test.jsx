import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";

vi.mock("./features/users/api/userApi");
vi.mock("./features/lost-founds/api/lostFoundApi");
vi.mock("./helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
  showConfirmDialog: vi.fn(),
  formatDate: () => "-",
}));

import * as userApi from "./features/users/api/userApi";
import * as lfApi from "./features/lost-founds/api/lostFoundApi";
import App from "./App";
import { renderWithProviders } from "./test-utils";

describe("App routing", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    userApi.fetchProfile.mockResolvedValue({ status: "success", data: { user: { id: 1, name: "Budi", email: "b@b.c", photo: null } } });
    userApi.fetchUsers.mockResolvedValue({ status: "success", data: { users: [] } });
    lfApi.fetchLostFounds.mockResolvedValue({ status: "success", data: { lost_founds: [] } });
    lfApi.fetchLostFoundStatsDaily.mockResolvedValue({ status: "fail" });
    lfApi.fetchLostFound.mockResolvedValue({ status: "fail", message: "x" });
  });

  it("tamu diarahkan ke halaman login", async () => {
    renderWithProviders(<App />, { route: "/" });
    expect(await screen.findByRole("heading", { name: "Masuk ke akun Anda" })).toBeInTheDocument();
  });

  it("/auth diarahkan ke login dan /auth/register tersedia", async () => {
    renderWithProviders(<App />, { route: "/auth" });
    expect(await screen.findByRole("heading", { name: "Masuk ke akun Anda" })).toBeInTheDocument();
  });

  it("halaman register dimuat lazy", async () => {
    renderWithProviders(<App />, { route: "/auth/register" });
    expect(await screen.findByRole("heading", { name: "Buat akun baru" })).toBeInTheDocument();
  });

  it("rute tak dikenal kembali ke beranda/login", async () => {
    renderWithProviders(<App />, { route: "/tidak-ada" });
    expect(await screen.findByRole("heading", { name: "Masuk ke akun Anda" })).toBeInTheDocument();
  });

  it.each([
    ["/", "Laporan barang"],
    ["/users", "Daftar pengguna"],
    ["/profile", "Informasi akun"],
    ["/lost-founds/3", "Laporan tidak ditemukan."],
  ])("pengguna login membuka %s", async (route, text) => {
    renderWithProviders(<App />, { route, preloadedState: { isAuthLogin: true } });
    expect(await screen.findByText(text)).toBeInTheDocument();
  });

  it("pengguna login diarahkan keluar dari halaman auth", async () => {
    renderWithProviders(<App />, { route: "/auth/login", preloadedState: { isAuthLogin: true } });
    expect(await screen.findByText("Laporan barang")).toBeInTheDocument();
  });
});
