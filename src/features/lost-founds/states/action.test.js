import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api/lostFoundApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
}));

import * as api from "../api/lostFoundApi";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper";
import * as actions from "./action";

describe("lost-found action", () => {
  beforeEach(() => vi.clearAllMocks());

  it("asyncSetLostFounds berhasil", async () => {
    api.fetchLostFounds.mockResolvedValue({ status: "success", data: { lost_founds: [{ id: 1 }] } });
    const dispatch = vi.fn();
    expect(await actions.asyncSetLostFounds({ isMe: true })(dispatch)).toBe(true);
    expect(api.fetchLostFounds).toHaveBeenCalledWith({ isMe: true });
    expect(dispatch).toHaveBeenCalledWith(actions.setLostFoundsActionCreator([{ id: 1 }]));
    expect(dispatch).toHaveBeenCalledWith(actions.setIsLostFoundActionCreator(false));
  });

  it("asyncSetLostFounds gagal", async () => {
    api.fetchLostFounds.mockResolvedValue({ status: "fail", message: "Gagal" });
    expect(await actions.asyncSetLostFounds()(vi.fn())).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Gagal");
  });

  it("asyncSetLostFound berhasil dan gagal", async () => {
    api.fetchLostFound.mockResolvedValueOnce({ status: "success", data: { lost_found: { id: 2 } } });
    const dispatch = vi.fn();
    expect(await actions.asyncSetLostFound(2)(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(actions.setLostFoundActionCreator({ id: 2 }));

    api.fetchLostFound.mockResolvedValueOnce({ status: "fail", message: "Tidak ada" });
    expect(await actions.asyncSetLostFound(2)(dispatch)).toBe(false);
    expect(dispatch).toHaveBeenCalledWith(actions.setLostFoundActionCreator(null));
    expect(showErrorDialog).toHaveBeenCalledWith("Tidak ada");
  });

  it("asyncSetLostFoundStats berhasil dan gagal tanpa dialog", async () => {
    api.fetchLostFoundStatsDaily.mockResolvedValueOnce({ status: "success", data: { stats_losts: {} } });
    const dispatch = vi.fn();
    expect(await actions.asyncSetLostFoundStats()(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(actions.setLostFoundStatsActionCreator({ stats_losts: {} }));

    api.fetchLostFoundStatsDaily.mockResolvedValueOnce({ status: "fail" });
    expect(await actions.asyncSetLostFoundStats()(dispatch)).toBe(false);
    expect(showErrorDialog).not.toHaveBeenCalled();
  });

  it.each([
    ["asyncAddLostFound", "postLostFound", "Laporan berhasil ditambahkan", actions.setIsLostFoundAddedActionCreator],
    ["asyncChangeLostFound", "putLostFound", "Laporan berhasil diperbarui", actions.setIsLostFoundChangedActionCreator],
    ["asyncChangeLostFoundCover", "postLostFoundCover", "Cover berhasil diperbarui", actions.setIsLostFoundChangedCoverActionCreator],
    ["asyncDeleteLostFound", "deleteLostFound", "Laporan berhasil dihapus", actions.setIsLostFoundDeletedActionCreator],
  ])("%s berhasil dan gagal", async (name, apiName, message, doneCreator) => {
    api[apiName].mockResolvedValueOnce({ status: "success" });
    const dispatch = vi.fn();
    expect(await actions[name]({ id: 1 })(dispatch)).toBe(true);
    expect(dispatch).toHaveBeenCalledWith(doneCreator(true));
    expect(showSuccessDialog).toHaveBeenCalledWith(message);

    vi.clearAllMocks();
    api[apiName].mockResolvedValueOnce({ status: "fail", message: "Ditolak" });
    const dispatch2 = vi.fn();
    expect(await actions[name]({ id: 1 })(dispatch2)).toBe(false);
    expect(dispatch2).not.toHaveBeenCalledWith(doneCreator(true));
    expect(showErrorDialog).toHaveBeenCalledWith("Ditolak");
  });
});
