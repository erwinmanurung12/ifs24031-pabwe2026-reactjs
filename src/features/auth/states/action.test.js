import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api/authApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
}));

import { postLogin, postRegister } from "../api/authApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import {
  ActionType,
  asyncSetIsAuthLogin,
  asyncSetIsAuthRegister,
  asyncSetIsAuthLogout,
  setIsAuthLoginActionCreator,
  setIsAuthRegisterActionCreator,
  setIsAuthLogoutActionCreator,
} from "./action";

describe("auth action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("action creators", () => {
    expect(setIsAuthLoginActionCreator(true)).toEqual({ type: ActionType.SET_IS_AUTH_LOGIN, payload: { status: true } });
    expect(setIsAuthRegisterActionCreator(true)).toEqual({ type: ActionType.SET_IS_AUTH_REGISTER, payload: { status: true } });
    expect(setIsAuthLogoutActionCreator(true)).toEqual({ type: ActionType.SET_IS_AUTH_LOGOUT, payload: { status: true } });
  });

  it("login berhasil menyimpan token", async () => {
    postLogin.mockResolvedValue({ status: "success", data: { token: "tok" } });
    const dispatch = vi.fn();
    expect(await asyncSetIsAuthLogin({ email: "a", password: "b" })(dispatch)).toBe(true);
    expect(localStorage.getItem("accessToken")).toBe("tok");
    expect(dispatch).toHaveBeenCalledWith(setIsAuthLoginActionCreator(true));
  });

  it("login gagal menampilkan dialog error", async () => {
    postLogin.mockResolvedValue({ status: "fail", message: "Salah" });
    const dispatch = vi.fn();
    expect(await asyncSetIsAuthLogin({ email: "a", password: "b" })(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Salah");
    expect(dispatch).not.toHaveBeenCalled();
  });

  it("register berhasil", async () => {
    postRegister.mockResolvedValue({ status: "success" });
    const dispatch = vi.fn();
    expect(await asyncSetIsAuthRegister({ name: "n", email: "e", password: "p" })(dispatch)).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalled();
    expect(dispatch).toHaveBeenNthCalledWith(1, setIsAuthRegisterActionCreator(true));
    expect(dispatch).toHaveBeenNthCalledWith(2, setIsAuthRegisterActionCreator(false));
  });

  it("register gagal", async () => {
    postRegister.mockResolvedValue({ status: "fail", message: "Email dipakai" });
    const dispatch = vi.fn();
    expect(await asyncSetIsAuthRegister({})(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Email dipakai");
  });

  it("logout membersihkan sesi", async () => {
    localStorage.setItem("accessToken", "tok");
    const dispatch = vi.fn();
    await asyncSetIsAuthLogout()(dispatch);
    expect(localStorage.getItem("accessToken")).toBeNull();
    expect(dispatch).toHaveBeenCalledWith(setIsAuthLoginActionCreator(false));
    expect(dispatch).toHaveBeenCalledWith(setIsAuthLogoutActionCreator(true));
    expect(dispatch).toHaveBeenCalledTimes(4);
  });
});
