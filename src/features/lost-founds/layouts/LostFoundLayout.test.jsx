import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Routes, Route } from "react-router-dom";

vi.mock("../../users/api/userApi");

import { fetchProfile } from "../../users/api/userApi";
import LostFoundLayout from "./LostFoundLayout";
import { renderWithProviders } from "../../../test-utils";

function ui() {
  return (
    <Routes>
      <Route path="/auth/login" element={<p>Halaman login</p>} />
      <Route path="/" element={<LostFoundLayout />}>
        <Route index element={<p>Konten beranda</p>} />
      </Route>
    </Routes>
  );
}

describe("LostFoundLayout", () => {
  beforeEach(() => vi.clearAllMocks());

  it("mengalihkan tamu ke login tanpa memanggil API", () => {
    renderWithProviders(ui());
    expect(screen.getByText("Halaman login")).toBeInTheDocument();
    expect(fetchProfile).not.toHaveBeenCalled();
  });

  it("memuat profil lalu menampilkan layout, dan drawer dapat dibuka", async () => {
    fetchProfile.mockResolvedValue({ status: "success", data: { user: { id: 1, name: "Budi", photo: null } } });
    renderWithProviders(ui(), { preloadedState: { isAuthLogin: true } });
    expect(screen.getByRole("status")).toHaveTextContent("Memuat sesi...");
    expect(await screen.findByText("Konten beranda")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();

    const toggle = screen.getByRole("button", { name: "Buka menu navigasi" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(screen.getByRole("link", { name: "Pengguna" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  it("token tidak valid memaksa logout", async () => {
    localStorage.setItem("accessToken", "kedaluwarsa");
    fetchProfile.mockResolvedValue({ status: "fail", message: "Unauthenticated." });
    const { store } = renderWithProviders(ui(), { preloadedState: { isAuthLogin: true } });
    expect(await screen.findByText("Halaman login")).toBeInTheDocument();
    await waitFor(() => expect(store.getState().isAuthLogin).toBe(false));
    expect(localStorage.getItem("accessToken")).toBeNull();
  });
});
