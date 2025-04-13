import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { toast } from "react-toastify";

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    registrationClosesAt: "",
    time: "",
    location: "",
    category: "",
    status: "upcoming",
    capacity: 0,
    autoApprove: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEventData({
      ...eventData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "your_preset_name"); // Replace with your Cloudinary preset

    try {
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload", // Replace with your Cloudinary info
        formData
      );
      return res.data.secure_url;
    } catch (error) {
      toast.error("Image upload failed");
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrl = await handleImageUpload();

      const payload = {
        ...eventData,
        image: imageUrl,
      };

      await axios.post(
        "http://localhost:5000/api/events/admin/events",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Event created successfully!");
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <h1 className="text-3xl font-bold text-center">Create New Event</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label htmlFor="date">Event Date</Label>
            <Input
              type="date"
              id="date"
              name="date"
              value={eventData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="w-1/2">
            <Label htmlFor="registrationClosesAt">Registration Closes At</Label>
            <Input
              type="date"
              id="registrationClosesAt"
              name="registrationClosesAt"
              value={eventData.registrationClosesAt}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={eventData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div className="w-1/2">
            <Label htmlFor="capacity">Capacity</Label>
            <Input
              type="number"
              id="capacity"
              name="capacity"
              value={eventData.capacity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-1/2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={eventData.category}
              onValueChange={(value) =>
                setEventData({ ...eventData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Conference">Conference</SelectItem>
                <SelectItem value="Workshop">Workshop</SelectItem>
                <SelectItem value="Seminar">Seminar</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-1/2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={eventData.status}
              onValueChange={(value) =>
                setEventData({ ...eventData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="autoApprove" className="flex items-center gap-2">
            <input
              type="checkbox"
              name="autoApprove"
              checked={eventData.autoApprove}
              onChange={handleChange}
            />
            Auto-approve participants
          </Label>
        </div>

        <div>
          <Label htmlFor="image">Upload Banner Image</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </div>
  );
};

export default CreateEvent;
