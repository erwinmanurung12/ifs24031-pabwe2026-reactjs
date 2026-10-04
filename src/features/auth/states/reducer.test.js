import { describe, it, expect } from "vitest";
import { isAuthLoginReducer, isAuthRegisterReducer, isAuthLogoutReducer } from "./reducer";
import {
  setIsAuthLoginActionCreator,
  setIsAuthRegisterActionCreator,
  setIsAuthLogoutActionCreator,
} from "./action";

describe("auth reducers", () => {
  it("isAuthLogin: default dari token dan update", () => {
    expect(isAuthLoginReducer(undefined)).toBe(false);
    localStorage.setItem("accessToken", "t");
    expect(isAuthLoginReducer(undefined, {})).toBe(true);
    expect(isAuthLoginReducer(true, setIsAuthLoginActionCreator(false))).toBe(false);
    expect(isAuthLoginReducer(true, { type: "x" })).toBe(true);
  });

  it("isAuthRegister", () => {
    expect(isAuthRegisterReducer(undefined)).toBe(false);
    expect(isAuthRegisterReducer(false, setIsAuthRegisterActionCreator(true))).toBe(true);
    expect(isAuthRegisterReducer(true, { type: "x" })).toBe(true);
  });

  it("isAuthLogout: set, reset saat login, dan abaikan lainnya", () => {
    expect(isAuthLogoutReducer(undefined)).toBe(false);
    expect(isAuthLogoutReducer(false, setIsAuthLogoutActionCreator(true))).toBe(true);
    expect(isAuthLogoutReducer(true, setIsAuthLoginActionCreator(true))).toBe(false);
    expect(isAuthLogoutReducer(true, setIsAuthLoginActionCreator(false))).toBe(true);
    expect(isAuthLogoutReducer(true, { type: "x" })).toBe(true);
  });
});
