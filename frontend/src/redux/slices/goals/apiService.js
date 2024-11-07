// src/apiService.js
import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000", // Backend base URL
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Allow sending cookies with requests
});

// Function to get all goals
export const getGoals = async () => {
  try {
    const response = await apiClient.get("/api/goals");
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching goals:", error);
    throw error;
  }
};

// Function to add a new goal
export const addGoal = async (goalData) => {
  try {
    const response = await apiClient.post("/api/goals", goalData);
    return response.data;
  } catch (error) {
    console.error("Error adding goal:", error);
    throw error;
  }
};

// Function to update an existing goal
export const updateGoal = async (goalId, updatedGoalData) => {
  try {
    const response = await apiClient.put(
      `/api/goals/${goalId}`,
      updatedGoalData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating goal:", error);
    throw error;
  }
};

export const deleteGoal = async (goalId) => {
  try {
    const response = await apiClient.delete(`/api/goals/${goalId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting goal:", error);
    throw error;
  }
};
