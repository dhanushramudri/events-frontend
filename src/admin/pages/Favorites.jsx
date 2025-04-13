import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard"; // Adjust path based on your folder structure
import { Loader2 } from "lucide-react";
import { API_URL } from "../config/constants";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/events/favorites/`, {
        withCredentials: true,
      });
      setFavorites(response.data.favorites || []);
    } catch (error) {
      console.error(
        "Failed to fetch favorites:",
        error.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Favorite Events</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin" size={32} />
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center text-gray-500 mt-4">
          No favorite events found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
