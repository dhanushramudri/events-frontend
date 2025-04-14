import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Loader2,
  Calendar,
  MapPin,
  Tag,
  Users,
  Clock,
  Heart,
  Search,
} from "lucide-react";
import { Button } from "../admin/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../admin/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../admin/components/ui/select";
import { Badge } from "../admin/components/ui/badge";
import { Input } from "../admin/components/ui/input";
import { Progress } from "../admin/components/ui/progress";
import { formatDateTime } from "../admin/utils/cn";

// Simple Progress Component if you don't have the Progress component
const SimpleProgress = ({ value, className }) => {
  const percentage =
    value !== undefined ? Math.min(Math.max(value, 0), 100) : 0;

  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-100 ${
        className || ""
      }`}
    >
      <div
        className="h-full bg-blue-600 transition-all"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

const AppUser = () => {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    category: "all",
    sortBy: "date",
    date: "all", // all, today, thisWeek, thisMonth
    searchQuery: "",
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const handlelogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  // Fetch events from the server
  // Fetch events from the server
  const fetchEvents = async () => {
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/events";

      // Add query parameters if filters are set
      const params = new URLSearchParams();
      if (filter.category && filter.category !== "all")
        params.append("category", filter.category);
      params.append("sortBy", filter.sortBy);
      if (filter.date && filter.date !== "all")
        params.append("date", filter.date);
      if (filter.searchQuery) params.append("search", filter.searchQuery);

      if (params.toString()) url += `?${params.toString()}`;

      const response = await axios.get(url);
      setEvents(response.data.events || []);

      // Fetch user's favorites in a separate call
      const favoritesResponse = await axios.get(`${API_URL}/events/favorites`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      setFavorites(favoritesResponse.data.favorites || []);
    } catch (err) {
      setError("Failed to load events. Please try again later.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const handleRegister = async (eventId) => {
    try {
      await axios.post(
        `${API_URL}/events/${eventId}/register`,
        {},
        { withCredentials: true }
      );
      // Refresh events to update registration status
      fetchEvents();
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Failed to register for the event. Please try again.");
    }
  };

  const handleJoinWaitlist = async (eventId) => {
    try {
      await axios.post(
        `${API_URL}/events/${eventId}/waitlist`,
        {},
        { withCredentials: true }
      );
      // Refresh events to update waitlist status
      fetchEvents();
    } catch (err) {
      console.error("Waitlist join failed:", err);
      alert("Failed to join the waitlist. Please try again.");
    }
  };

  const toggleFavorite = async (eventId, e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const isFavorite = favorites.includes(eventId);
      const endpoint = isFavorite
        ? `${API_URL}/users/favorites/remove/${eventId}`
        : `${API_URL}/api/users/favorites/add/${eventId}`;

      await axios.post(endpoint, {}, { withCredentials: true });

      if (isFavorite) {
        setFavorites(favorites.filter((id) => id !== eventId));
      } else {
        setFavorites([...favorites, eventId]);
      }
    } catch (err) {
      console.error("Failed to update favorite status", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
        <Button className="mt-4" onClick={fetchEvents}>
          Retry
        </Button>
      </div>
    );
  }

  // Filter events if "favorites only" is enabled
  const displayedEvents = showFavoritesOnly
    ? events.filter((event) => favorites.includes(event._id))
    : events;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upcoming Events</h1>
        <button onClick={handlelogout} className="text-red-500 hover:underline">
          Logout
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex-1 w-full md:max-w-md">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search by event name or location..."
              value={filter.searchQuery}
              onChange={(e) =>
                setFilter({ ...filter, searchQuery: e.target.value })
              }
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="w-40">
            <Select
              value={filter.category}
              onValueChange={(value) =>
                setFilter({ ...filter, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
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

          <div className="w-40">
            <Select
              value={filter.date}
              onValueChange={(value) => setFilter({ ...filter, date: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="thisWeek">This Week</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <Select
              value={filter.sortBy}
              onValueChange={(value) => setFilter({ ...filter, sortBy: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date (Newest)</SelectItem>
                <SelectItem value="dateAsc">Date (Oldest)</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex items-center gap-1"
          >
            <Heart
              className={`w-4 h-4 ${
                showFavoritesOnly ? "fill-white text-white" : ""
              }`}
            />
            {showFavoritesOnly ? "All Events" : "Favorites"}
          </Button>
        </div>
      </div>

      {displayedEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((event) => {
            const isFavorite = favorites.includes(event._id);
            const capacityPercentage = event.capacity
              ? Math.round((event.participantsCount / event.capacity) * 100)
              : 0;
            const isFull =
              event.capacity && event.participantsCount >= event.capacity;
            const isRegistrationOpen =
              new Date(event.registrationClosesAt) > new Date();
            const imageUrl =
              event.image ||
              `https://random-image-pepebigotes.vercel.app/api/random-image`;

            return (
              <Card
                key={event._id}
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt={event.title}
                    className="w-full h-40 object-cover"
                  />
                  <button
                    onClick={(e) => toggleFavorite(event._id, e)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md"
                  >
                    {isFavorite ? (
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                    ) : (
                      <Heart className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                </div>

                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDateTime(event.date || event.startDate)}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(event.status)}>
                      {event.status?.charAt(0).toUpperCase() +
                        event.status?.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-600 line-clamp-3">
                    {event.description}
                  </p>

                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                      <span>{event.location || "Online"}</span>
                    </div>

                    {event.category && (
                      <div className="flex items-center">
                        <Tag className="w-4 h-4 mr-2 text-gray-500" />
                        <span>{event.category}</span>
                      </div>
                    )}

                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-500" />
                      <span>
                        {event.participantsCount ||
                          event.participants?.length ||
                          0}{" "}
                        / {event.capacity || "Unlimited"}
                      </span>
                    </div>

                    {event.capacity && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Capacity</span>
                          <span>{capacityPercentage}% filled</span>
                        </div>
                        <SimpleProgress
                          value={capacityPercentage}
                          className="h-1"
                        />
                      </div>
                    )}

                    {event.registrationClosesAt && (
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-xs">
                          Registration{" "}
                          {isRegistrationOpen ? "closes" : "closed"}:{" "}
                          {formatDateTime(event.registrationClosesAt)}
                        </span>
                      </div>
                    )}
                  </div>

                  {event.price !== undefined && (
                    <div className="font-medium">
                      {event.price ? `$${event.price.toFixed(2)}` : "Free"}
                    </div>
                  )}
                </CardContent>

                <CardFooter>
                  <div className="flex justify-end items-center w-full gap-2">
                    {isRegistrationOpen ? (
                      <>
                        {event.isRegistered ? (
                          <Button variant="outline" disabled>
                            Registered
                          </Button>
                        ) : event.isWaitlisted ? (
                          <Button variant="outline" disabled>
                            On Waitlist
                          </Button>
                        ) : isFull ? (
                          <Button onClick={() => handleJoinWaitlist(event._id)}>
                            Join Waitlist
                          </Button>
                        ) : (
                          <Button onClick={() => handleRegister(event._id)}>
                            Register Now
                          </Button>
                        )}
                      </>
                    ) : (
                      <Button disabled>Registration Closed</Button>
                    )}

                    <Button
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={(e) => toggleFavorite(event._id, e)}
                    >
                      {isFavorite ? (
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      ) : (
                        <Heart className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-700">No events found</h3>
          <p className="text-gray-500 mt-2">
            {showFavoritesOnly
              ? "You haven't favorited any events yet."
              : "There are no events matching your criteria at the moment."}
          </p>
          {showFavoritesOnly && (
            <Button
              className="mt-4"
              onClick={() => setShowFavoritesOnly(false)}
            >
              View All Events
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppUser;
