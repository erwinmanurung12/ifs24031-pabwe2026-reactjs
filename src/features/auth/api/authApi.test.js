import { describe, it, expect, vi } from "vitest";

vi.mock("../../../helpers/apiHelper", () => ({ fetchApi: vi.fn(async () => ({ status: "success" })) }));

import { fetchApi } from "../../../helpers/apiHelper";
import { postLogin, postRegister } from "./authApi";

describe("authApi", () => {
  it("memanggil endpoint login tanpa auth", async () => {
    await postLogin({ email: "a@b.c", password: "123456" });
    expect(fetchApi).toHaveBeenCalledWith("/auth/login", { method: "POST", body: { email: "a@b.c", password: "123456" }, auth: false });
  });

  it("memanggil endpoint register tanpa auth", async () => {
    await postRegister({ name: "A", email: "a@b.c", password: "123456" });
    expect(fetchApi).toHaveBeenCalledWith("/auth/register", { method: "POST", body: { name: "A", email: "a@b.c", password: "123456" }, auth: false });
  });
});
