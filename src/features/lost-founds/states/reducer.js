import { ActionType } from "./action";

export function lostFoundsReducer(state = [], action = {}) {
  return action.type === ActionType.SET_LOST_FOUNDS ? action.payload.lostFounds : state;
}

export function lostFoundReducer(state = null, action = {}) {
  return action.type === ActionType.SET_LOST_FOUND ? action.payload.lostFound : state;
}

export function lostFoundStatsReducer(state = null, action = {}) {
  return action.type === ActionType.SET_LOST_FOUND_STATS ? action.payload.stats : state;
}

function flagReducer(type) {
  return (state = false, action = {}) => (action.type === type ? action.payload.status : state);
}

export const isLostFoundReducer = flagReducer(ActionType.SET_IS_LOST_FOUND);
export const isLostFoundAddReducer = flagReducer(ActionType.SET_IS_LOST_FOUND_ADD);
export const isLostFoundAddedReducer = flagReducer(ActionType.SET_IS_LOST_FOUND_ADDED);
export const isLostFoundChangeReducer = flagReducer(ActionType.SET_IS_LOST_FOUND_CHANGE);
export const isLostFoundChangedReducer = flagReducer(ActionType.SET_IS_LOST_FOUND_CHANGED);
export const isLostFoundChangeCoverReducer = flagReducer(ActionType.SET_IS_LOST_FOUND_CHANGE_COVER);
export const isLostFoundChangedCoverReducer = flagReducer(ActionType.SET_IS_LOST_FOUND_CHANGED_COVER);
export const isLostFoundDeleteReducer = flagReducer(ActionType.SET_IS_LOST_FOUND_DELETE);
export const isLostFoundDeletedReducer = flagReducer(ActionType.SET_IS_LOST_FOUND_DELETED);
