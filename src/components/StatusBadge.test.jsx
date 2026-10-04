import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "./StatusBadge";

describe("StatusBadge", () => {
  it("menampilkan hilang", () => {
    render(<StatusBadge status="lost" />);
    expect(screen.getByText("Hilang")).toBeInTheDocument();
    expect(screen.queryByText("Selesai")).not.toBeInTheDocument();
  });

  it("menampilkan ditemukan dan selesai", () => {
    render(<StatusBadge status="found" isCompleted />);
    expect(screen.getByText("Ditemukan")).toBeInTheDocument();
    expect(screen.getByText("Selesai")).toBeInTheDocument();
  });
});
