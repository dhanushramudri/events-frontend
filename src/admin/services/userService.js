import axios from "axios";
import { API_URL } from "../config/constants";

export const getUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/admin/my-events/participants`);
    console.log("res is ", res);
    if (!res || !res.data) {
      throw new Error("Invalid response from server");
    }
    return res.data.participants || [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
