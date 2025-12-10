import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const api = axios.create({
  baseURL: "http://localhost:3000", // Backend adresin
});

// Her isteğe otomatik Token ekle
api.interceptors.request.use((config) => {
  const user = cookies.get("loggedInUser");
  if (user && user.accessToken) {
    config.headers.Authorization = `Bearer ${user.accessToken}`;
  }
  return config;
});