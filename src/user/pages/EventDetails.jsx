import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Calendar,
  Users,
  MapPin,
  Tag,
  Loader2,
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
import { sendAutoReplyEmail } from "../../admin/utils/emailSender"; // Import email sending function
import Countdown from "../components/Countdown"; // Import Countdown Timer

import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils/toast";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState(null);
  const [isWithdrawn, setIsWithdrawn] = useState(false);
  const [canWithdraw, setCanWithdraw] = useState(true); // State to manage withdrawal permission

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/${eventId}`);
        if (!res.data.event) {
          setError("Event not found.");
          return;
        }
        setEvent(res.data.event);
        checkRegistrationStatus();
        checkWithdrawalEligibility(res.data.event.date); // Check if withdrawal is allowed
      } catch {
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };

    const checkRegistrationStatus = async () => {
      try {
        const res = await axios.get(`${API_URL}/user/participants`, {
          withCredentials: true,
        });

        let registered = false;
        let foundWaitlistParticipant = false;

        res.data.participants.forEach(participant => {
          if (participant.eventId._id === eventId) {
            if (participant.queuePosition === -1) {
              setIsWithdrawn(true); // User has withdrawn
              registered = false; // Ensure registered is false
            } else {
              registered = true; // User is registered for the event
              foundWaitlistParticipant = true; // User is on the waitlist
              setWaitlistPosition(participant.queuePosition);
            }
          }
        });

        setIsRegistered(registered);
        if (!foundWaitlistParticipant) {
          setWaitlistPosition(null); // Reset if no waitlist participant found
        }
      } catch (error) {
        console.error("Error checking registration status:", error);
      }
    };

    const checkWithdrawalEligibility = (eventDate) => {
      const now = new Date();
      const eventStart = new Date(eventDate);
      const timeDifference = eventStart - now; // time difference in milliseconds
      const twelveHoursInMs = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

      // If the event is within 12 hours, disable withdrawal
      setCanWithdraw(timeDifference > twelveHoursInMs);
    };

    fetchEvent();
  }, [eventId, isRegistered, isWithdrawn, waitlistPosition]);

  const handleRegister = async () => {
    try {
      await axios.post(
        `${API_URL}/events/${eventId}/register`,
        {},
        { withCredentials: true }
      );

      const userResponse = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
      const user = userResponse.data;

      setIsRegistered(true);
      // alert("Registration successful!");
      handleSuccess("Registration successful!");

      try {
        await sendAutoReplyEmail({
          toName: user.name,
          toEmail: user.email,
          eventName: event.title,
        });
        console.log('Confirmation email sent successfully!');
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // alert("Failed to send confirmation email. Please check console for details.");
        // handleError("Failed to send confirmation email. Please check console for details.");
      }
    } catch (error) {
      console.error("Registration failed:", error);
      // alert("Failed to register for the event. Please try again.");
      handleError("Failed to register for the event. Please try again.");
    }
  };

  const handleJoinWaitlist = async () => {
    try {
      await axios.post(
        `${API_URL}/events/${eventId}/waitlist`,
        {},
        { withCredentials: true }
      );
      setWaitlistPosition(event.waitlistCount + 1);
      // alert("You have been added to the waitlist!");
      handleSuccess("You have been added to the waitlist!");
    } catch (error) {
      console.error("Waitlist join failed:", error);
      // alert("Failed to join the waitlist. Please try again.");
      handleError("Failed to join the waitlist. Please try again.");
    }
  };

  const handleWithdraw = async () => {
    if (!canWithdraw) {
      // alert("You cannot withdraw within 12 hours of the event.");
      handleError("You cannot withdraw within 12 hours of the event.");
      return;
    }

    if (waitlistPosition === -1) {
      // alert("You have already withdrawn from the event.");
      handleError("You have already withdrawn from the event.");
      return;
    }

    try {
      await axios.post(
        `${API_URL}/events/${eventId}/withdraw`,
        {},
        { withCredentials: true }
      );
      setIsRegistered(false);
      // alert("You have successfully withdrawn from the event.");
      handleSuccess("You have successfully withdrawn from the event.");
    } catch (error) {
      console.error("Withdrawal failed:", error);
      // alert("Failed to withdraw from the event. Please try again.");
      handleError("Failed to withdraw from the event. Please try again.");
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
      <ToastContainer />
      {/* Countdown Timer Above the Image */}
      <div className="flex justify-between items-center">
        <Countdown targetDate={event.date} />
      </div>

      <Card className="overflow-hidden ">
        <div className="relative">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-48 sm:h-72 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/40"></div>
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
            {/* Event Details Card with smaller size and blue left border */}
            <Card className="border-l-4 border-blue-500 w-80 sm:w-96 mx-auto">
              <CardHeader className="py-2 sm:py-3">
                <CardTitle className="text-sm sm:text-base">
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-4">
                <div className="flex gap-2 items-center text-sm sm:text-base">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{formatDateTime(event.date)}</span>
                </div>

                <div className="flex gap-2 items-center text-sm sm:text-base">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>{event.location}</span>
                </div>

                <div className="flex gap-2 items-center text-sm sm:text-base">
                  <Users className="w-5 h-5 text-primary" />
                  <span>
                    {event.participantsCount} / {event.capacity} people
                  </span>
                </div>

                {event.participantsCount < event.capacity ? (
                  <div className="flex gap-2 items-center text-sm sm:text-base">
                    <Tag className="w-5 h-5 text-primary" />
                    <span>{event.capacity - event.participantsCount} Vacancies Left</span>
                  </div>
                ) : waitlistPosition !== null ? (
                  <div className="flex gap-2 items-center text-sm sm:text-base">
                    <Tag className="w-5 h-5 text-primary" />
                    <span>You are number {waitlistPosition} on the waitlist</span>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center text-sm sm:text-base">
                    <Tag className="w-5 h-5 text-primary" />
                    <span>Event is full</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Registration and Waitlist Button Below */}
      <div className="flex justify-center">
        {isRegistered ? (
          <Button variant="outline" onClick={handleWithdraw} disabled={!canWithdraw}>
            Withdraw
          </Button>
        ) : waitlistPosition !== null ? (
          <Button variant="outline" disabled>
            Waitlisted
          </Button>
        ) : isWithdrawn ? (
          <Button variant="outline" disabled>
            Cannot Register (Withdrawn)
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
    </div>
  );
};

export default EventDetails;
