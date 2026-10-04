import { fetchApi } from "../../../helpers/apiHelper";

export const fetchLostFounds = ({ status, isCompleted, isMe } = {}) =>
  fetchApi("/lost-founds", {
    params: { status, is_completed: isCompleted, is_me: isMe ? 1 : undefined },
  });

export const fetchLostFound = (id) => fetchApi(`/lost-founds/${id}`);

export const postLostFound = ({ title, description, status }) =>
  fetchApi("/lost-founds", { method: "POST", body: { title, description, status } });

export const putLostFound = ({ id, title, description, status, isCompleted }) =>
  fetchApi(`/lost-founds/${id}`, {
    method: "PUT",
    body: { title, description, status, is_completed: isCompleted ? 1 : 0 },
  });

export function postLostFoundCover({ id, file }) {
  const formData = new FormData();
  formData.append("cover", file);
  return fetchApi(`/lost-founds/${id}/cover`, { method: "POST", formData });
}

export const deleteLostFound = (id) => fetchApi(`/lost-founds/${id}`, { method: "DELETE" });

export const fetchLostFoundStatsDaily = () => fetchApi("/lost-founds/stats/daily");

export const fetchLostFoundStatsMonthly = () => fetchApi("/lost-founds/stats/monthly");
