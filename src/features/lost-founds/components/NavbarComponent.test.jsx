import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NavbarComponent from "./NavbarComponent";
import { renderWithProviders } from "../../../test-utils";

const state = { isAuthLogin: true, profile: { id: 1, name: "Budi", photo: null } };

describe("NavbarComponent", () => {
  it("menampilkan logo, profil, dan memicu toggle sidebar", async () => {
    const onToggle = vi.fn();
    renderWithProviders(<NavbarComponent onToggleSidebar={onToggle} sidebarOpen={false} />, { preloadedState: state });
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Budi")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Buka menu navigasi" }));
    expect(onToggle).toHaveBeenCalled();
  });

  it("logout mengosongkan sesi", async () => {
    localStorage.setItem("accessToken", "t");
    const { store } = renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} sidebarOpen />, { preloadedState: state });
    await userEvent.click(screen.getByRole("button", { name: /Keluar/ }));
    expect(store.getState().isAuthLogin).toBe(false);
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("tetap tampil saat profil belum ada", () => {
    renderWithProviders(<NavbarComponent onToggleSidebar={() => {}} sidebarOpen={false} />);
    expect(screen.getByRole("link", { name: /Profil saya/ })).toBeInTheDocument();
  });
});
