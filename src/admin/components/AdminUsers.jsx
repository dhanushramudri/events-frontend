import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await axios.get(
          "/api/participants/admin/my-events/participants",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setParticipants(res.data.participants);
      } catch (err) {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Registered Users</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <Loader className="animate-spin text-blue-600 w-6 h-6" />
        </div>
      ) : participants.length === 0 ? (
        <p className="text-gray-600">No participants found.</p>
      ) : (
        <Table headers={["Name", "Email", "Status", "Event", "Registered At"]}>
          {participants.map((p) => (
            <TableRow key={p._id}>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.email}</TableCell>
              <TableCell className="capitalize">{p.status}</TableCell>
              <TableCell>{p.eventId?.title || "—"}</TableCell>
              <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </Table>
      )}
    </div>
  );
};

export default AdminUsers;
