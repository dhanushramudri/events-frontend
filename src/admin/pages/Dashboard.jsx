import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  BarChart,
  PieChart,
} from "lucide-react";
import { getEvents, getAnalytics } from "../services/eventService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import EventCard from "../components/EventCard";
import { useToast } from "../hooks/useToast.jsx";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement // For pie chart
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [participantChartData, setParticipantChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [categoryChartData, setCategoryChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const analyticsData = await getAnalytics();
        const { events } = await getEvents({ status: "upcoming", limit: 3 });

        if (!isMounted) return;

        setStats({
          totalEvents: analyticsData.totalEvents || 0,
          totalParticipants: analyticsData.totalParticipants || 0,
          upcomingEvents: analyticsData.upcomingEvents || 0,
          ongoingEvents: analyticsData.ongoingEvents || 0,
        });

        setUpcomingEvents(events || []);

        if (analyticsData.participantsTrend) {
          setParticipantChartData({
            labels: analyticsData.participantsTrend.map((item) => item.date),
            datasets: [
              {
                label: "Participants",
                data: analyticsData.participantsTrend.map((item) => item.count),
                borderColor: "rgb(53, 162, 235)",
                backgroundColor: "rgba(53, 162, 235, 0.5)",
              },
            ],
          });
        }

        if (analyticsData.eventsByCategory) {
          setCategoryChartData({
            labels: analyticsData.eventsByCategory.map((item) => item.category),
            datasets: [
              {
                label: "Events by Category",
                data: analyticsData.eventsByCategory.map((item) => item.count),
                backgroundColor: [
                  "#ff9999",
                  "#66b3ff",
                  "#99ff99",
                  "#ffcc99",
                  "#ffb3e6",
                ], // Different color for each category
              },
            ],
          });
        }
      } catch (error) {
        console.error("Dashboard data error:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, []); // ✅ Empty array ensures effect runs once

  const statsCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      color: "blue",
    },
    {
      title: "Total Participants",
      value: stats.totalParticipants,
      icon: <Users className="h-6 w-6 text-green-500" />,
      color: "green",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      color: "yellow",
    },
    {
      title: "Active Events",
      value: stats.ongoingEvents,
      icon: <CheckCircle className="h-6 w-6 text-emerald-500" />,
      color: "emerald",
    },
  ];

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Participant Trends" },
    },
  };

  const categoryChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Events by Category" },
    },
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-2">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link to="/events/create">
          <Button>Create New Event</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index} className={`border-l-4 border-${stat.color}-500`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Participant Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            {participantChartData.labels.length > 0 ? (
              <div className="h-80">
                <Line options={chartOptions} data={participantChartData} />
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center">
                <p className="text-gray-500">No trend data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Events by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            {categoryChartData.labels.length > 0 ? (
              <div className="h-80">
                <Pie options={categoryChartOptions} data={categoryChartData} />
              </div>
            ) : (
              <div className="flex h-80 items-center justify-center">
                <p className="text-gray-500">No category data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Upcoming Events</h2>
          <Link to="/events?status=upcoming">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Upcoming Events</h3>
              <p className="text-gray-500 text-center mb-4">
                There are no upcoming events scheduled at the moment.
              </p>
              <Link to="/events/create">
                <Button>Create New Event</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
