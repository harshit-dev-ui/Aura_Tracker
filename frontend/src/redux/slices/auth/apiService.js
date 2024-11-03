import axios from "axios";

// Instance of Axios with default settings
const apiClient = axios.create({
  baseURL: "http://localhost:3000", // Backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allow sending cookies with requests
});

// User registration
export const registerUser = async (userData) => {
  try {
    const response = await apiClient.post("/api/user/register", userData, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error during registration:", error);
    throw error;
  }
};
