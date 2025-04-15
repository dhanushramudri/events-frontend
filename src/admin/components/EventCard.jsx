import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, MapPin, Tag, Clock, Heart } from "lucide-react";
import { formatDateTime } from "../utils/cn";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import axios from "axios";
import { API_URL } from "../config/constants";
import toast from "react-hot-toast";
import { ToastContainer } from "react-toastify";

const EventCard = ({ event }) => {
  // console.log("event", event);
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
        toast.success(
          `Event ${response.data.isFavorite ? "added to" : "removed from"} favorites`
        );
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
      toast.success(
        `Event ${isFavorite ? "removed from" : "added to"} favorites`
      );
      alert("Event updated successfully!");
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

  const imageUrl =
    event.image ||
    `https://random-image-pepebigotes.vercel.app/api/random-image`;

  const capacityPercentage = event.capacity
    ? Math.round((event.participantsCount / event.capacity) * 100)
    : 0;

  const isRegistrationOpen = new Date(event.registrationClosesAt) > new Date();
  const isFull = event.capacity && event.participantsCount >= event.capacity;

  return (

    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={imageUrl}
          alt={event.title}
          className="w-full h-40 object-cover"
        />
        <button
          onClick={toggleFavorite}
          className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md"
        >
          {isFavorite ? (
            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
          ) : (
            <Heart className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
          <span
            className={`${getStatusColor(
              event.status
            )} px-2 py-1 rounded-full text-xs font-medium capitalize`}
          >
            {event.status}
          </span>
        </div>
        {event.description && (
          <CardDescription className="line-clamp-2">
            {event.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-2 pt-0">
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <span>{formatDateTime(event.date)}</span>
        </div>

        {event.location && (
          <div className="flex items-center text-sm">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <span>{event.location}</span>
          </div>
        )}

        <div className="flex items-center text-sm">
          <Users className="h-4 w-4 mr-2 text-gray-500" />
          <span>
            {event.participantsCount || 0} / {event.capacity || "Unlimited"}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span>Capacity</span>
            <span>{capacityPercentage}% filled</span>
          </div>
          <Progress value={capacityPercentage} className="h-1" />
        </div>

        <div className="flex items-center text-sm">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span>
            Registration {isRegistrationOpen ? "closes" : "closed"}:{" "}
            {formatDateTime(event.registrationClosesAt)}
          </span>
        </div>

        {event.category && (
          <div className="flex items-center text-sm">
            <Tag className="h-4 w-4 mr-2 text-gray-500" />
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

      <CardFooter className="pt-2 flex gap-2">
        <Link to={`/events/${event._id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
        <Link to={`/events/${event._id}/participants`} className="flex-1">
          <Button variant="secondary" className="w-full">
            Participants
          </Button>
        </Link>
      </CardFooter>

    </Card>
  );
};

export default EventCard;
