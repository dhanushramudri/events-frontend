import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; // Using react-hot-toast instead of Chakra UI
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
import { API_URL } from "../config/constants";
 
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
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    
    try {
      const res = await fetch(
`https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (!res.ok) {
        throw new Error("Cloudinary upload failed");
      }
      
      const data = await res.json();
      return data.secure_url;
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Image upload failed. Please try again.");
      return "";
    }
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Create a loading toast that will be dismissed on success or error
    const toastId = toast.loading("Creating event...");
    
    try {
      const imageUrl = await handleImageUpload();
      
      const payload = {
        ...eventData,
        image: imageUrl,
        status: "upcoming",
      };
      
await axios.post(`${API_URL}/events/admin/events`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        withCredentials: true,
      });
      
      // Dismiss the loading toast and show success toast
      toast.dismiss(toastId);
      toast.success("Event created successfully!");
      
      navigate("/events");
    } catch (error) {
      console.error("Error creating event:", error);
      
      // Dismiss the loading toast and show error toast
      toast.dismiss(toastId);
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
            <Label htmlFor="registrationClosesAt">
              Registration Closes At
            </Label>
            <Input
              type="date"
              id="registrationClosesAt"
              name="registrationClosesAt"
              value={eventData.registrationClosesAt}
              onChange={handleChange}
              required
max={eventData.date || undefined}
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
            <Label htmlFor="time">Time</Label>
            <Input
              type="time"
              id="time"
              name="time"
              value={eventData.time}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        
        <div>
          <Label
            htmlFor="autoApprove"
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="checkbox"
              id="autoApprove"
              name="autoApprove"
              checked={eventData.autoApprove}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <span>Auto-approve participants</span>
          </Label>
        </div>
        
        <div>
          <Label htmlFor="image">Upload Banner Image</Label>
          <Input
            type="file"
            id="image"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        
        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Creating..." : "Create Event"}
        </Button>
      </form>
    </div>
  );
};
 
export default CreateEvent;