import axios from 'axios';

const API_URL = "http://localhost:5000/api/users";

export const fetchLeaderboard = async () => {
  try {
    const response = await axios.get(`${API_URL}/leaderboard`, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw error;
  }
};
