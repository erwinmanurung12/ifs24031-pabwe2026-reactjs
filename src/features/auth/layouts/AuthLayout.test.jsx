import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { renderWithProviders } from "../../../test-utils";

function ui() {
  return (
    <Routes>
      <Route path="/" element={<p>Beranda</p>} />
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<p>Isi login</p>} />
      </Route>
    </Routes>
  );
}

describe("AuthLayout", () => {
  it("menampilkan banner dan konten anak untuk tamu", () => {
    renderWithProviders(ui(), { route: "/auth/login" });
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Isi login")).toBeInTheDocument();
    expect(screen.getByText(/Laporkan barang hilang/)).toBeInTheDocument();
  });

  it("mengalihkan pengguna yang sudah login ke beranda", () => {
    renderWithProviders(ui(), { route: "/auth/login", preloadedState: { isAuthLogin: true } });
    expect(screen.getByText("Beranda")).toBeInTheDocument();
  });
});
