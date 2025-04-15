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
  Info,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/Button.jsx";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
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
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm w-full group p-2 rounded-md hover:bg-gray-50 transition-colors">
    {icon && <div className="text-primary">{icon}</div>}
    {editMode ? (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(field, e.target.value)}
          className="border rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-primary focus:outline-none"
          autoFocus
        />
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSave(field)}
            className="flex items-center gap-1 w-full sm:w-auto justify-center"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggle(field)}
            className="flex items-center gap-1 w-full sm:w-auto justify-center"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Button>
        </div>
      </div>
    ) : (
      <div className="flex justify-between w-full items-center">
        <span className="text-base break-words">{label}</span>
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={() => onToggle(field)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
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
  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-sm w-full group p-2 rounded-md hover:bg-gray-50 transition-colors">
    <div className="text-primary">
      <Info className="w-4 h-4" />
    </div>
    {editMode ? (
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">Auto-Approve:</span>
          <select
            value={value}
            onChange={(e) => onChange(field, e.target.value === "true")}
            className="border px-3 py-2 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onSave(field)}
            className="flex items-center gap-1 w-full sm:w-auto justify-center"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onToggle(field)}
            className="flex items-center gap-1 w-full sm:w-auto justify-center"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </Button>
        </div>
      </div>
    ) : (
      <div className="flex justify-between w-full items-center">
        <div className="flex items-center gap-2">
          <span className="text-base font-medium">Auto-Approve:</span>
          <Badge variant={value ? "success" : "secondary"}>
            {value ? "Yes" : "No"}
          </Badge>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onToggle(field)}
        >
          <Pencil className="w-4 h-4" />
        </Button>
      </div>
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
  <div className="absolute bottom-4 right-4">
    {editMode ? (
      <div className="bg-white p-2 rounded-lg shadow-lg flex flex-col sm:flex-row items-center gap-2">
        <div className="flex items-center justify-center w-full">
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-gray-50 border rounded-md px-2 py-1 text-xs flex items-center justify-center w-full"
          >
            <span>Choose file</span>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={(e) => onChange(e.target.files[0])}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={onSave}
            className="whitespace-nowrap w-full"
          >
            <Save className="w-4 h-4 mr-1" /> Save
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggle}
            className="w-full"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ) : (
      <Button
        size="sm"
        variant="outline"
        className="bg-white/80 backdrop-blur-sm hover:bg-white transition-colors text-xs p-2"
        onClick={onToggle}
      >
        <Upload className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Change Image</span>
      </Button>
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

      const updated = await axios.get(`${API_URL}/events/${eventId}`);
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
              <X className="h-6 w-6 text-red-600" />
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
            src={newImage ? URL.createObjectURL(newImage) : event.image}
            alt={event.title}
            className="w-full h-48 sm:h-72 md:h-80 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/40"></div>

          <Button
            className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-white hover:bg-gray-100 rounded-full p-2 shadow-lg"
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
          >
            <Heart
              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </Button>

          <EditableImageUpload
            imageUrl={event.image}
            editMode={editMode.image}
            onChange={setNewImage}
            onSave={() => saveField("image")}
            onToggle={() => toggleEdit("image")}
          />
        </div>

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="w-full">
              <Badge variant="outline" className="mb-2 text-xs">
                {event.category}
              </Badge>
              <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold">
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
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-base sm:text-lg text-muted-foreground mb-4">
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
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="py-2 sm:py-3">
                <CardTitle className="text-sm sm:text-base">
                  Registration Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                <EditableTextField
                  label={`${event.capacity} participants`}
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
                  label={`Registration closes: ${formatDateTime(
                    event.registrationClosesAt
                  )}`}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
