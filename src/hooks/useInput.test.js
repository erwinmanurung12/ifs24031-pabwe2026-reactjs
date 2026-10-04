import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useInput from "./useInput";

describe("useInput", () => {
  it("menyimpan nilai awal dan memperbarui lewat onChange", () => {
    const { result } = renderHook(() => useInput("a"));
    expect(result.current[0]).toBe("a");
    act(() => result.current[1]({ target: { value: "b" } }));
    expect(result.current[0]).toBe("b");
    act(() => result.current[2]("c"));
    expect(result.current[0]).toBe("c");
  });

  it("memakai string kosong sebagai default", () => {
    const { result } = renderHook(() => useInput());
    expect(result.current[0]).toBe("");
  });
});
