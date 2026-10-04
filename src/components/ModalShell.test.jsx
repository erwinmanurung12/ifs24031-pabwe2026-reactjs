import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalShell from "./ModalShell";

function setup(onClose = vi.fn()) {
  render(
    <>
      <button>pemicu</button>
      <ModalShell id="m" title="Judul" onClose={onClose}>
        <input aria-label="isi" />
      </ModalShell>
    </>
  );
  return onClose;
}

describe("ModalShell", () => {
  it("merender dialog beraksesibilitas dan fokus ke dialog", () => {
    setup();
    const dialog = screen.getByRole("dialog", { name: "Judul" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveFocus();
  });

  it("menutup lewat tombol tutup dan tombol Escape", async () => {
    const onClose = setup();
    await userEvent.click(screen.getByRole("button", { name: "Tutup dialog" }));
    expect(onClose).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it("menjaga fokus tetap di dalam dialog (focus trap)", () => {
    setup();
    const close = screen.getByRole("button", { name: "Tutup dialog" });
    const input = screen.getByLabelText("isi");

    input.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(input).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();

    // Tab biasa di tengah tidak dicegat
    fireEvent.keyDown(document, { key: "Tab" });
    expect(close).toHaveFocus();

    // Tombol lain diabaikan
    fireEvent.keyDown(document, { key: "a" });
    expect(close).toHaveFocus();

    // Shift+Tab dari dialog container menuju elemen terakhir
    screen.getByRole("dialog").focus();
    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(input).toHaveFocus();
  });

  it("mengembalikan fokus ke elemen sebelumnya saat ditutup", () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();
    const { unmount } = render(
      <ModalShell id="m" title="J" onClose={() => {}}>
        <p>x</p>
      </ModalShell>
    );
    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
