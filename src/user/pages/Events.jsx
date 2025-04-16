import React, { useEffect, useState, useMemo } from "react";
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
import { Button } from "../../admin/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../admin/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../admin/components/ui/select";
import { Badge } from "../../admin/components/ui/badge";
import { Input } from "../../admin/components/ui/input";
import { formatDateTime } from "../../admin/utils/cn";
import { API_URL } from "../../admin/config/constants";
import {Link} from "react-router-dom";

// Simple Progress Component
const SimpleProgress = ({ value, className }) => {
  const percentage = value !== undefined ? Math.min(Math.max(value, 0), 100) : 0;
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


  console.log("favorites", favorites);
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
        console.log("user participants", participantsRes.data.participants);
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
        // Search
        const matchesSearch =
          event.title.toLowerCase().includes(filter.searchQuery.toLowerCase()) ||
          (event.location &&
            event.location
              .toLowerCase()
              .includes(filter.searchQuery.toLowerCase()));
        // Category
        const matchesCategory =
          filter.category === "all" || event.category === filter.category;
        // Date
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

  // Show only favorites if toggled
  const displayedEvents = showFavoritesOnly
    ? filteredEvents.filter((event) => favorites.includes(event._id))
    : filteredEvents;

  // Fixed isUserRegistered function that properly compares event IDs
  const isUserRegistered = (eventId) => {
    return userParticipants.some((participant) => {
      // Extract the event ID regardless of its format
      const participantEventId = participant.eventId?._id || // For nested object with _id
                                participant.eventId?.$oid || // For MongoDB format with $oid
                                (typeof participant.eventId === 'string' ? participant.eventId : null); // For string format
      
      // Compare with the event ID param
      return participantEventId === eventId;
    });
  };

  // Registration, waitlist, and favorite handlers
  const handleRegister = async (eventId) => {
    try {
      await axios.post(
        `${API_URL}/events/${eventId}/register`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      alert("Registration successful");
      // Update local state to reflect registration
      const event = allEvents.find(e => e._id === eventId);
      if (event) {
        setUserParticipants(prev => [...prev, {
          eventId: {
            _id: eventId,
            title: event.title,
          },
          status: "approved"
        }]);
      }
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Failed to register for the event. Please try again.");
    }
  };

  const handleJoinWaitlist = async (eventId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/events/${eventId}/waitlist`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      alert("Joined waitlist!");
      // Optionally update local state to reflect waitlist status
      const event = allEvents.find(e => e._id === eventId);
      if (event) {
        setUserParticipants(prev => [...prev, {
          eventId: {
            _id: eventId,
            title: event.title,
          },
          status: "waitlist"
        }]);
      }
    } catch (err) {
      console.error("Waitlist join failed:", err);
      alert("Failed to join the waitlist. Please try again.");
    }
  };
  const toggleFavorite = async (eventId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if the event is already a favorite
    const isFavorite = favorites.some(favorite => favorite._id === eventId);
    console.log("isFavorite", isFavorite);
  
    // Construct the API endpoint based on the favorite status
    const endpoint = isFavorite
      ? `${API_URL}/users/favorites/remove/${eventId}`
      : `${API_URL}/users/favorites/add/${eventId}`;  
  
    // Optimistically update the favorites state
    const updatedFavorites = isFavorite
      ? favorites.filter((favorite) => favorite._id !== eventId)
      : [...favorites, { _id: eventId }]; // Assuming you want to keep the same structure
  
    setFavorites(updatedFavorites);
  
    try {
      await axios.post(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Failed to update favorite status", err);
      // Revert the favorites state if the request fails
      setFavorites(favorites);
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
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="text-red-500 hover:underline"
        >
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
                setFilter((prev) => ({
                  ...prev,
                  searchQuery: e.target.value,
                }))
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
                setFilter((prev) => ({ ...prev, category: value }))
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
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, date: value }))
              }
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
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, sortBy: value }))
              }
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
            onClick={() => setShowFavoritesOnly((prev) => !prev)}
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
            console.log("event id", event._id);
            const isFavorite = favorites.some(favorite => favorite._id === event._id);
            console.log("isFavorite", isFavorite);
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
            const isRegistered = isUserRegistered(event._id);

            return (
              <Link to={`/events/${event._id}`} className="flex-1">

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
                        {isRegistered ? (
                          <Button variant="outline" disabled>
                            Registered
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
                      <Button variant="outline" disabled>
                        Registration Closed
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-10">No events found.</div>
      )}
    </div>
  );
};

export default Events;