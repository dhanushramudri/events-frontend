import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../admin/config/constants';
import EventCard from '../components/EventCard';

const RegisteredEvents = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        const userData = response.data;
        console.log("userData", userData);

        // Assuming registeredEvents is an array of event IDs
        // console.log("userData.registeredEvents", userData.user.registeredEvents);
        if (userData.user.registeredEvents && userData.user.registeredEvents.length > 0) {
            console.log("userData.registeredEvents", userData.registeredEvents);
          const eventsPromises = userData.user.registeredEvents?.map(eventId =>
            axios.get(`${API_URL}/events/${eventId}`)
          );

          const eventsResponses = await Promise.all(eventsPromises);
          const events = eventsResponses.map(res => res.data);
          setRegisteredEvents(events);
        } else {
          setRegisteredEvents([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log("registeredEvents", registeredEvents);
  return (
    <div>
      <h1>Registered Events</h1>
      {registeredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {registeredEvents.map(event => (
            <EventCard key={event._id} event={event.event} />
          ))}
        </div>
      ) : (
        <p>No registered events found.</p>
      )}
    </div>
  );
};

export default RegisteredEvents;