import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api/userApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
}));

import * as api from "../api/userApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import * as actions from "./action";

const ok = (data) => ({ status: "success", data });

describe("users action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("action creators memakai type yang benar", () => {
    expect(actions.setUsersActionCreator([]).type).toBe(actions.ActionType.SET_USERS);
    expect(actions.setUserActionCreator({}).type).toBe(actions.ActionType.SET_USER);
    expect(actions.setProfileActionCreator({}).type).toBe(actions.ActionType.SET_PROFILE);
    expect(actions.setIsProfileActionCreator(true).type).toBe(actions.ActionType.SET_IS_PROFILE);
    expect(actions.setIsChangeProfileActionCreator(true).type).toBe(actions.ActionType.SET_IS_CHANGE_PROFILE);
    expect(actions.setIsChangeProfilePhotoActionCreator(true).type).toBe(actions.ActionType.SET_IS_CHANGE_PROFILE_PHOTO);
    expect(actions.setIsChangeProfilePasswordActionCreator(true).type).toBe(actions.ActionType.SET_IS_CHANGE_PROFILE_PASSWORD);
  });

  it("asyncSetUsers berhasil dan gagal", async () => {
    api.fetchUsers.mockResolvedValueOnce(ok({ users: [{ id: 1 }] }));
    const dispatch = vi.fn();
    expect(await actions.asyncSetUsers()(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(actions.setUsersActionCreator([{ id: 1 }]));

    api.fetchUsers.mockResolvedValueOnce({ status: "fail", message: "Gagal" });
    expect(await actions.asyncSetUsers()(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal");
  });

  it("asyncSetProfile berhasil dan gagal", async () => {
    api.fetchProfile.mockResolvedValueOnce(ok({ user: { id: 1 } }));
    const dispatch = vi.fn();
    expect(await actions.asyncSetProfile()(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(actions.setProfileActionCreator({ id: 1 }));
    expect(dispatch).toHaveBeenCalledWith(actions.setIsProfileActionCreator(true));

    api.fetchProfile.mockResolvedValueOnce({ status: "fail" });
    expect(await actions.asyncSetProfile()(dispatch)).toBe(false);
    expect(dispatch).toHaveBeenCalledWith(actions.setProfileActionCreator(null));
  });

  it("mutasi profil memuat ulang profil", async () => {
    api.putProfile.mockResolvedValue({ status: "success" });
    api.postProfilePhoto.mockResolvedValue({ status: "success" });
    const dispatch = vi.fn(async () => true);
    expect(await actions.asyncChangeProfile({ name: "a" })(dispatch)).toBe(true);
    expect(await actions.asyncChangeProfilePhoto(new File([], "a.png"))(dispatch)).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("Profil berhasil diperbarui");
    expect(showSuccessDialog).toHaveBeenCalledWith("Foto profil berhasil diperbarui");
    expect(dispatch).toHaveBeenCalledWith(actions.setIsChangeProfileActionCreator(true));
    expect(dispatch).toHaveBeenCalledWith(actions.setIsChangeProfileActionCreator(false));
  });

  it("ubah kata sandi tidak memuat ulang profil", async () => {
    api.putProfilePassword.mockResolvedValue({ status: "success" });
    const dispatch = vi.fn();
    expect(await actions.asyncChangeProfilePassword({ password: "a", newPassword: "b" })(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledTimes(2);
  });

  it("mutasi gagal menampilkan error", async () => {
    api.putProfile.mockResolvedValue({ status: "fail", message: "Tidak valid", data: { field: ["Email salah"] } });
    const dispatch = vi.fn();
    expect(await actions.asyncChangeProfile({})(dispatch)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Tidak valid: Email salah");
    expect(dispatch).not.toHaveBeenCalled();
  });
});
