import {
  fetchUsers,
  fetchProfile,
  putProfile,
  postProfilePhoto,
  putProfilePassword,
} from "../api/userApi";
import { getResponseMessage } from "../../../helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export const ActionType = {
  SET_USERS: "users/SET_USERS",
  SET_USER: "users/SET_USER",
  SET_PROFILE: "users/SET_PROFILE",
  SET_IS_PROFILE: "users/SET_IS_PROFILE",
  SET_IS_CHANGE_PROFILE: "users/SET_IS_CHANGE_PROFILE",
  SET_IS_CHANGE_PROFILE_PHOTO: "users/SET_IS_CHANGE_PROFILE_PHOTO",
  SET_IS_CHANGE_PROFILE_PASSWORD: "users/SET_IS_CHANGE_PROFILE_PASSWORD",
};

export const setUsersActionCreator = (users) => ({ type: ActionType.SET_USERS, payload: { users } });
export const setUserActionCreator = (user) => ({ type: ActionType.SET_USER, payload: { user } });
export const setProfileActionCreator = (profile) => ({ type: ActionType.SET_PROFILE, payload: { profile } });
export const setIsProfileActionCreator = (status) => ({ type: ActionType.SET_IS_PROFILE, payload: { status } });
export const setIsChangeProfileActionCreator = (status) => ({ type: ActionType.SET_IS_CHANGE_PROFILE, payload: { status } });
export const setIsChangeProfilePhotoActionCreator = (status) => ({ type: ActionType.SET_IS_CHANGE_PROFILE_PHOTO, payload: { status } });
export const setIsChangeProfilePasswordActionCreator = (status) => ({ type: ActionType.SET_IS_CHANGE_PROFILE_PASSWORD, payload: { status } });

export function asyncSetUsers() {
  return async (dispatch) => {
    const response = await fetchUsers();
    if (response.status !== "success") {
      await showErrorDialog(getResponseMessage(response));
      return false;
    }
    dispatch(setUsersActionCreator(response.data.users));
    return true;
  };
}

// Mengembalikan false jika token tidak valid (layout yang memutuskan logout).
export function asyncSetProfile() {
  return async (dispatch) => {
    const response = await fetchProfile();
    const success = response.status === "success";
    dispatch(setProfileActionCreator(success ? response.data.user : null));
    dispatch(setIsProfileActionCreator(true));
    return success;
  };
}

function createMutation(call, flagCreator, successMessage, reloadProfile = false) {
  return (payload) => async (dispatch) => {
    const response = await call(payload);
    if (response.status !== "success") {
      await showErrorDialog(getResponseMessage(response));
      return false;
    }
    dispatch(flagCreator(true));
    if (reloadProfile) await dispatch(asyncSetProfile());
    await showSuccessDialog(successMessage);
    dispatch(flagCreator(false));
    return true;
  };
}

export const asyncChangeProfile = createMutation(
  putProfile, setIsChangeProfileActionCreator, "Profil berhasil diperbarui", true
);
export const asyncChangeProfilePhoto = createMutation(
  postProfilePhoto, setIsChangeProfilePhotoActionCreator, "Foto profil berhasil diperbarui", true
);
export const asyncChangeProfilePassword = createMutation(
  putProfilePassword, setIsChangeProfilePasswordActionCreator, "Kata sandi berhasil diperbarui"
);
