import { describe, it, expect } from "vitest";
import store, { createStore, reducer } from "./store";

describe("store", () => {
  it("menggabungkan seluruh reducer fitur", () => {
    const keys = Object.keys(createStore().getState());
    expect(keys.sort()).toEqual(Object.keys(reducer).sort());
  });

  it("menyediakan store default dengan state awal", () => {
    const state = store.getState();
    expect(state.isAuthLogin).toBe(false);
    expect(state.lostFounds).toEqual([]);
    expect(state.profile).toBeNull();
  });

  it("menerima preloadedState", () => {
    expect(createStore({ isAuthLogin: true }).getState().isAuthLogin).toBe(true);
  });
});
