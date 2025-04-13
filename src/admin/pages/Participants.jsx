import React, { useEffect, useState } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  ArrowRightCircle,
  Trash,
  Mail,
  X,
  Download,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { API_URL } from "../config/constants";
import { useParams, Link } from "react-router-dom";

const Participants = () => {
  const { eventId } = useParams();
  const [groupedUsers, setGroupedUsers] = useState({
    approved: [],
    pending: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [event, setEvent] = useState(null);
  const [notificationTarget, setNotificationTarget] = useState("selected");
  const [targetStatus, setTargetStatus] = useState("approved");

  useEffect(() => {
    fetchParticipants();
    fetchEventDetails();
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/admin/events/${eventId}/participants`
      );
      setEvent(res.data.event);
    } catch (error) {
      console.error("Error fetching event details", error);
      toast.error("Failed to load event details.");
    }
  };

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/admin/events/${eventId}/participants`
      );
      const all = res.data.participants;

      // Auto-approve logic for users with queuePosition === 0 and status === 'pending'
      const autoApprovePromises = all
        .filter((p) => p.queuePosition === 0 && p.status === "pending")
        .map((p) =>
          axios.post(
            `${API_URL}/admin/events/${eventId}/participants/${p._id}/approve`
          )
        );

      if (autoApprovePromises.length > 0) {
        await Promise.all(autoApprovePromises);
        toast.success(`${autoApprovePromises.length} user(s) auto-approved.`);
        return fetchParticipants(); // Refetch after approvals
      }

      const grouped = {
        approved: all.filter((p) => p.status === "approved"),
        pending: all.filter((p) => p.status === "pending"),
        rejected: all.filter((p) => p.status === "rejected"),
      };

      setGroupedUsers(grouped);
    } catch (error) {
      console.error("Error fetching participants", error);
      toast.error("Failed to load participants.");
    } finally {
      setLoading(false);
    }
  };

  const promoteUser = async (userId) => {
    try {
      await axios.post(
        `${API_URL}/admin/events/${eventId}/participants/${userId}/approve`
      );
      toast.success("User approved and added to event.");

      // Find the user from all grouped lists
      const allUsers = [
        ...(groupedUsers.pending || []),
        ...(groupedUsers.approved || []),
        ...(groupedUsers.rejected || []),
      ];
      const user = allUsers.find((u) => u._id === userId);
      console.log("Resolved user:", user);

      if (user) {
        await sendDirectEmailToUser({
          ...user,
          status: "approved",
        });
      }

      fetchParticipants();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to approve user.");
    }
  };

  const rejectUser = async (userId) => {
    try {
      // Step 1: Reject the user
      await axios.post(
        `${API_URL}/admin/events/${eventId}/participants/${userId}/reject`
      );
      toast.success("User rejected from waitlist.");

      // ✅ Updated user lookup
      const allUsers = [
        ...(groupedUsers.pending || []),
        ...(groupedUsers.approved || []),
        ...(groupedUsers.rejected || []),
      ];
      const user = allUsers.find((u) => u._id === userId);

      if (user) {
        await sendDirectEmailToUser({
          ...user,
          status: "rejected",
        });
      }

      // Step 2: Refetch updated participants list
      const res = await axios.get(
        `${API_URL}/admin/events/${eventId}/participants`
      );
      const all = res.data.participants;

      const grouped = {
        approved: all.filter((p) => p.status === "approved"),
        pending: all.filter((p) => p.status === "pending"),
        rejected: all.filter((p) => p.status === "rejected"),
      };
      setGroupedUsers(grouped); // update the UI too

      // Step 3: Calculate available slots
      const approvedCount = grouped.approved.length;
      const availableSlots = event.capacity - approvedCount;
      console.log("Available slots:", availableSlots);

      // Step 4: Get users to approve from updated pending list
      const usersToApprove = grouped.pending.slice(0, availableSlots);
      console.log("Users to auto-approve:", usersToApprove);

      // Step 5: Auto-approve them
      if (usersToApprove.length > 0) {
        const approvalPromises = usersToApprove.map((user) =>
          axios.post(
            `${API_URL}/admin/events/${eventId}/participants/${user._id}/approve`
          )
        );
        await Promise.all(approvalPromises);
        toast.success(`${usersToApprove.length} user(s) auto-approved.`);
      } else {
        toast.success("No one in the waitlist to auto-approve.");
      }

      // Step 6: Refetch again after approvals
      fetchParticipants();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject user.");
    }
  };

  const sendNotification = async () => {
    if (!notificationMessage.trim()) {
      toast.error("Please enter a notification message");
      return;
    }

    setSendingNotification(true);
    try {
      const payload = { message: notificationMessage };

      if (notificationTarget === "selected" && selectedUsers.length > 0) {
        payload.userIds = selectedUsers;
      } else if (notificationTarget === "status") {
        payload.status = targetStatus;
      }

      // Send direct emails via EmailJS
      if (notificationTarget === "selected" && selectedUsers.length > 0) {
        selectedUsers.forEach(async (userId) => {
          const user =
            groupedUsers.approved.find((user) => user._id === userId) ||
            groupedUsers.pending.find((user) => user._id === userId) ||
            groupedUsers.rejected.find((user) => user._id === userId);

          if (user) {
            await sendDirectEmailToUser(user);
          }
        });
      } else {
        // Send notification based on status
        let usersToNotify = [];
        if (targetStatus === "approved") {
          usersToNotify = groupedUsers.approved;
        } else if (targetStatus === "pending") {
          usersToNotify = groupedUsers.pending;
        } else if (targetStatus === "rejected") {
          usersToNotify = groupedUsers.rejected;
        }

        usersToNotify.forEach(async (user) => {
          await sendDirectEmailToUser(user);
        });
      }

      toast.success("Notifications sent");
      setNotificationMessage("");
      setSelectedUsers([]);
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(error.response?.data?.message || "Failed to send");
    } finally {
      setSendingNotification(false);
    }
  };

  const sendDirectEmailToUser = async (user) => {
    const statusMessage = {
      approved: `Congratulations ${user.name}, you have been approved for the event "${event?.title}".`,
      rejected: `Hi ${user.name}, unfortunately, your registration for "${event?.title}" has been declined.`,
      pending: `Hi ${user.name}, your registration for "${event?.title}" is currently pending.`,
    };

    const templateParams = {
      from_name: "Event Organizer",
      to_name: user.name,
      to_email: user.email,
      message:
        statusMessage[user.status] ||
        `Hi ${user.name}, here is an update regarding "${event?.title}".`,
    };

    try {
      console.log("Sending email with params:", templateParams);

      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID_NOTIFICATION,
        templateParams,
        import.meta.env.VITE_EMAILJS_USER_ID
      );

      console.log("EmailJS response:", result);
      toast.success(`Email sent to ${user.name}`);
    } catch (error) {
      console.error("EmailJS Error:", error);
      toast.error(`Failed to send email to ${user.name}`);
    }
  };

  const toggleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const exportParticipantsList = () => {
    const all = [
      ...groupedUsers.approved,
      ...groupedUsers.pending,
      ...groupedUsers.rejected,
    ];
    const csv = [
      "Name,Email,Status,Queue Position,Registered Date",
      ...all.map(
        (u) =>
          `${u.name},${u.email},${u.status},${u.queuePosition || 0},${new Date(
            u.registeredAt
          ).toLocaleDateString()}`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `participants-${eventId}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filterParticipants = (users) =>
    filter
      ? users.filter(
          (u) =>
            u.name.toLowerCase().includes(filter.toLowerCase()) ||
            u.email.toLowerCase().includes(filter.toLowerCase())
        )
      : users;

  const sections = [
    {
      label: "Registered",
      key: "approved",
      description: "Confirmed participants",
    },
    {
      label: "Waitlisted",
      key: "pending",
      description: "In queue for approval",
    },
    {
      label: "Withdrawn",
      key: "rejected",
      description: "Removed or cancelled",
    },
  ];

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <CardTitle>Participants</CardTitle>
          {event && (
            <div>
              <p className="text-sm text-gray-500">
                {event.title} – {new Date(event.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                Capacity: {groupedUsers.approved.length}/{event.capacity}{" "}
                participants
              </p>
              <p className="text-sm text-gray-500">
                {groupedUsers.pending.length} people on waitlist
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={exportParticipantsList}>
            <Download className="w-4 h-4 mr-2" /> Export CSV
          </Button>
          <input
            type="text"
            placeholder="Search..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Notification Section */}
        <div className="border p-4 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-3">Send Notification</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {["selected", "all", "status"].map((opt) => (
              <Button
                key={opt}
                variant={notificationTarget === opt ? "default" : "outline"}
                onClick={() => setNotificationTarget(opt)}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Button>
            ))}
            {notificationTarget === "status" && (
              <select
                className="border px-3 py-2 rounded-md"
                value={targetStatus}
                onChange={(e) => setTargetStatus(e.target.value)}
              >
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            )}
          </div>
          <textarea
            className="w-full p-2 border rounded-md"
            rows="4"
            placeholder="Enter notification message..."
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <Button onClick={sendNotification} disabled={sendingNotification}>
              {sendingNotification ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </div>

        {/* Participants List */}
        {sections.map(({ key, label, description }) => (
          <div key={key}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">{label}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              {filterParticipants(groupedUsers[key]).length > 0 ? (
                filterParticipants(groupedUsers[key]).map((user) => (
                  <div
                    key={user._id}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleSelectUser(user._id)}
                      />
                      <div>
                        <span>{user.name}</span>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                        {key === "pending" && (
                          <div className="text-xs text-gray-400">
                            Queue position: {user.queuePosition || "N/A"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={getStatusColor(user.status)}>
                        {user.status}
                      </span>
                      <button
                        onClick={() => promoteUser(user._id)}
                        title="Approve"
                      >
                        <Check className="text-green-500 w-5 h-5" />
                      </button>
                      <button
                        onClick={() => rejectUser(user._id)}
                        title="Reject"
                      >
                        <X className="text-red-500 w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeUser(user._id)}
                        title="Remove"
                      >
                        <Trash className="text-red-500 w-5 h-5" />
                      </button>
                      <button
                        onClick={() => sendDirectEmailToUser(user)}
                        title="Email"
                      >
                        <Mail className="text-blue-500 w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No users in this category</p>
              )}
            </div>
          </div>
        ))}
      </CardContent>

      <CardFooter>
        <Link to={`/admin/events/${eventId}/details`}>
          <Button variant="outline">
            <ArrowRightCircle className="w-4 h-4 mr-2" />
            Back to Event Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "text-green-500";
    case "pending":
      return "text-yellow-500";
    case "rejected":
      return "text-gray-500";
    default:
      return "text-gray-400";
  }
};

export default Participants;
