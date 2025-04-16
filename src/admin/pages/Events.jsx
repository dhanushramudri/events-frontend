// Events.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "../components/EventCard";
import {
  Loader2,
  PlusCircle,
  Filter,
  Search,
  X,
  Calendar,
  MapPin,
  Tag,
  Clock,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { API_URL } from "../config/constants";

const Events = () => {
  const [allEvents, setAllEvents] = useState([]); // Store all events from initial fetch
  const [filteredEvents, setFilteredEvents] = useState([]); // Store filtered events
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    category: "",
    location: "",
    date: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const navigate = useNavigate();

  // Fetch all events only once when component mounts
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/events`);
      const events = response.data.events || [];
      setAllEvents(events);
      setFilteredEvents(events); // Initially show all events
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []); // Empty dependency array means this runs once on mount

  // Apply filters on the client side
  useEffect(() => {
    if (allEvents.length === 0) return; // Skip if no events loaded yet

    setLoading(true);

    // Apply filters to the allEvents array
    let results = [...allEvents];

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(
        (event) =>
          event.title?.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.location?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filter.status) {
      results = results.filter((event) => event.status === filter.status);
    }

    // Apply category filter
    if (filter.category) {
      results = results.filter((event) => event.category === filter.category);
    }

    // Apply location filter
    if (filter.location) {
      const locationLower = filter.location.toLowerCase();
      results = results.filter((event) =>
        event.location?.toLowerCase().includes(locationLower)
      );
    }

    // Apply date filter
    if (filter.date) {
      const filterDate = new Date(filter.date).setHours(0, 0, 0, 0);
      results = results.filter((event) => {
        const eventDate = new Date(event.date).setHours(0, 0, 0, 0);
        return eventDate === filterDate;
      });
    }

    // Short timeout to simulate loading for better UX
    setTimeout(() => {
      setFilteredEvents(results);
      setLoading(false);
    }, 150);
  }, [search, filter, allEvents]); // Re-run when search, filter, or allEvents change

  useEffect(() => {
    // Count active filters
    let count = 0;
    if (filter.status) count++;
    if (filter.category) count++;
    if (filter.location) count++;
    if (filter.date) count++;
    setActiveFiltersCount(count);
  }, [filter]);

  const handleCreateEvent = () => {
    navigate("/events/new");
  };

  const clearFilters = () => {
    setSearch("");
    setFilter({
      status: "",
      category: "",
      location: "",
      date: "",
    });
  };

  const refreshEvents = () => {
    fetchAllEvents();
  };

  if (loading && filteredEvents.length === 0) {
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
        <Button className="mt-4" onClick={refreshEvents}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h3 className="text-2xl font-semibold text-center">All Events</h3>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button variant="white" size="sm" onClick={refreshEvents} className="text-gray-600">
            Refresh
          </Button>
          <Button onClick={handleCreateEvent} size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <Card className="overflow-hidden border-gray-200">
        <CardContent className="p-0">
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search events by title, location, or keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 h-11 border-gray-200 bg-gray-50 rounded-lg focus:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={`${
                  showFilters ? "bg-blue-50 text-blue-600 border-blue-200" : ""
                }`}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </Button>

              {(activeFiltersCount > 0 || search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear all
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {search && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-600 border-blue-200 px-2 py-1 rounded-md"
                >
                  <Search className="h-3 w-3 mr-1" />
                  {`"${search}"`}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setSearch("")}
                  />
                </Badge>
              )}
              {filter.status && (
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-600 border-blue-200 px-2 py-1 rounded-md"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {filter.status}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setFilter({ ...filter, status: "" })}
                  />
                </Badge>
              )}
              {filter.category && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-600 border-purple-200 px-2 py-1 rounded-md"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {filter.category}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setFilter({ ...filter, category: "" })}
                  />
                </Badge>
              )}
              {filter.location && (
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-600 border-green-200 px-2 py-1 rounded-md"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  {filter.location}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setFilter({ ...filter, location: "" })}
                  />
                </Badge>
              )}
              {filter.date && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 text-amber-600 border-amber-200 px-2 py-1 rounded-md"
                >
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(filter.date).toLocaleDateString()}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => setFilter({ ...filter, date: "" })}
                  />
                </Badge>
              )}
            </div>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="p-4 border-t border-gray-100 bg-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select
                  value={filter.status}
                  onValueChange={(value) =>
                    setFilter({
                      ...filter,
                      status: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select
                  value={filter.category}
                  onValueChange={(value) =>
                    setFilter({
                      ...filter,
                      category: value === "all" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Seminar">Seminar</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Any location"
                    value={filter.location}
                    onChange={(e) =>
                      setFilter({ ...filter, location: e.target.value.trim() })
                    }
                    className="pl-9 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 cursor-pointer" />
                  <Input
                    type="date"
                    className="pl-9 w-full cursor-pointer"
                    value={filter.date}
                    onChange={(e) => {
                      // Only allow update if the value is a valid date
                      const selectedDate = e.target.value;
                      if (
                        !selectedDate ||
                        !isNaN(new Date(selectedDate).getTime())
                      ) {
                        setFilter({ ...filter, date: selectedDate });
                      }
                    }}
                    onKeyDown={(e) => e.preventDefault()} // Prevent manual typing
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading overlay when filtering */}
      {loading && filteredEvents.length > 0 && (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-gray-500 mr-2" />
          <span className="text-gray-500 text-sm">Updating results...</span>
        </div>
      )}

      {/* Events List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <div className="col-span-3 py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-1">
              No events found
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {search || activeFiltersCount > 0
                ? "Try adjusting your search or filters to find what you're looking for."
                : "No events have been created yet."}
            </p>
            {(search || activeFiltersCount > 0) && (
              <Button variant="outline" onClick={clearFilters} className="mr-2">
                Clear Filters
              </Button>
            )}
            <Button onClick={handleCreateEvent}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
