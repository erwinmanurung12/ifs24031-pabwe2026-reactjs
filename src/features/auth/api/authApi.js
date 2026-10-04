import { fetchApi } from "../../../helpers/apiHelper";

export function postLogin({ email, password }) {
  return fetchApi("/auth/login", { method: "POST", body: { email, password }, auth: false });
}

export function postRegister({ name, email, password }) {
  return fetchApi("/auth/register", {
    method: "POST",
    body: { name, email, password },
    auth: false,
  });
}
