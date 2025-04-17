import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, Tag, Clock, Heart } from "lucide-react";
import { formatDateTime } from "../../admin/utils/cn";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import axios from "axios";
import { API_URL } from "../../admin/config/constants";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const EventCard = ({ event }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if event is favorited by current user
    const checkFavoriteStatus = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/users/favorites/check/${event._id}`,
          { withCredentials: true }
        );
        setIsFavorite(response.data.isFavorite);
      } catch (err) {
        console.error("Failed to check favorite status", err);
      }
    };

    checkFavoriteStatus();
  }, [event._id]);

  const toggleFavorite = async (e) => {
    e.preventDefault(); // Prevent card navigation
    e.stopPropagation();

    try {
      const endpoint = isFavorite
        ? `${API_URL}/users/favorites/remove/${event._id}`
        : `${API_URL}/users/favorites/add/${event._id}`;

      await axios.post(endpoint, {}, { withCredentials: true });
      setIsFavorite(!isFavorite);
      
      // Show toast notification
      toast.success(
        `Event ${isFavorite ? "removed from" : "added to"} favorites`
      );
    } catch (err) {
      console.error("Failed to update favorite status", err);
      toast.error("Failed to update favorite status");
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

  const imageUrl =
    event.image ||
    `https://random-image-pepebigotes.vercel.app/api/random-image`;

  const capacityPercentage = event.capacity
    ? Math.round((event.participantsCount / event.capacity) * 100)
    : 0;

  const isRegistrationOpen = new Date(event.registrationClosesAt) > new Date();
  const isFull = event.capacity && event.participantsCount >= event.capacity;

  return (
    <Card className="overflow-hidden hover:shadow-lg w-120">
      <div className="relative">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-56 object-cover rounded-t-md"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-200 transition-all cursor-pointer"
        >
          {isFavorite ? (
            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
          ) : (
            <Heart className="w-5 h-5 text-gray-500" />
          )}
        </button>
      </div>
      <CardHeader className="px-4 py-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-gray-800">{event.title}</CardTitle>
          <span
            className={`${getStatusColor(event.status)} px-3 py-1 rounded-full text-xs font-medium`}
          >
            {event.status}
          </span>
        </div>
        {event.description && (
          <CardDescription className="text-sm text-gray-600 line-clamp-2">{event.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="px-4 py-2 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-5 h-5 mr-2" />
          <span>{formatDateTime(event.date)}</span>
        </div>

        {event.location && (
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{event.location}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-500">
          <Users className="w-5 h-5 mr-2" />
          <span>
            {event.participantsCount || 0} / {event.capacity || "Unlimited"}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Capacity</span>
            <span>{capacityPercentage}% filled</span>
          </div>
          <Progress value={capacityPercentage} className="h-1" />
        </div>

        <div className="flex items-center text-sm text-gray-500">
          <Clock className="w-5 h-5 mr-2" />
          <span>
            Registration {isRegistrationOpen ? "closes" : "closed"}: {formatDateTime(event.registrationClosesAt)}
          </span>
        </div>

        {event.category && (
          <div className="flex items-center text-sm text-gray-500">
            <Tag className="w-5 h-5 mr-2" />
            <span>{event.category}</span>
          </div>
        )}

        <div className="mt-2">
          {event.autoApprove !== undefined && (
            <Badge
              variant={event.autoApprove ? "success" : "outline"}
              className="mr-2"
            >
              {event.autoApprove ? "Auto-approve: On" : "Auto-approve: Off"}
            </Badge>
          )}
          {isFull && isRegistrationOpen && (
            <Badge variant="warning">Waitlist Available</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3">
        <Link to={`/events/${event._id}`} className="block">
          <button variant="outline" className="w-full p-3 text-md text-[#ff6196] border border-[#19105b] rounded-md hover:bg-[#19105b] hover:text-white cursor-pointer">
            View Details
          </button>
        </Link>
      </CardFooter>
      <ToastContainer /> {/* Add ToastContainer here */}
    </Card>
  );
};

export default EventCard;