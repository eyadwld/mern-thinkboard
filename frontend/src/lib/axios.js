import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send the HttpOnly cookie on every request automatically to client
});

// Handle unauthorized responses (expired / missing cookie)
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      // Avoid redirect loop if already on login/signup
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup"
      ) {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
