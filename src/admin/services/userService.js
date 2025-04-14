import axios from "axios";
import { API_URL } from "../config/constants";

export const getUsers = async () => {
  const API_URL = `${API_URL}`;
  try {
    const res = await axios.get(`${API_URL}/admin/my-events/participants`);
    return res.data.participants || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
