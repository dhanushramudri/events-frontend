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
  Search,
  Filter,
  Users,
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
        rejected: all.filter(
          (p) => p.status === "rejected" || p.status === "withdrawn"
        ),
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
      // Check if the current time is within 12 hours of registration closing
      const currentTime = new Date();
      const registrationCloseTime = new Date(event.registrationClosesAt);
      const timeDifference = registrationCloseTime - currentTime; // in milliseconds
      console.log("time difference", timeDifference);
      const twelveHoursInMilliseconds = 12 * 60 * 60 * 1000; // 12 hours

      if (timeDifference <= twelveHoursInMilliseconds) {
        console.log("time difference", timeDifference);
        console.log("current time", currentTime);
        console.log("registration close time", registrationCloseTime);
        toast.error(
          "You cannot reject a user within 12 hours of registration closing."
        );
        alert("Cannot reject user within 12 hours of registration closing.");
        return; // Exit the function if within 12 hours
      }

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
        rejected: all.filter(
          (p) => p.status === "rejected" || p.status === "withdrawn"
        ),
      };
      setGroupedUsers(grouped); // update the UI too

      console.log("Grouped users after rejection:", grouped);

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
      color: "bg-[#19105b]/90",
      textColor: "text-white",
      iconBg: "bg-[#19105b]",
    },
    {
      label: "Waitlisted",
      key: "pending",
      description: "In queue for approval",
      color: "bg-[#19105b]/70",
      textColor: "text-white",
      iconBg: "bg-[#19105b]",
    },
    {
      label: "Withdrawn",
      key: "rejected",
      description: "Removed or cancelled",
      color: "bg-[#19105b]/50",
      textColor: "text-white",
      iconBg: "bg-[#19105b]/80",
    },
  ];

  console.log("event details", event);
  if (loading) {
    return (
      <Card className="w-full shadow-md">
        <CardHeader className="bg-[#19105b]/10">
          <CardTitle className="text-[#19105b]">Participants</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#19105b]"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-[#19105b]/10 pb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#19105b] text-white p-2 rounded-full">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-[#ff6196]">
                Event Participants
              </CardTitle>
              {event && (
                <div>
                  <p className="text-sm text-gray-600 font-medium">
                    {event.title} – {new Date(event.date).toLocaleDateString()}
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-[#19105b]">
                        {groupedUsers.approved.length}/{event.capacity}
                      </span>{" "}
                      registered
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold text-[#ff6196]">
                        {groupedUsers.pending.length}
                      </span>{" "}
                      on waitlist
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search participants..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border px-3 py-2 pl-9 rounded-md w-full"
              />
            </div>
            <Button
              variant="outline"
              onClick={exportParticipantsList}
              className="bg-white hover:bg-gray-50 border-[#19105b]/30 text-[#19105b] hover:text-[#19105b]/80"
            >
              <Download className="w-4 h-4 mr-2" /> Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8 p-4 sm:p-6">
        {/* Notification Section */}
        <div className="border p-4 rounded-lg bg-white border-[#19105b]/20 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-[#19105b] flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Send Notification
          </h3>
          <div className="flex flex-wrap gap-2 mb-3">
            <Button
              variant="secondary"
              onClick={() => setNotificationTarget("selected")}
              className={
                notificationTarget === "selected"
                  ? "bg-[#ff6196] hover:bg-[#ff6196]/90 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }
            >
              Selected
            </Button>
            <Button
              variant="secondary"
              onClick={() => setNotificationTarget("status")}
              className={
                notificationTarget === "status"
                  ? "bg-[#ff6196] hover:bg-[#ff6196]/90 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }
            >
              By Status
            </Button>
            <Button
              variant="secondary"
              onClick={() => setNotificationTarget("all")}
              className={
                notificationTarget === "all"
                  ? "bg-[#19105b] hover:bg-[#19105b]/90 text-white"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }
            >
              All
            </Button>
            {notificationTarget === "status" && (
              <select
                className="border px-3 py-2 rounded-md bg-white border-gray-300 focus:border-[#19105b] focus:ring-1 focus:ring-[#19105b] outline-none"
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
            className="w-full p-3 border rounded-md border-gray-300 focus:ring-2 focus:ring-[#19105b]/40 focus:border-[#19105b] outline-none"
            rows="4"
            placeholder="Enter notification message..."
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
          />
          <div className="mt-3 flex justify-end">
            <Button
              onClick={sendNotification}
              disabled={sendingNotification}
              className="bg-[#ff6196] text-white hover:bg-[#ff6196]/90"
            >
              {sendingNotification ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </div>

        {/* Participants List */}
        {sections.map(
          ({ key, label, description, color, textColor, iconBg }) => (
            <div
              key={key}
              className="border rounded-lg shadow-sm overflow-hidden border-[#19105b]/10"
            >
              <div
                className={`${color} ${textColor} p-3 flex justify-between items-center`}
              >
                <div className="flex items-center gap-2">
                  <div className={`${iconBg} rounded-full p-1`}>
                    <Filter className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-lg">{label}</h3>
                </div>
                <p className="text-sm">{description}</p>
              </div>
              <div className="bg-white p-4 space-y-3">
                {filterParticipants(groupedUsers[key]).length > 0 ? (
                  filterParticipants(groupedUsers[key]).map((user) => (
                    <div
                      key={user._id}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-3 gap-3"
                    >
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user._id)}
                          onChange={() => toggleSelectUser(user._id)}
                          className="h-4 w-4 accent-[#ff6196]"
                        />
                        <div>
                          <span className="font-medium">{user.name}</span>
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
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <span
                          className={`${getStatusBadgeColor(
                            user.status
                          )} text-xs px-2 py-1 rounded-full font-medium`}
                        >
                          {user.status}
                        </span>
                        <div className="flex border-l pl-2 ml-2">
                          <button
                            onClick={() => promoteUser(user._id)}
                            title="Approve"
                            className="p-1 hover:bg-green-100 rounded"
                          >
                            <Check className="text-[#19105b] w-5 h-5" />
                          </button>
                          <button
                            onClick={() => rejectUser(user._id)}
                            title="Reject"
                            className="p-1 hover:bg-red-100 rounded"
                          >
                            <X className="text-[#ff6196] w-5 h-5" />
                          </button>
                          <button
                            onClick={() => sendDirectEmailToUser(user)}
                            title="Email"
                            className="p-1 hover:bg-blue-100 rounded"
                          >
                            <Mail className="text-[#19105b] w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No users in this category
                  </p>
                )}
              </div>
            </div>
          )
        )}
      </CardContent>

      <CardFooter className="bg-[#19105b]/5 p-4 border-t">
        <Link to="/events">
          <Button
            variant="outline"
            className="hover:bg-[#19105b]/10 border-[#19105b]/30 text-[#19105b]"
          >
            <ArrowRightCircle className="w-4 h-4 mr-2 text-[#19105b]" />
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
      return "text-[#19105b] font-medium";
    case "pending":
      return "text-[#ff6196] font-medium";
    case "rejected":
      return "text-gray-500 font-medium";
    default:
      return "text-gray-400";
  }
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case "approved":
      return "bg-[#19105b]/20 text-[#19105b]";
    case "pending":
      return "bg-[#ff6196]/20 text-[#ff6196]";
    case "rejected":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default Participants;
