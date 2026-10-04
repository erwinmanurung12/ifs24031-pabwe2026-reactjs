import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import useDocumentTitle from "./useDocumentTitle";

describe("useDocumentTitle", () => {
  it("mengatur title dokumen", () => {
    renderHook(() => useDocumentTitle("Masuk"));
    expect(document.title).toBe("Masuk | Lost & Founds");
  });
});
