import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Avatar from "./Avatar";

describe("Avatar", () => {
  it("menampilkan inisial bila tidak ada foto", () => {
    render(<Avatar name="  budi" />);
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("menampilkan tanda tanya bila nama kosong", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("menampilkan foto dan fallback ke inisial saat gagal dimuat", () => {
    const { container } = render(<Avatar name="Ani" photo="img/a.png" />);
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "https://open-api.delcom.org/img/a.png");
    fireEvent.error(img);
    expect(container.querySelector("img")).toBeNull();
    expect(screen.getByText("A")).toBeInTheDocument();
  });
});
