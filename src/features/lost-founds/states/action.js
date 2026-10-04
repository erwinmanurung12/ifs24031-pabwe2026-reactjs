import {
  fetchLostFounds,
  fetchLostFound,
  postLostFound,
  putLostFound,
  postLostFoundCover,
  deleteLostFound,
  fetchLostFoundStatsDaily,
} from "../api/lostFoundApi";
import { getResponseMessage } from "../../../helpers/apiHelper";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";

export const ActionType = {
  SET_LOST_FOUNDS: "lostFounds/SET_LOST_FOUNDS",
  SET_LOST_FOUND: "lostFounds/SET_LOST_FOUND",
  SET_IS_LOST_FOUND: "lostFounds/SET_IS_LOST_FOUND",
  SET_IS_LOST_FOUND_ADD: "lostFounds/SET_IS_LOST_FOUND_ADD",
  SET_IS_LOST_FOUND_ADDED: "lostFounds/SET_IS_LOST_FOUND_ADDED",
  SET_IS_LOST_FOUND_CHANGE: "lostFounds/SET_IS_LOST_FOUND_CHANGE",
  SET_IS_LOST_FOUND_CHANGED: "lostFounds/SET_IS_LOST_FOUND_CHANGED",
  SET_IS_LOST_FOUND_CHANGE_COVER: "lostFounds/SET_IS_LOST_FOUND_CHANGE_COVER",
  SET_IS_LOST_FOUND_CHANGED_COVER: "lostFounds/SET_IS_LOST_FOUND_CHANGED_COVER",
  SET_IS_LOST_FOUND_DELETE: "lostFounds/SET_IS_LOST_FOUND_DELETE",
  SET_IS_LOST_FOUND_DELETED: "lostFounds/SET_IS_LOST_FOUND_DELETED",
  SET_LOST_FOUND_STATS: "lostFounds/SET_LOST_FOUND_STATS",
};

const creator = (type, key) => (value) => ({ type, payload: { [key]: value } });

export const setLostFoundsActionCreator = creator(ActionType.SET_LOST_FOUNDS, "lostFounds");
export const setLostFoundActionCreator = creator(ActionType.SET_LOST_FOUND, "lostFound");
export const setIsLostFoundActionCreator = creator(ActionType.SET_IS_LOST_FOUND, "status");
export const setIsLostFoundAddActionCreator = creator(ActionType.SET_IS_LOST_FOUND_ADD, "status");
export const setIsLostFoundAddedActionCreator = creator(ActionType.SET_IS_LOST_FOUND_ADDED, "status");
export const setIsLostFoundChangeActionCreator = creator(ActionType.SET_IS_LOST_FOUND_CHANGE, "status");
export const setIsLostFoundChangedActionCreator = creator(ActionType.SET_IS_LOST_FOUND_CHANGED, "status");
export const setIsLostFoundChangeCoverActionCreator = creator(ActionType.SET_IS_LOST_FOUND_CHANGE_COVER, "status");
export const setIsLostFoundChangedCoverActionCreator = creator(ActionType.SET_IS_LOST_FOUND_CHANGED_COVER, "status");
export const setIsLostFoundDeleteActionCreator = creator(ActionType.SET_IS_LOST_FOUND_DELETE, "status");
export const setIsLostFoundDeletedActionCreator = creator(ActionType.SET_IS_LOST_FOUND_DELETED, "status");
export const setLostFoundStatsActionCreator = creator(ActionType.SET_LOST_FOUND_STATS, "stats");

export function asyncSetLostFounds(filters) {
  return async (dispatch) => {
    dispatch(setIsLostFoundActionCreator(true));
    const response = await fetchLostFounds(filters);
    dispatch(setIsLostFoundActionCreator(false));
    if (response.status !== "success") {
      await showErrorDialog(getResponseMessage(response));
      return false;
    }
    dispatch(setLostFoundsActionCreator(response.data.lost_founds));
    return true;
  };
}

export function asyncSetLostFound(id) {
  return async (dispatch) => {
    dispatch(setIsLostFoundActionCreator(true));
    const response = await fetchLostFound(id);
    dispatch(setIsLostFoundActionCreator(false));
    if (response.status !== "success") {
      dispatch(setLostFoundActionCreator(null));
      await showErrorDialog(getResponseMessage(response));
      return false;
    }
    dispatch(setLostFoundActionCreator(response.data.lost_found));
    return true;
  };
}

// Statistik bersifat pelengkap: kegagalan tidak menampilkan dialog.
export function asyncSetLostFoundStats() {
  return async (dispatch) => {
    const response = await fetchLostFoundStatsDaily();
    if (response.status !== "success") return false;
    dispatch(setLostFoundStatsActionCreator(response.data));
    return true;
  };
}

function createMutation({ call, progress, done, successMessage }) {
  return (payload) => async (dispatch) => {
    dispatch(progress(true));
    const response = await call(payload);
    dispatch(progress(false));
    if (response.status !== "success") {
      await showErrorDialog(getResponseMessage(response));
      return false;
    }
    dispatch(done(true));
    await showSuccessDialog(successMessage);
    return true;
  };
}

export const asyncAddLostFound = createMutation({
  call: postLostFound,
  progress: setIsLostFoundAddActionCreator,
  done: setIsLostFoundAddedActionCreator,
  successMessage: "Laporan berhasil ditambahkan",
});

export const asyncChangeLostFound = createMutation({
  call: putLostFound,
  progress: setIsLostFoundChangeActionCreator,
  done: setIsLostFoundChangedActionCreator,
  successMessage: "Laporan berhasil diperbarui",
});

export const asyncChangeLostFoundCover = createMutation({
  call: postLostFoundCover,
  progress: setIsLostFoundChangeCoverActionCreator,
  done: setIsLostFoundChangedCoverActionCreator,
  successMessage: "Cover berhasil diperbarui",
});

export const asyncDeleteLostFound = createMutation({
  call: deleteLostFound,
  progress: setIsLostFoundDeleteActionCreator,
  done: setIsLostFoundDeletedActionCreator,
  successMessage: "Laporan berhasil dihapus",
});
