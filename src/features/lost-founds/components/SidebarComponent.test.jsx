import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SidebarComponent from "./SidebarComponent";
import { renderWithProviders } from "../../../test-utils";

describe("SidebarComponent", () => {
  it("menampilkan menu utama dengan tautan aktif", () => {
    renderWithProviders(<SidebarComponent open={false} onClose={() => {}} />, { route: "/users" });
    expect(screen.getByRole("navigation", { name: "Menu utama" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Pengguna" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Beranda" })).not.toHaveAttribute("aria-current");
  });

  it("memanggil onClose saat menu atau overlay diklik di mode drawer", async () => {
    const onClose = vi.fn();
    const { container } = renderWithProviders(<SidebarComponent open onClose={onClose} />);
    await userEvent.click(screen.getByRole("link", { name: "Profil Saya" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    await userEvent.click(container.querySelector("[aria-hidden='true'].fixed"));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("tanpa overlay ketika tertutup", () => {
    const { container } = renderWithProviders(<SidebarComponent open={false} onClose={() => {}} />);
    expect(container.querySelector(".bg-slate-900\\/50")).toBeNull();
  });
});
