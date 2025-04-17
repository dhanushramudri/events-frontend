import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import { API_URL } from "../../admin/config/constants";

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
      console.error("Failed to fetch favorites:", error.response?.data || error);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tailwind CSS Skeleton Loader */}
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-md shadow-lg animate-pulse"
            >
              <div className="bg-gray-300 h-48 rounded-md mb-4"></div>
              <div className="h-4 bg-gray-300 rounded-md mb-2 w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded-md mb-2 w-1/2"></div>
              <div className="h-3 bg-gray-300 rounded-md mb-2 w-2/3"></div>
            </div>
          ))}
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
