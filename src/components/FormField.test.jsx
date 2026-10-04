import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FormField from "./FormField";

describe("FormField", () => {
  it("menampilkan label dan input terhubung", () => {
    render(<FormField id="x" label="Nama" defaultValue="a" />);
    expect(screen.getByLabelText("Nama")).toHaveValue("a");
    expect(screen.getByLabelText("Nama")).not.toHaveAttribute("aria-invalid");
    expect(screen.getByLabelText("Nama")).not.toHaveAttribute("aria-describedby");
  });

  it("menampilkan error dan hint dengan aria", () => {
    render(<FormField id="x" label="Nama" error="Wajib" hint="Petunjuk" />);
    const input = screen.getByLabelText("Nama");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "x-error x-hint");
    expect(screen.getByRole("alert")).toHaveTextContent("Wajib");
    expect(screen.getByText("Petunjuk")).toBeInTheDocument();
  });

  it("mendukung elemen select dengan children", () => {
    render(
      <FormField id="s" as="select" label="Pilih">
        <option>A</option>
      </FormField>
    );
    expect(screen.getByRole("combobox", { name: "Pilih" })).toBeInTheDocument();
  });
});
