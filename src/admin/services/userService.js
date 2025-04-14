import axios from "axios";

export const getUsers = async () => {
  const API_URL = "http://localhost:5000/api";
  try {
    const res = await axios.get(`${API_URL}/admin/my-events/participants`);
    return res.data.participants || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
