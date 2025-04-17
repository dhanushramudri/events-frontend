import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { API_URL } from "../../admin/config/constants";
import EventCard from "../components/EventCard";
import EventFilters from "../components/EventFilters";
import EventSearch from "../components/EventSearch";
import Pagination from "../components/Pagination";
import { Filter } from "lucide-react"; // Import the filter icon

const Events = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    category: "all",
    status: "upcoming",
    searchQuery: "",
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false); // Toggle for filter display
  const eventsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [eventsRes, favoritesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/events"),
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

  // Filter logic (without date filter)
  const filteredEvents = useMemo(() => {
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

          const matchesStatus =
          filter.status === "all" || event.status === filter.status;

          return matchesSearch && matchesCategory && matchesStatus;
      })
      .sort((a, b) => {
        return a.title.localeCompare(b.title);
      });
  }, [allEvents, filter]);

  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  if (loading) {
    return (
      <div className="w-full mx-auto p-4">
        {/* Skeleton for Filters */}
        <div className="space-y-4 mb-4">
          <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="h-10 bg-gray-200 animate-pulse rounded-lg"></div>
        </div>

        {/* Skeleton for Event Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="w-full bg-gray-200 h-56 animate-pulse rounded-lg"></div>
          ))}
        </div>

        {/* Skeleton for Pagination */}
        <div className="flex justify-center mt-4">
          <div className="w-24 h-8 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full mx-auto p-4">
      {/* Filters and Search - Show filter icon to toggle */}
      <div className="flex justify-between items-center mb-4">
        {/* Filter Icon */}
        <button
          onClick={() => setShowFilters ((prev) => !prev)}
          className="p-2 rounded-full hover:bg-gray-200 transition-all"
        >
          <Filter className="w-5 h-5 text-gray-500 cursor-pointer" />
        </button>
      </div>

      {/* Only show filters when 'showFilters' is true */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <EventSearch filter={filter} setFilter={setFilter} />
          <EventFilters filter={filter} setFilter={setFilter} />
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentEvents.map((event) => (
          <EventCard key={event.id} event={event} isFavorite={favorites.includes(event.id)} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Events;