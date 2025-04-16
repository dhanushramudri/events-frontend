import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Users,
  MapPin,
  Tag,
  Loader2,
  Clock,
  Heart,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { formatDateTime } from "../../admin/utils/cn";
import { API_URL } from "../../admin/config/constants";
import { Button } from "../components/ui/button";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/${eventId}`);
        if (!res.data.event) {
          setError("Event not found.");
          return;
        }
        setEvent(res.data.event);
        checkFavoriteStatus();
        checkRegistrationStatus();
      } catch {
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/events/favorites/check/${eventId}`,
          { withCredentials: true }
        );
        setIsFavorite(res.data.isFavorite);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    const checkRegistrationStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/participants`, {
          withCredentials: true,
        });
        console.log("res is ", res.data.participants);
    
        // Use map to iterate through participants and check registration status
        const registered = res.data.participants.map((participant) => {
          return participant.eventId._id === eventId;
        }).includes(true); // Check if any of the results are true
    
        setIsRegistered(registered);
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };
    
    // Log the registration status
    console.log("registered status is", isRegistered);
    fetchEvent();
  }, [eventId]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const endpoint = isFavorite
      ? `${API_URL}/users/favorites/remove/${eventId}`
      : `${API_URL}/users/favorites/add/${eventId}`;

    try {
      await axios.post(endpoint, {}, { withCredentials: true });
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Failed to update favorite status", error);
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(
        `${API_URL}/events/${eventId}/register`,
        {},
        { withCredentials: true }
      );
      setIsRegistered(true);
      alert("Registration successful!");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Failed to register for the event. Please try again.");
    }
  };

  const handleJoinWaitlist = async () => {
    try {
      await axios.post(
        `${API_URL}/events/${eventId}/waitlist`,
        {},
        { withCredentials: true }
      );
      alert("Joined waitlist!");
    } catch (error) {
      console.error("Waitlist join failed:", error);
      alert("Failed to join the waitlist. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto mt-6 px-4">
        <Card className="border-red-200">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-red-100 p-3 mb-4">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-red-600">
              Unable to load event
            </h3>
            <p className="text-muted-foreground text-center mt-2">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-2 sm:p-4">
      <Card className="overflow-hidden border-none shadow-lg">
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 sm:h-72 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/40"></div>

          <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white rounded-full p-2 shadow-lg">
            <Heart
              onClick={toggleFavorite}
              className={`w-4 h-4 sm:w-5 sm:h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-blue-500"}`}
            />
          </div>
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <Badge variant="outline" className="mb-2 text-xs">
                {event.category}
              </Badge>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">
                {event.title}
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-base sm:text-lg text-muted-foreground mb-4">
            {event.description}
          </div>

          <Separator className="my-4 sm:my-6" />

          <div className="grid grid-cols-1 gap-4">
            <Card className="border shadow-sm">
              <CardHeader className="py-2 sm:py-3">
                <CardTitle className="text-sm sm:text-base">
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDateTime(event.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{event.category}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="py-2 sm:py-3">
                <CardTitle className="text-sm sm:text-base">
                  Registration Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{`${event.capacity} participants`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{`Registration closes: ${formatDateTime(event.registrationClosesAt)}`}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium">Auto-Approve:</span>
                  <Badge variant={event.autoApprove ? "success" : "secondary"}>
                    {event.autoApprove ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-4">
            {isRegistered ? (
              <Button variant="outline" disabled>
                Registered
              </Button>
            ) : event.participantsCount >= event.capacity ? (
              <Button onClick={handleJoinWaitlist}>
                Join Waitlist
              </Button>
            ) : (
              <Button onClick={handleRegister}>
                Register Now
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;