import { configureStore } from "@reduxjs/toolkit";
import {
  isAuthLoginReducer,
  isAuthRegisterReducer,
  isAuthLogoutReducer,
} from "./features/auth/states/reducer";
import {
  usersReducer,
  userReducer,
  profileReducer,
  isProfileReducer,
  isChangeProfileReducer,
  isChangeProfilePhotoReducer,
  isChangeProfilePasswordReducer,
} from "./features/users/states/reducer";
import {
  lostFoundsReducer,
  lostFoundReducer,
  lostFoundStatsReducer,
  isLostFoundReducer,
  isLostFoundAddReducer,
  isLostFoundAddedReducer,
  isLostFoundChangeReducer,
  isLostFoundChangedReducer,
  isLostFoundChangeCoverReducer,
  isLostFoundChangedCoverReducer,
  isLostFoundDeleteReducer,
  isLostFoundDeletedReducer,
} from "./features/lost-founds/states/reducer";

export const reducer = {
  isAuthLogin: isAuthLoginReducer,
  isAuthRegister: isAuthRegisterReducer,
  isAuthLogout: isAuthLogoutReducer,
  users: usersReducer,
  user: userReducer,
  profile: profileReducer,
  isProfile: isProfileReducer,
  isChangeProfile: isChangeProfileReducer,
  isChangeProfilePhoto: isChangeProfilePhotoReducer,
  isChangeProfilePassword: isChangeProfilePasswordReducer,
  lostFounds: lostFoundsReducer,
  lostFound: lostFoundReducer,
  lostFoundStats: lostFoundStatsReducer,
  isLostFound: isLostFoundReducer,
  isLostFoundAdd: isLostFoundAddReducer,
  isLostFoundAdded: isLostFoundAddedReducer,
  isLostFoundChange: isLostFoundChangeReducer,
  isLostFoundChanged: isLostFoundChangedReducer,
  isLostFoundChangeCover: isLostFoundChangeCoverReducer,
  isLostFoundChangedCover: isLostFoundChangedCoverReducer,
  isLostFoundDelete: isLostFoundDeleteReducer,
  isLostFoundDeleted: isLostFoundDeletedReducer,
};

export function createStore(preloadedState) {
  return configureStore({ reducer, preloadedState });
}

const store = createStore();

export default store;
