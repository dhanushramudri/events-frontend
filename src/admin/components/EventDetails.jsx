// EventDetails.jsx
import React, { useEffect, useState, useCallback } from "react";
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
  Pencil,
  Upload,
  Save,
  X,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { formatDateTime } from "../utils/cn";
import { API_URL } from "../config/constants";

const EditableTextField = ({
  label,
  field,
  icon,
  type = "text",
  value,
  editMode,
  onChange,
  onSave,
  onToggle,
}) => (
  <div className="flex items-center gap-2 text-sm w-full">
    {icon}
    {editMode ? (
      <>
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="border rounded px-2 py-1 text-sm w-full"
        />
        <Button size="sm" onClick={() => onSave(field)}>
          <Save className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onToggle(field)}>
          <X className="w-4 h-4" />
        </Button>
      </>
    ) : (
      <div className="flex justify-between w-full">
        <span>{label}</span>
        <Pencil
          className="w-4 h-4 text-muted-foreground cursor-pointer"
          onClick={() => onToggle(field)}
        />
      </div>
    )}
  </div>
);

const EditableSelect = ({
  label,
  field,
  value,
  editMode,
  onChange,
  onSave,
  onToggle,
}) => (
  <div className="flex items-center gap-2 text-sm w-full">
    <span>Auto-Approve:</span>
    {editMode ? (
      <>
        <select
          value={value}
          onChange={(e) => onChange(field, e.target.value === "true")}
          className="border px-2 py-1 rounded"
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
        <Button size="sm" onClick={() => onSave(field)}>
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onToggle(field)}>
          Cancel
        </Button>
      </>
    ) : (
      <>
        <span>{value ? "Yes" : "No"}</span>
        <Pencil
          className="w-4 h-4 cursor-pointer"
          onClick={() => onToggle(field)}
        />
      </>
    )}
  </div>
);

const EditableImageUpload = ({
  imageUrl,
  editMode,
  onChange,
  onSave,
  onToggle,
}) => (
  <div className="absolute bottom-2 right-4">
    {editMode ? (
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files[0])}
          className="text-xs"
        />
        <Button size="sm" onClick={onSave}>
          Save
        </Button>
        <Button size="sm" variant="ghost" onClick={onToggle}>
          Cancel
        </Button>
      </div>
    ) : (
      <Upload
        className="w-5 h-5 cursor-pointer text-white"
        onClick={onToggle}
      />
    )}
  </div>
);

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [editMode, setEditMode] = useState({});
  const [editValues, setEditValues] = useState({});
  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`${API_URL}/events/${eventId}`);
        console.log("res is ", res.data.event);
        if (!res.data.event) {
          setError("Event not found.");
          return;
        }
        setEvent(res.data.event);
        setEditValues(res.data.event);

        const favRes = await axios.get(
          `${API_URL}/users/favorites/check/${eventId}`,
          {
            withCredentials: true,
          }
        );
        setIsFavorite(favRes.data.isFavorite);
      } catch {
        setError("Failed to fetch event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const toggleFavorite = async () => {
    try {
      const endpoint = isFavorite
        ? `${API_URL}/users/favorites/remove/${eventId}`
        : `${API_URL}/users/favorites/add/${eventId}`;

      await axios.post(endpoint, {}, { withCredentials: true });
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error("Failed to update favorite status", err);
    }
  };

  const handleFieldChange = useCallback((field, value) => {
    setEditValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleEdit = useCallback((field) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  }, []);

  const saveField = async (field) => {
    try {
      let payload = { [field]: editValues[field] };

      if (field === "image" && newImage) {
        const formData = new FormData();
        formData.append("file", newImage);
        formData.append("upload_preset", "your_upload_preset");
        const res = await axios.post(
          "https://api.cloudinary.com/v1_1/your_cloud_name/image/upload",
          formData
        );
        payload.image = res.data.secure_url;
      }

      await axios.put(`${API_URL}/events/admin/events/${eventId}`, payload, {
        withCredentials: true,
      });

      const updated = await axios.get(`${API_URL}events/${eventId}`);
      setEvent(updated.data.event);
      setEditValues(updated.data.event);
      toggleEdit(field);
      setNewImage(null);
    } catch (err) {
      console.error("Failed to save field", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <div className="relative">
          <img
            src={newImage ? URL.createObjectURL(newImage) : event.image}
            alt="Event"
            className="w-full h-60 object-cover rounded-t-md"
          />
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md"
            onClick={toggleFavorite}
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </button>

          <EditableImageUpload
            imageUrl={event.image}
            editMode={editMode.image}
            onChange={setNewImage}
            onSave={() => saveField("image")}
            onToggle={() => toggleEdit("image")}
          />
        </div>

        <CardHeader>
          <CardTitle className="text-2xl">
            <EditableTextField
              label={event.title}
              field="title"
              icon={null}
              value={editValues.title}
              editMode={editMode.title}
              onChange={handleFieldChange}
              onSave={saveField}
              onToggle={toggleEdit}
            />
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <EditableTextField
            label={event.description}
            field="description"
            icon={null}
            value={editValues.description}
            editMode={editMode.description}
            onChange={handleFieldChange}
            onSave={saveField}
            onToggle={toggleEdit}
          />
          <EditableTextField
            label={formatDateTime(event.date)}
            field="date"
            icon={<Calendar className="w-4 h-4" />}
            type="datetime-local"
            value={editValues.date}
            editMode={editMode.date}
            onChange={handleFieldChange}
            onSave={saveField}
            onToggle={toggleEdit}
          />
          <EditableTextField
            label={event.location}
            field="location"
            icon={<MapPin className="w-4 h-4" />}
            value={editValues.location}
            editMode={editMode.location}
            onChange={handleFieldChange}
            onSave={saveField}
            onToggle={toggleEdit}
          />
          <EditableTextField
            label={event.category}
            field="category"
            icon={<Tag className="w-4 h-4" />}
            value={editValues.category}
            editMode={editMode.category}
            onChange={handleFieldChange}
            onSave={saveField}
            onToggle={toggleEdit}
          />
          <EditableTextField
            label={event.capacity}
            field="capacity"
            icon={<Users className="w-4 h-4" />}
            type="number"
            value={editValues.capacity}
            editMode={editMode.capacity}
            onChange={handleFieldChange}
            onSave={saveField}
            onToggle={toggleEdit}
          />
          <EditableTextField
            label={formatDateTime(event.registrationClosesAt)}
            field="registrationClosesAt"
            icon={<Clock className="w-4 h-4" />}
            type="datetime-local"
            value={editValues.registrationClosesAt}
            editMode={editMode.registrationClosesAt}
            onChange={handleFieldChange}
            onSave={saveField}
            onToggle={toggleEdit}
          />
          <EditableSelect
            label="Auto-Approve"
            field="autoApprove"
            value={editValues.autoApprove}
            editMode={editMode.autoApprove}
            onChange={handleFieldChange}
            onSave={saveField}
            onToggle={toggleEdit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
