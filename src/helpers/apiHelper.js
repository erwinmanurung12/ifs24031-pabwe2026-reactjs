const TOKEN_KEY = "accessToken";

export function getAccessToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function putAccessToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAccessToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Mengubah path relatif dari API (mis. img/users/a.png) menjadi URL penuh.
export function getAssetUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//.test(path)) return path;
  const origin = DELCOM_BASEURL.replace(/\/api\/v\d+\/?$/, "");
  return `${origin}/${path.replace(/^\//, "")}`;
}

// Menyusun pesan error dari respons API (message + detail validasi).
export function getResponseMessage(response) {
  const details = Object.values(response?.data ?? {})
    .flat()
    .filter((item) => typeof item === "string");
  const message = response?.message ?? "Terjadi kesalahan";
  return details.length ? `${message}: ${details.join(", ")}` : message;
}

export async function fetchApi(
  path,
  { method = "GET", params, body, formData, auth = true } = {}
) {
  const url = new URL(`${DELCOM_BASEURL}${path}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, value);
      }
    });
  }

  const headers = { Accept: "application/json" };
  const token = getAccessToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const options = { method, headers };
  if (formData) {
    options.body = formData;
  } else if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url.toString(), options);
    return await response.json();
  } catch {
    return { status: "error", message: "Tidak dapat terhubung ke server" };
  }
}
