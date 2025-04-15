import React, { useEffect, useState, useMemo } from "react";
import { User, Search, Mail, Shield } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { getUsers } from "../services/userService";
import { Table, TableRow, TableCell } from "../components/ui/Table";
import  {toast, ToastContainer } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        console.log("res is ", res);
        setUsers(res || []);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast.error("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  console.log("users are ", users);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-8">
        <h1 className="text-4xl font-semibold text-gray-900">Users</h1>
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users..."
            className="pl-10 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-r-transparent"></div>
          <p className="mt-3 text-lg text-gray-500">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="text-center p-8 rounded-lg shadow-md bg-gray-50">
          <CardContent>
            <User className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <p className="text-xl font-medium text-gray-800">No users found</p>
            <p className="text-gray-600 mt-2">Try a different search term.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-lg shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800">
              All Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table
              headers={[
                "Name",
                "Email",
                "Event",
                "Registered At",
                "Status",
                "Queue #",
              ]}
            >
              {filteredUsers.map((participant) => (
                <TableRow key={participant._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-blue-500" />
                      <span>{participant.name || "Unnamed"}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Mail className="inline-block w-4 h-4 mr-2 text-gray-400" />
                    {participant.email}
                  </TableCell>

                  <TableCell>
                    <span className="font-medium">
                      {participant.eventId?.title}
                    </span>
                  </TableCell>

                  <TableCell>
                    {new Date(participant.registeredAt).toLocaleDateString()}
                  </TableCell>

                  <TableCell className="capitalize">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        participant.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : participant.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {participant.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    {participant.queuePosition ?? "-"}
                  </TableCell>
                </TableRow>
              ))}
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Users;
