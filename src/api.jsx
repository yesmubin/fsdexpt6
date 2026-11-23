const API_URL = "http://localhost:5000/api";
const TOKEN_KEY = "cm_token";
const USER_KEY = "cm_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const saveToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const saveUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

export const getStoredUser = () => {
  if (!getToken()) return null;
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
};

export const clearStoredUser = () => localStorage.removeItem(USER_KEY);

export async function api(path, { method = "GET", body } = {}) {
  const token = getToken();

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.message ||
      data?.details?.join(", ") ||
      data?.error ||
      `Request failed (${response.status})`;

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}