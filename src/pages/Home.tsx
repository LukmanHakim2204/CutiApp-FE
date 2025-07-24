// src/components/Home.tsx
import React, { useState, useEffect } from "react";
import {
  Calendar,
  CalendarDays,
  CheckCircle,
  Clock,
  Heart,
  UserCheck,
  UserIcon,
  UserX,
  XCircle,
  RefreshCw,
} from "lucide-react";

import Navbar from "../component/Navbar";

import {
  apiService,
  isAuthenticated,
  getCurrentUser,
 
} from "../services/api";
import AuthGuard from "../component/AuthGuard";
import type { ColorClasses, DashboardData, LeaveApplication, LeaveType, StatsCardProps, StatusColor, User } from "../types/type";

// Type definitions for component props
interface LeaveApplicationItemProps {
  application: LeaveApplication;
  onStatusClick?: (status: string) => void;
}

interface FilterTabProps {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
}

// Helper functions with proper typing
const formatDate = (date: string | null | undefined): string => {
  if (!date) return "N/A";
  try {
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "Invalid Date";
  }
};

const getStatusColor = (status: string): StatusColor => {
  const colors: Record<string, StatusColor> = {
    pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
    approved: { bg: "bg-green-100", text: "text-green-800" },
    rejected: { bg: "bg-red-100", text: "text-red-800" },
  };
  return colors[status?.toLowerCase()] || colors.pending;
};

// Stats Card Component
const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  loading,
}) => {
  const colorClasses: Record<string, ColorClasses> = {
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-100",
      border: "border-blue-500",
    },
    amber: {
      text: "text-amber-600",
      bg: "bg-amber-100",
      border: "border-amber-500",
    },
    green: {
      text: "text-green-600",
      bg: "bg-green-100",
      border: "border-green-500",
    },
    red: { text: "text-red-600", bg: "bg-red-100", border: "border-red-500" },
  };

  const classes = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`bg-white rounded-2xl p-4 shadow-lg card-hover border-l-4 ${classes.border}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p
            className={`${classes.text} text-xs font-semibold uppercase tracking-wide`}
          >
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-800 mt-1">
            {loading ? (
              <span className="inline-block animate-pulse bg-gray-200 rounded h-8 w-8"></span>
            ) : (
              value
            )}
          </p>
        </div>
        <div className={`${classes.bg} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${classes.text}`} />
        </div>
      </div>
    </div>
  );
};

// Leave Application Item Component
const LeaveApplicationItem: React.FC<LeaveApplicationItemProps> = ({
  application,
  onStatusClick,
}) => {
  const getTypeIcon = (leaveType: LeaveType) => {
    const type = leaveType?.name?.toLowerCase() || "";

    if (type.includes("annual") || type.includes("vacation")) {
      return CalendarDays;
    } else if (type.includes("sick")) {
      return UserX;
    } else if (type.includes("emergency")) {
      return Calendar;
    } else if (type.includes("maternity") || type.includes("paternity")) {
      return Heart;
    } else {
      return Calendar;
    }
  };

  const getIconColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-600";
      case "rejected":
        return "bg-red-100 text-red-600";
      case "pending":
        return "bg-orange-100 text-orange-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getApproverIcon = () => {
    if (application.status === "approved") return UserCheck;
    if (application.status === "rejected") return UserX;
    return UserIcon;
  };

  const TypeIcon = getTypeIcon(application.leave_type);
  const ApproverIcon = getApproverIcon();
  const statusColor = getStatusColor(application.status);
  const iconColorClass = getIconColor(application.status);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 card-hover">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${iconColorClass}`}>
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-800">
              {application.leave_type?.name || "Unknown Type"}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(application.start_date)} -{" "}
              {formatDate(application.end_date)}
            </p>
          </div>
        </div>
        <button
          onClick={() => onStatusClick && onStatusClick(application.status)}
          className={`px-3 py-1 ${statusColor.bg} ${statusColor.text} text-xs font-medium rounded-full status-badge hover:opacity-80 transition-opacity`}
        >
          {application.status || "Pending"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center py-3 border-t border-gray-100">
        <div>
          <p className="text-lg font-bold text-gray-800">
            {application.total_leave_days || 0}
          </p>
          <p className="text-xs text-gray-500">Days</p>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-800">
            {application.leave_balance || 0}
          </p>
          <p className="text-xs text-gray-500">Balance</p>
        </div>
        <div className="text-right">
          <div className="bg-gray-100 p-2 rounded-lg inline-block">
            <ApproverIcon className="w-4 h-4 text-gray-600" />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {application.leave_approver?.name || "Pending"}
          </p>
        </div>
      </div>

      {application.reason && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Reason:</p>
          <p className="text-sm text-gray-700 mt-1 line-clamp-2">
            {application.reason}
          </p>
        </div>
      )}
    </div>
  );
};

// Filter Tab Component
const FilterTab: React.FC<FilterTabProps> = ({
  active,
  children,
  onClick,
  icon: Icon,
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
        active
          ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-sm"
          : "text-gray-600 hover:bg-gray-200"
      }`}
    >
      <Icon className="w-4 h-4 inline mr-2" />
      {children}
    </button>
  );
};

// Main Home Component
export default function Home(): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("pending");
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    statistics: { total: 0, pending: 0, approved: 0, rejected: 0 },
    recent_applications: [],
    leave_balances: [],
    upcoming_leave: [],
  });
  const [filteredApplications, setFilteredApplications] = useState<
    LeaveApplication[]
  >([]);
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(true);
  const [applicationsLoading, setApplicationsLoading] =
    useState<boolean>(false);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [applicationsError, setApplicationsError] = useState<string | null>(
    null
  );

  // Get user from localStorage with better error handling
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/";
      return;
    }

    fetchDashboardData();
    // Fetch aplikasi pending saat pertama kali load
    fetchFilteredApplications("pending");
  }, []);

  // Fetch filtered applications when filter changes
  useEffect(() => {
    // Panggil untuk semua filter, termasuk pending
    fetchFilteredApplications(activeFilter);
  }, [activeFilter]);

  const fetchDashboardData = async (): Promise<void> => {
    try {
      setDashboardLoading(true);
      setDashboardError(null);

      const response = await apiService.getDashboardData();

      // Periksa dan atur dashboardData dengan aman
      let dashboardData: DashboardData;

      if (Array.isArray(response.recent_applications)) {
        // Jika response valid
        dashboardData = response;
      } else {
        // Fallback default jika tidak sesuai
        dashboardData = {
          statistics: { total: 0, pending: 0, approved: 0, rejected: 0 },
          recent_applications: [],
          leave_balances: [],
          upcoming_leave: [],
        };
      }

      setDashboardData(dashboardData);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setDashboardError(errorMessage);

      if (
        errorMessage.includes("Unauthorized") ||
        errorMessage.includes("401")
      ) {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
        window.location.href = "/";
      }
    } finally {
      setDashboardLoading(false);
    }
  };

  const fetchFilteredApplications = async (status: string): Promise<void> => {
    try {
      setApplicationsLoading(true);
      setApplicationsError(null);

      const response = await apiService.getLeaveApplications(status);
      setFilteredApplications(response.data || []);
    } catch (error) {
      console.error("Applications error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setApplicationsError(errorMessage);
    } finally {
      setApplicationsLoading(false);
    }
  };

  const handleFilterChange = (status: string): void => {
    setActiveFilter(status);
  };

  const handleStatusClick = (status: string): void => {
    handleFilterChange(status);
  };

  const handleRefresh = (): void => {
    fetchDashboardData();
    fetchFilteredApplications(activeFilter);
  };

  // FIXED: Properly handle display applications based on filter
  const getDisplayApplications = (): LeaveApplication[] => {
    const recentApps = dashboardData.recent_applications || [];

    switch (activeFilter) {
      case "all":
        return recentApps;
      case "pending":
        // Prioritaskan filteredApplications, fallback ke filter manual
        if (filteredApplications.length > 0) {
          return filteredApplications;
        } else {
          const manualFiltered = recentApps.filter(
            (app) => app.status?.toLowerCase() === "pending"
          );

          return manualFiltered;
        }
      case "approved":
        if (filteredApplications.length > 0) {
          return filteredApplications;
        } else {
          const manualFiltered = recentApps.filter(
            (app) => app.status?.toLowerCase() === "approved"
          );
          return manualFiltered;
        }
      case "rejected":
        if (filteredApplications.length > 0) {
          return filteredApplications;
        } else {
          const manualFiltered = recentApps.filter(
            (app) => app.status?.toLowerCase() === "rejected"
          );

          return manualFiltered;
        }
      default:
        return recentApps;
    }
  };

  const displayApplications = getDisplayApplications();

  return (
    <AuthGuard>
      <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative main-container">
        <div className="content-area scrollbar-hide">
          {/* Header */}
          <div className="gradient-bg px-8 mb-3 py-8 relative">
            <div className="flex justify-between px-4 items-start">
              <div>
                <p className="text-white/80 text-sm font-medium">
                  Welcome back
                </p>
                <h1 className="text-white text-2xl font-bold mt-1">
                  {user?.employee?.name || user?.name || "Loading..."}
                </h1>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleRefresh}
                  disabled={dashboardLoading}
                  className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <RefreshCw
                    className={`w-5 h-5 text-white ${
                      dashboardLoading ? "animate-spin" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="absolute top-4 right-16 w-20 h-20 bg-white/10 rounded-full blur-xl" />
            <div className="absolute bottom-6 left-20 w-12 h-12 bg-white/5 rounded-full blur-lg" />
          </div>

          <div className="px-6 -mt-8 relative z-10">
            {/* Stats Cards */}
            {dashboardError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm mb-2">{dashboardError}</p>
                <button
                  onClick={handleRefresh}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm"
                >
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <StatsCard
                  title="Total"
                  value={dashboardData.statistics.total}
                  icon={Calendar}
                  color="blue"
                  loading={dashboardLoading}
                />
                <StatsCard
                  title="Pending"
                  value={dashboardData.statistics.pending}
                  icon={Clock}
                  color="amber"
                  loading={dashboardLoading}
                />
                <StatsCard
                  title="Approved"
                  value={dashboardData.statistics.approved}
                  icon={CheckCircle}
                  color="green"
                  loading={dashboardLoading}
                />
                <StatsCard
                  title="Rejected"
                  value={dashboardData.statistics.rejected}
                  icon={XCircle}
                  color="red"
                  loading={dashboardLoading}
                />
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Leave Applications
              </h2>
            </div>

            {/* Upcoming Leave */}
            {dashboardData.upcoming_leave &&
              dashboardData.upcoming_leave.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-3">
                    Upcoming Leave
                  </h2>
                  <div className="space-y-2">
                    {dashboardData.upcoming_leave.map((leave, index) => (
                      <div
                        key={index}
                        className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-blue-900">
                              {leave.leave_type?.name}
                            </p>
                            <p className="text-sm text-blue-700">
                              {formatDate(leave.start_date)} -{" "}
                              {formatDate(leave.end_date)}
                            </p>
                          </div>
                          <span className="text-sm font-medium text-blue-600">
                            {leave.total_leave_days} days
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Filter Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
              <FilterTab
                active={activeFilter === "pending"}
                onClick={() => handleFilterChange("pending")}
                icon={Clock}
              >
                Pending
              </FilterTab>
              <FilterTab
                active={activeFilter === "approved"}
                onClick={() => handleFilterChange("approved")}
                icon={CheckCircle}
              >
                Approved
              </FilterTab>
              <FilterTab
                active={activeFilter === "rejected"}
                onClick={() => handleFilterChange("rejected")}
                icon={XCircle}
              >
                Rejected
              </FilterTab>
            </div>

            {/* Applications List */}
            <div className="h-96 overflow-y-auto space-y-4 mb-3 scrollbar-hide">
              {applicationsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading applications...</p>
                </div>
              ) : applicationsError ? (
                <div className="text-center py-8">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 mb-2">{applicationsError}</p>
                    <button
                      onClick={handleRefresh}
                      className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : displayApplications.length === 0 ? (
                <div className="text-center py-8">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">No applications found</p>
                  </div>
                </div>
              ) : (
                displayApplications.map((application, index) => (
                  <LeaveApplicationItem
                    key={application.id || index}
                    application={application}
                    onStatusClick={handleStatusClick}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        <Navbar />
      </div>
    </AuthGuard>
  );
}
