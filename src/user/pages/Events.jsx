import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Loader2, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { API_URL } from "../../admin/config/constants";
import EventCard from "../components/EventCard"; // Import the EventCard component
import EventFilters from "../components/EventFilters"; // New component for filters
import EventSearch from "../components/EventSearch"; // New component for search
import Pagination from "../components/Pagination"; // Import the Pagination component

const Events = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    category: "all",
    sortBy: "date",
    date: "all",
    searchQuery: "",
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 6; // Number of events to display per page

  // Fetch all events, favorites, and user participants ONCE on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, favoritesRes] = await Promise.all([
          axios.get("https://events-backend-coral.vercel.app/api/events"),
          axios.get(`${API_URL}/events/favorites`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }),
        ]);
        setAllEvents(eventsRes.data.events || []);
        setFavorites(favoritesRes.data.favorites || []);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Client-side filtering, searching, and sorting
  const filteredEvents = useMemo(() => {
    const now = new Date();
    return allEvents
      .filter((event) => {
        const matchesSearch =
          event.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
          (event.location &&
            event.location
              .toLowerCase()
              .includes(filter.searchQuery.toLowerCase()));
        const matchesCategory =
          filter.category === "all" || event.category === filter.category;
        const matchesDate =
          filter.date === "all" || new Date(event.date) >= now;

        return matchesSearch && matchesCategory && matchesDate;
      })
      .sort((a, b) => {
        if (filter.sortBy === "date") {
          return new Date(a.date) - new Date(b.date);
        }
        return a.title.localeCompare(b.title);
      });
  }, [allEvents, filter]);

  // Calculate the events to display based on the current page
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading events...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full mx-auto p-4">
      <EventFilters filter={filter} setFilter={setFilter} />
      <EventSearch filter={filter} setFilter={setFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentEvents.map((event) => (
          <EventCard key={event.id} event={event} isFavorite={favorites.includes(event.id)} />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Events;