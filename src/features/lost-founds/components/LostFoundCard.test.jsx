import { describe, it, expect } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import LostFoundCard from "./LostFoundCard";
import { renderWithProviders } from "../../../test-utils";

const base = {
  id: 7,
  title: "Dompet",
  description: "Warna cokelat",
  status: "lost",
  is_completed: 0,
  cover: "img/a.png",
  created_at: "2024-02-28T07:49:32.000000Z",
  author: { name: "Ani", photo: null },
};

describe("LostFoundCard", () => {
  it("menampilkan data dan tautan detail", () => {
    renderWithProviders(<LostFoundCard item={base} />);
    expect(screen.getByRole("link", { name: "Dompet" })).toHaveAttribute("href", "/lost-founds/7");
    expect(screen.getByAltText("Foto Dompet")).toBeInTheDocument();
    expect(screen.getByText(/Ani/)).toBeInTheDocument();
    expect(screen.queryByText("Selesai")).not.toBeInTheDocument();
  });

  it("memakai placeholder bila cover kosong atau gagal dimuat", () => {
    const { rerender } = renderWithProviders(<LostFoundCard item={{ ...base, cover: null, is_completed: 1 }} />);
    expect(screen.getByText("Tidak ada foto")).toBeInTheDocument();
    expect(screen.getByText("Selesai")).toBeInTheDocument();

    rerender(<LostFoundCard item={base} />);
    fireEvent.error(screen.getByAltText("Foto Dompet"));
    expect(screen.getByText("Tidak ada foto")).toBeInTheDocument();
  });
});
