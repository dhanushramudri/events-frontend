import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Loader2, Heart } from "lucide-react";
import { Button } from "../../admin/components/ui/button";
import { API_URL } from "../../admin/config/constants";
import EventCard from "../components/EventCard"; 
import EventFilters from "../components/EventFilters"; 
import EventSearch from "../components/EventSearch"; 

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
  const [userParticipants, setUserParticipants] = useState([]);

  // Fetch all events, favorites, and user participants ONCE on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, favoritesRes, participantsRes] = await Promise.all([
          axios.get("https://events-backend-coral.vercel.app/api/events"),
          axios.get(`${API_URL}/events/favorites`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }),
          axios.get(`${API_URL}/user/participants`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            withCredentials: true,
          }),
        ]);
        setAllEvents(eventsRes.data.events || []);
        setFavorites(favoritesRes.data.favorites || []);
        setUserParticipants(participantsRes.data.participants || []);
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
        const eventDate = new Date(event.date || event.startDate);
        let matchesDate = true;
        if (filter.date === "today") {
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          matchesDate =
            eventDate >= today &&
            eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        } else if (filter.date === "thisWeek") {
          const weekStart = new Date(
            now.setDate(now.getDate() - now.getDay())
          );
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 7);
          matchesDate = eventDate >= weekStart && eventDate < weekEnd;
        } else if (filter.date === "thisMonth") {
          matchesDate =
            eventDate.getMonth() === now.getMonth() &&
            eventDate.getFullYear() === now.getFullYear();
        }
        return matchesSearch && matchesCategory && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date || a.startDate);
        const dateB = new Date(b.date || b.startDate);
        switch (filter.sortBy) {
          case "date":
            return dateB - dateA;
          case "dateAsc":
            return dateA - dateB;
          case "popularity":
            return (b.participantsCount || 0) - (a.participantsCount || 0);
          case "name":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [allEvents, filter]);

  const displayedEvents = showFavoritesOnly
    ? filteredEvents.filter((event) => favorites.includes(event._id))
    : filteredEvents;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        <p>{error}</p>
        <Button className="mt-4" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        
      </div>

      <EventSearch filter={filter} setFilter={setFilter} />
      <EventFilters
        filter={filter}
        setFilter={setFilter}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
      />

      {displayedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((event) => (
            <EventCard key={event._id} event={event} favorites={favorites} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">No events found.</div>
      )}
    </div>
  );
};

export default Events;