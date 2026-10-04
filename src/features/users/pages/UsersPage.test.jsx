import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("../api/userApi");
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(async () => {}),
  showSuccessDialog: vi.fn(async () => {}),
}));

import * as api from "../api/userApi";
import UsersPage from "./UsersPage";
import { renderWithProviders } from "../../../test-utils";

const users = [
  { id: 1, name: "Budi", email: "budi@mail.com", photo: null },
  { id: 2, name: "Citra", email: "citra@mail.com", photo: null },
];

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchUsers.mockResolvedValue({ status: "success", data: { users } });
  });

  it("memuat dan menampilkan pengguna, dan dapat dicari", async () => {
    renderWithProviders(<UsersPage />);
    expect(await screen.findByText("Budi")).toBeInTheDocument();
    expect(document.title).toBe("Pengguna | Lost & Founds");
    await userEvent.type(screen.getByLabelText("Cari pengguna"), "citra@");
    expect(screen.queryByText("Budi")).not.toBeInTheDocument();
    expect(screen.getByText("Citra")).toBeInTheDocument();
    await userEvent.type(screen.getByLabelText("Cari pengguna"), "zzz");
    expect(screen.getByText("Pengguna tidak ditemukan.")).toBeInTheDocument();
  });
});
