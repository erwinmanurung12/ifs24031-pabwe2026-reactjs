import { ActionType } from "./action";

export function usersReducer(state = [], action = {}) {
  return action.type === ActionType.SET_USERS ? action.payload.users : state;
}

export function userReducer(state = null, action = {}) {
  return action.type === ActionType.SET_USER ? action.payload.user : state;
}

export function profileReducer(state = null, action = {}) {
  return action.type === ActionType.SET_PROFILE ? action.payload.profile : state;
}

function flagReducer(type) {
  return (state = false, action = {}) => (action.type === type ? action.payload.status : state);
}

export const isProfileReducer = flagReducer(ActionType.SET_IS_PROFILE);
export const isChangeProfileReducer = flagReducer(ActionType.SET_IS_CHANGE_PROFILE);
export const isChangeProfilePhotoReducer = flagReducer(ActionType.SET_IS_CHANGE_PROFILE_PHOTO);
export const isChangeProfilePasswordReducer = flagReducer(ActionType.SET_IS_CHANGE_PROFILE_PASSWORD);
