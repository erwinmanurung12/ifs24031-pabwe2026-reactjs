import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Spinner from "./Spinner";

describe("Spinner", () => {
  it("menampilkan label default dan kustom", () => {
    const { rerender } = render(<Spinner />);
    expect(screen.getByRole("status")).toHaveTextContent("Memuat...");
    rerender(<Spinner label="Tunggu" />);
    expect(screen.getByRole("status")).toHaveTextContent("Tunggu");
  });
});
