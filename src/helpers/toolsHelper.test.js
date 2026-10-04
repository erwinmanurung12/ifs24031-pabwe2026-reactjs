import { describe, it, expect, vi, beforeEach } from "vitest";

const fire = vi.fn();
vi.mock("sweetalert2", () => ({ default: { fire: (...args) => fire(...args) } }));

import {
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  formatDate,
} from "./toolsHelper";

describe("toolsHelper", () => {
  beforeEach(() => fire.mockReset());

  it("menampilkan dialog sukses, error, dan peringatan", async () => {
    fire.mockResolvedValue({});
    await showSuccessDialog("ok");
    await showErrorDialog("err");
    await showWarningDialog("warn");
    expect(fire.mock.calls.map(([arg]) => arg.icon)).toEqual(["success", "error", "warning"]);
    expect(fire.mock.calls[0][0].text).toBe("ok");
  });

  it("mengembalikan hasil konfirmasi", async () => {
    fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirmDialog("yakin?")).toBe(true);
    expect(fire.mock.calls[0][0].confirmButtonText).toBe("Ya");
    fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("yakin?", "Hapus")).toBe(false);
    expect(fire.mock.calls[1][0].confirmButtonText).toBe("Hapus");
  });

  it("memformat tanggal", () => {
    expect(formatDate(null)).toBe("-");
    expect(formatDate("bukan-tanggal")).toBe("-");
    expect(formatDate("2024-02-28T07:49:32.000000Z")).toMatch(/2024/);
  });
});
