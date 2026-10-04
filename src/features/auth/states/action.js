import { postLogin, postRegister } from "../api/authApi";
import { putAccessToken, removeAccessToken, getResponseMessage } from "../../../helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import { setProfileActionCreator, setIsProfileActionCreator } from "../../users/states/action";

export const ActionType = {
  SET_IS_AUTH_LOGIN: "auth/SET_IS_AUTH_LOGIN",
  SET_IS_AUTH_REGISTER: "auth/SET_IS_AUTH_REGISTER",
  SET_IS_AUTH_LOGOUT: "auth/SET_IS_AUTH_LOGOUT",
};

export const setIsAuthLoginActionCreator = (status) => ({ type: ActionType.SET_IS_AUTH_LOGIN, payload: { status } });
export const setIsAuthRegisterActionCreator = (status) => ({ type: ActionType.SET_IS_AUTH_REGISTER, payload: { status } });
export const setIsAuthLogoutActionCreator = (status) => ({ type: ActionType.SET_IS_AUTH_LOGOUT, payload: { status } });

export function asyncSetIsAuthLogin({ email, password }) {
  return async (dispatch) => {
    const response = await postLogin({ email, password });
    if (response.status !== "success") {
      await showErrorDialog(getResponseMessage(response));
      return false;
    }
    putAccessToken(response.data.token);
    dispatch(setIsAuthLoginActionCreator(true));
    return true;
  };
}

export function asyncSetIsAuthRegister({ name, email, password }) {
  return async (dispatch) => {
    const response = await postRegister({ name, email, password });
    if (response.status !== "success") {
      await showErrorDialog(getResponseMessage(response));
      return false;
    }
    dispatch(setIsAuthRegisterActionCreator(true));
    await showSuccessDialog("Akun berhasil dibuat. Silakan masuk.");
    dispatch(setIsAuthRegisterActionCreator(false));
    return true;
  };
}

export function asyncSetIsAuthLogout() {
  return async (dispatch) => {
    removeAccessToken();
    dispatch(setProfileActionCreator(null));
    dispatch(setIsProfileActionCreator(false));
    dispatch(setIsAuthLogoutActionCreator(true));
    dispatch(setIsAuthLoginActionCreator(false));
  };
}
