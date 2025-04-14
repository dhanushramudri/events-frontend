import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Users,
  Calendar,
  BarChartBig,
  Loader,
  AlertCircle,
} from "lucide-react";
import { API_URL } from "../config/constants";

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/analytics/admin`);
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader className="animate-spin w-8 h-8 text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <AlertCircle className="w-8 h-8 text-red-500 mr-4" />
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center mt-10 text-gray-500">
        No analytics data available.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Total Participants Card */}
      <Card className="border-l-4 border-blue-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" /> Total Participants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.totalParticipants}</p>
        </CardContent>
      </Card>

      {/* Upcoming Events Card */}
      <Card className="border-l-4 border-green-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-green-600" /> Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.upcomingEvents}</p>
        </CardContent>
      </Card>

      {/* Total Events Card */}
      <Card className="border-l-4 border-purple-600">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChartBig className="w-6 h-6 text-purple-600" /> Total Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">{stats.totalEvents}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
