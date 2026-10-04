import { describe, it, expect, vi } from "vitest";

vi.mock("../../../helpers/apiHelper", () => ({ fetchApi: vi.fn(async () => ({ status: "success" })) }));

import { fetchApi } from "../../../helpers/apiHelper";
import { fetchUsers, fetchProfile, putProfile, postProfilePhoto, putProfilePassword } from "./userApi";

describe("userApi", () => {
  it("memanggil endpoint users", async () => {
    await fetchUsers();
    expect(fetchApi).toHaveBeenCalledWith("/users");
    await fetchProfile();
    expect(fetchApi).toHaveBeenCalledWith("/users/me");
  });

  it("memperbarui profil", async () => {
    await putProfile({ name: "A", email: "a@b.c" });
    expect(fetchApi).toHaveBeenCalledWith("/users/me", { method: "PUT", body: { name: "A", email: "a@b.c" } });
  });

  it("mengunggah foto sebagai FormData", async () => {
    const file = new File(["x"], "a.png", { type: "image/png" });
    await postProfilePhoto(file);
    const [path, options] = fetchApi.mock.calls.at(-1);
    expect(path).toBe("/users/me/photo");
    expect(options.method).toBe("POST");
    expect(options.formData.get("photo")).toBe(file);
  });

  it("mengganti kata sandi dengan snake_case", async () => {
    await putProfilePassword({ password: "old", newPassword: "new" });
    expect(fetchApi).toHaveBeenCalledWith("/users/me/password", { method: "PUT", body: { password: "old", new_password: "new" } });
  });
});
