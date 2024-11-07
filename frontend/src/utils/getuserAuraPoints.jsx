import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const getUserAuraPoints = async () => {
  try {
    const response = await axios.get(`${API_URL}/aura-points`, {
      withCredentials: true,
    });
    return response.data.auraPoints;
  } catch (error) {
    console.error("Error fetching aura points:", error);
    throw error;
  }
};
