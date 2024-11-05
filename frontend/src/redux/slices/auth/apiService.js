import axios from "axios";

// Instance of Axios with default settings
const apiClient = axios.create({
  baseURL: "http://localhost:5000", // Backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allow sending cookies with requests
});

export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/api/auth/signup", userData, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await apiClient.post("/api/auth/login", loginData, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

// Check if user is authenticated
export const checkAuth = async () => {
  try {
    const response = await apiClient.get("/api/auth/check-auth");
    console.log("User is authenticated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
};

export const logoutUser = async () => {
  try {
    const response = await apiClient.post("/api/auth/logout");

    return response.data;
  } catch (error) {
    console.error("Error during logout:", error);
    throw error;
  }
};
