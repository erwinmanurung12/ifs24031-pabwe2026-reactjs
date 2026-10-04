import { describe, it, expect, vi } from "vitest";

vi.mock("../../../helpers/apiHelper", () => ({ fetchApi: vi.fn(async () => ({ status: "success" })) }));

import { fetchApi } from "../../../helpers/apiHelper";
import * as api from "./lostFoundApi";

describe("lostFoundApi", () => {
  it("fetchLostFounds dengan dan tanpa filter", async () => {
    await api.fetchLostFounds();
    expect(fetchApi).toHaveBeenLastCalledWith("/lost-founds", { params: { status: undefined, is_completed: undefined, is_me: undefined } });
    await api.fetchLostFounds({ status: "lost", isCompleted: 1, isMe: true });
    expect(fetchApi).toHaveBeenLastCalledWith("/lost-founds", { params: { status: "lost", is_completed: 1, is_me: 1 } });
  });

  it("detail, tambah, ubah, hapus", async () => {
    await api.fetchLostFound(3);
    expect(fetchApi).toHaveBeenLastCalledWith("/lost-founds/3");
    await api.postLostFound({ title: "t", description: "d", status: "lost" });
    expect(fetchApi).toHaveBeenLastCalledWith("/lost-founds", { method: "POST", body: { title: "t", description: "d", status: "lost" } });
    await api.putLostFound({ id: 3, title: "t", description: "d", status: "found", isCompleted: true });
    expect(fetchApi).toHaveBeenLastCalledWith("/lost-founds/3", { method: "PUT", body: { title: "t", description: "d", status: "found", is_completed: 1 } });
    await api.putLostFound({ id: 3, title: "t", description: "d", status: "found", isCompleted: false });
    expect(fetchApi.mock.calls.at(-1)[1].body.is_completed).toBe(0);
    await api.deleteLostFound(3);
    expect(fetchApi).toHaveBeenLastCalledWith("/lost-founds/3", { method: "DELETE" });
  });

  it("cover dikirim sebagai FormData", async () => {
    const file = new File(["x"], "a.png");
    await api.postLostFoundCover({ id: 3, file });
    const [path, options] = fetchApi.mock.calls.at(-1);
    expect(path).toBe("/lost-founds/3/cover");
    expect(options.formData.get("cover")).toBe(file);
  });

  it("statistik", async () => {
    await api.fetchLostFoundStatsDaily();
    expect(fetchApi).toHaveBeenLastCalledWith("/lost-founds/stats/daily");
    await api.fetchLostFoundStatsMonthly();
    expect(fetchApi).toHaveBeenLastCalledWith("/lost-founds/stats/monthly");
  });
});
