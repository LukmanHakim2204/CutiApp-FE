import { Calendar, Clock, Flag, Heart, Moon, Star, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import type { ExtendedHoliday, Holiday, HolidayGroup } from "../types/type";
import AuthGuard from "../component/AuthGuard";

// Define interfaces for type safety

type FilterType = "all" | "national" | "religious" | "seasonal";

export default function Holiday() {
  const [holidays, setHolidays] = useState<HolidayGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // Function to fetch holidays from API
  const fetchHolidays = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://dashbar.barareca.co.id/api/holidaylist", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "YjHSSITOc1NDh945b7GlMzCfKbJPGB2d",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! type: ${response.type}`);
      }

      const result = await response.json();
      setHolidays(result.data || []);
    } catch (err) {
      // Fix: Handle unknown error type
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred";
      setError(errorMessage);
      console.error("Error fetching holidays:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch holidays on component mount
  useEffect(() => {
    fetchHolidays();
  }, []);

  // Function to format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };

  // Function to get day of week
  const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[date.getDay()];
  };

  // Function to calculate days until holiday
  const getDaysUntil = (date: string): string => {
    const today = new Date();
    const holidayDate = new Date(date);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Passed";
    if (diffDays === 0) return "Today";
    return `In ${diffDays} days`;
  };

  // Function to get type color based on days until
  const gettypeColor = (date: string): string => {
    const today = new Date();
    const holidayDate = new Date(date);
    const diffTime = holidayDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "gray";
    if (diffDays === 0) return "green";
    if (diffDays <= 7) return "red";
    if (diffDays <= 30) return "orange";
    return "blue";
  };

  // Function to get appropriate icon based on type
  const getHolidayIcon = (type: Holiday["type"]) => {
    switch (type) {
      case "religious":
        return <Moon className="w-5 h-5 text-blue-600" />;
      case "national":
        return <Flag className="w-5 h-5 text-red-600" />;
      case "seasonal":
        return <Sun className="w-5 h-5 text-yellow-600" />;
      default:
        return <Star className="w-5 h-5 text-orange-600" />;
    }
  };

  // Function to get holiday type based on type
  const getHolidayType = (type: Holiday["type"]): string => {
    switch (type) {
      case "religious":
        return "Religious Holiday";
      case "national":
        return "National Holiday";
      case "seasonal":
        return "Seasonal Holiday";
      default:
        return "Holiday";
    }
  };

  // Get current month and year
  const getCurrentMonthYear = (): string => {
    const now = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${months[now.getMonth()]} ${now.getFullYear()}`;
  };

  const allHolidays: ExtendedHoliday[] = holidays.flatMap(
    (holidayGroup) =>
      holidayGroup.holidays?.map((holiday) => ({
        ...holiday,
        groupName: holidayGroup.holiday_name,
        groupStartDate: holidayGroup.start_date,
        groupEndDate: holidayGroup.end_date,
        groupDescription: holidayGroup.description,
      })) || []
  );

  // Filter holidays based on active filter
  const filteredHolidays = allHolidays.filter((holiday) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "national") return holiday.type === "national";
    if (activeFilter === "religious") return holiday.type === "religious";
    if (activeFilter === "seasonal") return holiday.type === "seasonal";
    return true;
  });

  return (
    <AuthGuard>
      <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative main-container">
        {/* Scrollable Content Area */}
        <div className="content-area scrollbar-hide">
          {/* Header */}
          <div className="gradient-bg px-6 py-8 relative bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white/80 text-sm font-medium">
                  Holiday Calendar
                </p>
                <h1 className="text-white text-2xl font-bold mt-1">
                  2025 Holidays
                </h1>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-4 right-16 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-6 left-20 w-12 h-12 bg-white/5 rounded-full blur-lg" />
          </div>

          {/* Current Month Banner */}
          <div className="px-6 -mt-6 relative z-10 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-lg border-l-4 border-orange-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-xs font-semibold uppercase tracking-wide">
                    Current Month
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">
                    {getCurrentMonthYear()}
                  </p>
                </div>
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Star className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-6 mb-6">
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                  activeFilter === "all"
                    ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                All
              </button>
              <button
                onClick={() => setActiveFilter("national")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                  activeFilter === "national"
                    ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Flag className="w-4 h-4 inline mr-2" />
                National
              </button>
              <button
                onClick={() => setActiveFilter("religious")}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
                  activeFilter === "religious"
                    ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Heart className="w-4 h-4 inline mr-2" />
                Religious
              </button>
            </div>
          </div>

          {/* Holiday List */}
          <div className="px-6">
            <div className="h-96 overflow-y-auto space-y-4 pb-28 scrollbar-hide">
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
              ) : error ? (
                <div className="text-center p-8">
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Error loading holidays</p>
                    <p className="text-sm mt-1">{error}</p>
                    <button
                      onClick={fetchHolidays}
                      className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : filteredHolidays.length === 0 ? (
                <div className="text-center p-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    No holidays found for this filter
                  </p>
                </div>
              ) : (
                filteredHolidays.map((holiday) => {
                  const typeColor = gettypeColor(holiday.date);
                  const daysUntil = getDaysUntil(holiday.date);
                  const isToday = daysUntil === "Today";
                  const isPassed = daysUntil === "Passed";

                  return (
                    <div
                      key={holiday.id}
                      className={`holiday-card rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-${typeColor}-500 ${
                        isPassed ? "opacity-75" : ""
                      } ${
                        isToday ? "ring-2 ring-green-200 animate-pulse" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`bg-${typeColor}-100 p-2 rounded-lg`}>
                            {getHolidayIcon(holiday.type)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">
                              {holiday.description}
                            </p>
                            <p className="text-xs text-gray-500">
                              {getHolidayType(holiday.type)}
                            </p>
                            <p className="text-xs text-blue-600 font-medium">
                              {holiday.groupName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-bold text-${typeColor}-600`}
                          >
                            {formatDate(holiday.date)}
                          </p>
                          <span
                            className={`px-2 py-1 bg-${typeColor}-100 text-${typeColor}-700 text-xs font-medium rounded-full`}
                          >
                            {daysUntil}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{getDayOfWeek(holiday.date)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>Full Day</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <Navbar />
      </div>
    </AuthGuard>
  );
}
