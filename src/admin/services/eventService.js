// services/eventService.js
import axios from "axios";
import { API_URL } from "../config/constants";

// Get all events with optional filtering
export const getEvents = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/events/admin/events`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

// Get single event by ID
export const getEventById = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/admin/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${eventId}:`, error);
    throw error;
  }
};

// Create new event
export const createEvent = async (eventData) => {
  try {
    const response = await axios.post(`${API_URL}/admin/events`, eventData);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Update existing event
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await axios.put(
      `${API_URL}/admin/events/${eventId}`,
      eventData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating event ${eventId}:`, error);
    throw error;
  }
};

// Delete event
export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${API_URL}/admin/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting event ${eventId}:`, error);
    throw error;
  }
};

// Get participants for an event
export const getEventParticipants = async (eventId) => {
  try {
    const response = await axios.get(
      `${API_URL}/admin/events/${eventId}/participants`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching participants for event ${eventId}:`, error);
    throw error;
  }
};

// Approve a participant for an event
export const approveParticipant = async (eventId, userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/events/${eventId}/participants/${userId}/approve`
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error approving participant ${userId} for event ${eventId}:`,
      error
    );
    throw error;
  }
};

// Send notification to event participants
export const sendEventNotification = async (eventId, notificationData) => {
  try {
    const response = await axios.post(
      `${API_URL}/admin/events/${eventId}/notifications`,
      notificationData
    );
    return response.data;
  } catch (error) {
    console.error(`Error sending notification for event ${eventId}:`, error);
    throw error;
  }
};

// Get analytics data
export const getAnalytics = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/analytics/admin`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
};
