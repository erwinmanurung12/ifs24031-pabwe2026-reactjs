import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import axe from "axe-core";

vi.mock("./features/users/api/userApi");
vi.mock("./features/lost-founds/api/lostFoundApi");
vi.mock("./helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
  showConfirmDialog: vi.fn(),
  formatDate: () => "28 Februari 2024",
}));

import * as userApi from "./features/users/api/userApi";
import * as lfApi from "./features/lost-founds/api/lostFoundApi";
import App from "./App";
import { renderWithProviders } from "./test-utils";

// color-contrast tidak dapat dihitung di jsdom (tidak ada layout), diverifikasi manual lewat palet warna.
async function audit(container) {
  const { violations } = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
  return violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`);
}

const item = {
  id: 1, user_id: 1, title: "Dompet", description: "Cokelat", status: "lost", is_completed: 0, cover: null,
  created_at: "2024-02-28T07:49:32.000000Z", author: { name: "Ani", photo: null },
};

describe("aksesibilitas (axe-core)", () => {
  beforeEach(() => {
    userApi.fetchProfile.mockResolvedValue({ status: "success", data: { user: { id: 1, name: "Ani", email: "a@b.c", photo: null } } });
    userApi.fetchUsers.mockResolvedValue({ status: "success", data: { users: [{ id: 1, name: "Ani", email: "a@b.c", photo: null }] } });
    lfApi.fetchLostFounds.mockResolvedValue({ status: "success", data: { lost_founds: [item] } });
    lfApi.fetchLostFound.mockResolvedValue({ status: "success", data: { lost_found: item } });
    lfApi.fetchLostFoundStatsDaily.mockResolvedValue({
      status: "success",
      data: { stats_losts: { "01-10-2024": 1 }, stats_founds: { "01-10-2024": 0 } },
    });
  });

  it("halaman login tanpa pelanggaran", async () => {
    const { container } = renderWithProviders(<App />, { route: "/auth/login" });
    await screen.findByRole("heading", { name: "Masuk ke akun Anda" });
    expect(await audit(container)).toEqual([]);
  });

  it("halaman register tanpa pelanggaran", async () => {
    const { container } = renderWithProviders(<App />, { route: "/auth/register" });
    await screen.findByRole("heading", { name: "Buat akun baru" });
    expect(await audit(container)).toEqual([]);
  });

  it.each([
    ["/", "Dompet"],
    ["/lost-founds/1", "Kembali ke beranda"],
    ["/users", "Ani"],
    ["/profile", "Foto profil"],
  ])("halaman dashboard %s tanpa pelanggaran", async (route, text) => {
    const { container } = renderWithProviders(<App />, { route, preloadedState: { isAuthLogin: true } });
    await screen.findAllByText(new RegExp(text));
    expect(await audit(container)).toEqual([]);
  });
});
