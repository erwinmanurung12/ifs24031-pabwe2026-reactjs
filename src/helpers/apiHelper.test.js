import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  getAssetUrl,
  getResponseMessage,
  fetchApi,
} from "./apiHelper";

describe("apiHelper", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("membentuk URL aset", () => {
    expect(getAssetUrl(null)).toBeNull();
    expect(getAssetUrl("https://x.test/a.png")).toBe("https://x.test/a.png");
    expect(getAssetUrl("img/a.png")).toBe("https://open-api.delcom.org/img/a.png");
    expect(getAssetUrl("/img/a.png")).toBe("https://open-api.delcom.org/img/a.png");
  });

  it("menyusun pesan respons", () => {
    expect(getResponseMessage({ message: "Gagal", data: { field: ["Judul wajib"] } })).toBe("Gagal: Judul wajib");
    expect(getResponseMessage({ message: "Gagal", data: null })).toBe("Gagal");
    expect(getResponseMessage({ message: "Gagal", data: { a: 1 } })).toBe("Gagal");
    expect(getResponseMessage(undefined)).toBe("Terjadi kesalahan");
  });

  it("mengirim GET dengan query params dan bearer token", async () => {
    putAccessToken("tok");
    fetch.mockResolvedValue({ json: async () => ({ status: "success" }) });
    const result = await fetchApi("/lost-founds", { params: { status: "lost", is_me: 1, empty: "", none: undefined, nul: null } });
    expect(result).toEqual({ status: "success" });
    const [url, options] = fetch.mock.calls[0];
    expect(url).toBe("https://open-api.delcom.org/api/v1/lost-founds?status=lost&is_me=1");
    expect(options.method).toBe("GET");
    expect(options.headers.Authorization).toBe("Bearer tok");
    expect(options.body).toBeUndefined();
  });

  it("mengirim body JSON, FormData, dan tanpa auth", async () => {
    fetch.mockResolvedValue({ json: async () => ({}) });
    await fetchApi("/auth/login", { method: "POST", body: { a: 1 }, auth: false });
    let [, options] = fetch.mock.calls[0];
    expect(options.body).toBe('{"a":1}');
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.headers.Authorization).toBeUndefined();

    const formData = new FormData();
    await fetchApi("/x", { method: "POST", formData });
    [, options] = fetch.mock.calls[1];
    expect(options.body).toBe(formData);
    expect(options.headers["Content-Type"]).toBeUndefined();
  });

  it("tidak menambah Authorization bila token kosong", async () => {
    fetch.mockResolvedValue({ json: async () => ({}) });
    await fetchApi("/x");
    expect(fetch.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it("mengembalikan error jaringan", async () => {
    fetch.mockRejectedValue(new Error("offline"));
    expect(await fetchApi("/x")).toEqual({ status: "error", message: "Tidak dapat terhubung ke server" });
  });
});
