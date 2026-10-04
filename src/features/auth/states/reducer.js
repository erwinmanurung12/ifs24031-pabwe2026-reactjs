import { ActionType } from "./action";
import { getAccessToken } from "../../../helpers/apiHelper";

export function isAuthLoginReducer(state = Boolean(getAccessToken()), action = {}) {
  return action.type === ActionType.SET_IS_AUTH_LOGIN ? action.payload.status : state;
}

export function isAuthRegisterReducer(state = false, action = {}) {
  return action.type === ActionType.SET_IS_AUTH_REGISTER ? action.payload.status : state;
}

export function isAuthLogoutReducer(state = false, action = {}) {
  if (action.type === ActionType.SET_IS_AUTH_LOGOUT) return action.payload.status;
  if (action.type === ActionType.SET_IS_AUTH_LOGIN && action.payload.status) return false;
  return state;
}
