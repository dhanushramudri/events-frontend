import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  CheckCircle,
  Clock,
  BarChart,
  PieChart,
  Bell,
  ArrowUpRight,
  Award,
  Tag,
  AlertCircle,
} from "lucide-react";
import { getEvents, getAnalytics } from "../services/eventService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import EventCard from "../components/EventCard";
import { useToast } from "../hooks/useToast";
import { Line, Pie, Bar } from "react-chartjs-2";
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
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Component for lazy loading sections
const LazyLoadSection = ({ children, id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When section is 300px from entering viewport, start loading it
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" } // Load when within 300px of viewport
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  return (
    <div ref={sectionRef} id={id} className="w-full">
      {isVisible ? (
        children
      ) : (
        <div className="min-h-32 flex items-center justify-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalParticipants: 0,
    upcomingEvents: 0,
    ongoingEvents: 0,
    totalRegisteredUsers: 0,
    capacityUsage: 0,
  });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [popularEvent, setPopularEvent] = useState(null);
  const [participantChartData, setParticipantChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [categoryChartData, setCategoryChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [capacityChartData, setCapacityChartData] = useState({
    labels: [],
    datasets: [],
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Separate fetchers for different sections
  const fetchBasicStats = async () => {
    try {
      const analyticsData = await getAnalytics();
      setStats({
        totalEvents: analyticsData.totalEvents || 0,
        totalParticipants: analyticsData.totalParticipants || 0,
        upcomingEvents: analyticsData.upcomingEvents || 0,
        ongoingEvents: analyticsData.ongoingEvents || 0,
        totalRegisteredUsers: analyticsData.totalRegisteredUsers || 0,
        capacityUsage: analyticsData.capacityUsage || 0,
      });
      return analyticsData;
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const fetchEventsData = async () => {
    try {
      const { events } = await getEvents({ status: "upcoming", limit: 3 });

      if (events && events.length > 0) {
        const mostPopularEvent = events.reduce((prev, curr) =>
          curr.participantsCount > prev.participantsCount ? curr : prev
        );

        setUpcomingEvents(events);
        setPopularEvent(mostPopularEvent);
      }

      return events;
    } catch (error) {
      console.error("Failed to fetch events:", error);
      toast({
        title: "Error",
        description: "Failed to load upcoming events.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const processChartData = (analyticsData) => {
    if (!analyticsData) return;

    // Monthly attendance chart
    if (analyticsData.participantsTrend) {
      setParticipantChartData({
        labels: analyticsData.participantsTrend.map((item) => item.date),
        datasets: [
          {
            label: "Attendance",
            data: analyticsData.participantsTrend.map((item) => item.count),
            borderColor: "rgb(53, 162, 235)",
            backgroundColor: "rgba(53, 162, 235, 0.5)",
          },
        ],
      });
    }

    // Category distribution chart
    if (analyticsData.eventsByCategory) {
      setCategoryChartData({
        labels: analyticsData.eventsByCategory.map((item) => item.category),
        datasets: [
          {
            label: "Events",
            data: analyticsData.eventsByCategory.map((item) => item.count),
            backgroundColor: [
              "#ff9999",
              "#66b3ff",
              "#99ff99",
              "#ffcc99",
              "#ffb3e6",
              "#c2c2f0",
              "#ffb347",
            ],
          },
        ],
      });
    }

    // Capacity usage chart
    if (analyticsData.capacityUsageByEvent) {
      setCapacityChartData({
        labels: analyticsData.capacityUsageByEvent.map(
          (item) => item.eventName
        ),
        datasets: [
          {
            label: "Capacity Used (%)",
            data: analyticsData.capacityUsageByEvent.map(
              (item) => (item.attendees / item.capacity) * 100
            ),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    }
  };

  // Initial data loading - just load critical data for above the fold
  useEffect(() => {
    let isMounted = true;

    const initializeBasicData = async () => {
      try {
        setLoading(true);
        const analyticsData = await fetchBasicStats();
        if (!isMounted) return;

        // Initial data is loaded, hide main loader
        setLoading(false);

        // Process chart data but don't block UI
        processChartData(analyticsData);

        // Start loading events data in background
        fetchEventsData();
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        if (isMounted) setLoading(false);
      }
    };

    initializeBasicData();

    return () => {
      isMounted = false;
    };
  }, []);

  const statsCards = [
    {
      title: "Total Events",
      value: stats.totalEvents,
      icon: <Calendar className="h-6 w-6 text-blue-500" />,
      color: "blue",
      description: "Total events created in the system",
    },
    {
      title: "Total Attendees",
      value: stats.totalParticipants,
      icon: <Users className="h-6 w-6 text-green-500" />,
      color: "green",
      description: "Total participants across all events",
    },
    {
      title: "Total Registered Users",
      value: stats.totalRegisteredUsers,
      icon: <CheckCircle className="h-6 w-6 text-purple-500" />,
      color: "purple",
      description: "Users registered in the system",
    },
    {
      title: "Upcoming Events",
      value: stats.upcomingEvents,
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      color: "yellow",
      description: "Events scheduled in the future",
    },
  ];

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Monthly Attendance" },
    },
  };

  const categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Category Distribution" },
    },
  };

  const capacityChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        title: {
          display: true,
          text: "Capacity Usage %",
        },
      },
    },
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Capacity Usage by Event" },
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
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">
            Welcome back! Here's what's happening with your events.
          </p>
        </div>
        <div className="flex gap-3">
          <Link to="/events/new">
            <Button className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Create Event
            </Button>
          </Link>
        </div>
      </div>

      {/* Priority content - above the fold */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Card
            key={index}
            className={`border-l-4 border-${stat.color}-500 hover:shadow-md transition-shadow`}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Lazily loaded content - below the fold */}
      <LazyLoadSection id="most-popular-event">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Award className="h-5 w-5 mr-2 text-amber-500" />
            Most Popular Event
          </h2>
          {popularEvent ? (
            <Card className="hover:shadow-md transition-shadow border-t-4 border-amber-500">
              <CardHeader>
                <CardTitle>{popularEvent.title}</CardTitle>
                <CardDescription>
                  {new Date(popularEvent.startDate).toLocaleDateString()} -{" "}
                  {popularEvent.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">
                      Category: {popularEvent.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      Participants: {popularEvent.participants?.length || 0}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Capacity: {popularEvent.capacity}
                    </p>
                    <p className="text-sm text-gray-500">
                      Capacity Usage:{" "}
                      {Math.round(
                        (popularEvent.participants?.length /
                          popularEvent.capacity) *
                          100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to={`/events/${popularEvent._id}`} className="w-full">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    View Details <ArrowUpRight className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Award className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  No Popular Events Yet
                </h3>
                <p className="text-gray-500 text-center">
                  There aren't enough events to determine which is most popular.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </LazyLoadSection>

      <LazyLoadSection id="analytics-charts">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Monthly Attendance Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Attendance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {participantChartData.labels.length > 0 ? (
                <div className="h-80">
                  <Line options={chartOptions} data={participantChartData} />
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center">
                  <p className="text-gray-500">No attendance data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Category Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="h-5 w-5 mr-2" />
                Category Popularity
              </CardTitle>
            </CardHeader>
            <CardContent>
              {categoryChartData.labels.length > 0 ? (
                <div className="h-80">
                  <Pie
                    options={categoryChartOptions}
                    data={categoryChartData}
                  />
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center">
                  <p className="text-gray-500">No category data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </LazyLoadSection>

      <LazyLoadSection id="capacity-usage-chart">
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Capacity Usage by Event
              </CardTitle>
            </CardHeader>
            <CardContent>
              {capacityChartData.labels.length > 0 ? (
                <div className="h-80">
                  <Bar
                    options={capacityChartOptions}
                    data={capacityChartData}
                  />
                </div>
              ) : (
                <div className="flex h-80 items-center justify-center">
                  <p className="text-gray-500">No capacity data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </LazyLoadSection>

      <LazyLoadSection id="upcoming-events">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center">
              <Clock className="h-5 w-5 mr-2 text-blue-500" />
              Upcoming Events
            </h2>
            <Link to="/events?status=upcoming">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                View All <ArrowUpRight className="h-4 w-4" />
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
      </LazyLoadSection>

      <LazyLoadSection id="quick-actions">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/events/create" className="w-full">
              <Button
                variant="default"
                className="w-full flex items-center justify-center gap-2 py-6"
              >
                <Calendar className="h-5 w-5" />
                Create New Event
              </Button>
            </Link>
            <Link to="/events" className="w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-6"
              >
                <BarChart className="h-5 w-5" />
                View All Events
              </Button>
            </Link>
            <Link to="/notifications" className="w-full">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-6"
              >
                <Bell className="h-5 w-5" />
                Send Notification
              </Button>
            </Link>
          </div>
        </div>
      </LazyLoadSection>
    </div>
  );
};

export default Dashboard;
