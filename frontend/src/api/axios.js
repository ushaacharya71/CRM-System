import axios from "axios";

// ✅ Detect environment (local or production)
const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Automatically attach token (for all secure routes)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handler (useful during dev)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;
      console.error(
        `❌ API Error [${status}] →`,
        data?.message || data || "Unknown error"
      );

      // Optional: auto-logout if token expired
      if (status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }
    } else {
      console.error("❌ Network error:", error.message);

    }
    return Promise.reject(error);
  }
);

export default api;


// import axios from "axios";

// // ================================
// // Base URL (Production / Dev)
// // ================================
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // ================================
// // Axios Instance
// // ================================
// const api = axios.create({
//   baseURL: BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true,
// });

// // ================================
// // Request Interceptor (Attach JWT)
// // ================================
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ================================
// // Response Interceptor (Global Errors)
// // ================================
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       const { status, data } = error.response;

//       console.error(
//         `❌ API Error [${status}] →`,
//         data?.message || data || "Unknown error"
//       );

//       // Auto logout on auth failure
//       if (status === 401) {
//         localStorage.clear();
//         window.location.href = "/login";
//       }
//     } else {
//       console.error("❌ Network error:", error.message);
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
