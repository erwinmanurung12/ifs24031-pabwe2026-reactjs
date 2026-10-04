import { fetchApi } from "../../../helpers/apiHelper";

export const fetchUsers = () => fetchApi("/users");

export const fetchProfile = () => fetchApi("/users/me");

export const putProfile = ({ name, email }) =>
  fetchApi("/users/me", { method: "PUT", body: { name, email } });

export function postProfilePhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);
  return fetchApi("/users/me/photo", { method: "POST", formData });
}

export const putProfilePassword = ({ password, newPassword }) =>
  fetchApi("/users/me/password", {
    method: "PUT",
    body: { password, new_password: newPassword },
  });
