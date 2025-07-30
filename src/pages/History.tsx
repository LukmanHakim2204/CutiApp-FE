import { ArrowLeft, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

// Import your actual components
import Navbar from "../component/Navbar";
import AuthGuard from "../component/AuthGuard";
import type { LeaveApplication } from "../types/type";
import { Link } from "react-router";

interface ApiResponse {
  data?: LeaveApplication[];
  message?: string;
}

export default function History() {
  const [leaveApplications, setLeaveApplications] = useState<
    LeaveApplication[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leave applications from API
  useEffect(() => {
    const fetchLeaveApplications = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state

        // Get token from localStorage (adjust based on your auth implementation)
        const token: string | null =
          localStorage?.getItem("auth_token") || localStorage?.getItem("token");

        // Check if token exists
        if (!token) {
          throw new Error("No authentication token found. Please login again.");
        }

        // Make sure to use the full URL if your frontend and backend are on different ports
        const baseURL = "https://dashbar.barareca.co.id";
        const response = await axios.get<ApiResponse>(
          `${baseURL}/api/leave-applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            timeout: 10000, // 10 second timeout
          }
        );

        // Handle different response structures
        if (response.data) {
          setLeaveApplications(
            response.data.data || (response.data as LeaveApplication[]) || []
          );
        } else {
          setLeaveApplications([]);
        }
      } catch (err: unknown) {
        // More detailed error handling
        let errorMessage = "Failed to fetch leave applications";

        if (axios.isAxiosError(err)) {
          if (err.code === "ECONNABORTED") {
            errorMessage = "Request timeout. Please check your connection.";
          } else if (err.response) {
            // Server responded with error status
            const status = err.response.status;
            switch (status) {
              case 401:
                errorMessage = "Unauthorized. Please login again.";
                break;
              case 403:
                errorMessage =
                  "Forbidden. You don't have permission to access this resource.";
                break;
              case 404:
                errorMessage =
                  "API endpoint not found. Please check the server.";
                break;
              case 500:
                errorMessage = "Internal server error. Please try again later.";
                break;
              default:
                errorMessage =
                  err.response?.data?.message || `Server error (${status})`;
            }
          } else if (err.request) {
            // Network error
            errorMessage =
              "Network error. Please check if the server is running on https://dashbar.barareca.co.id";
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        setError(errorMessage);

        // Add mock data for demonstration when API fails
      } finally {
        setLoading(false);
      }
    };

    fetchLeaveApplications();
  }, []);

  // Retry function
  const retryFetch = (): void => {
    setError(null);
    setLoading(true);
    // Re-trigger the useEffect
    window.location.reload();
  };

  // Format date range
  const formatDateRange = (startDate: string, endDate: string): string => {
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    };

    if (startDate === endDate) {
      return formatDate(startDate);
    }
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  // Get status badge styling
  const getStatusBadge = (status: string): string => {
    const baseClasses = "px-3 py-1.5 rounded-full text-xs font-bold";

    switch (status?.toLowerCase()) {
      case "approved":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Calculate total days between two dates
  const calculateTotalDays = (startDate: string, endDate: string): number => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates
  };

  return (
    <AuthGuard>
      <div
        className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative"
        style={{ height: "100vh" }}
      >
        {/* Scrollable Content Area */}
        <div className="h-full overflow-y-auto pb-20">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <Link
              to="/home"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">
              History Leave Application
            </h1>
            <div className="w-10" />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-600">
                Loading applications...
              </span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mx-6 mb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm font-medium">Error:</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <div className="mt-3 space-x-2">
                  <button
                    onClick={retryFetch}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => setError(null)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                  >
                    Continue with Demo Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Leave Applications List */}
          {!loading && (
            <div className="px-6 space-y-4 pb-8">
              {leaveApplications.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">No leave applications found</p>
                </div>
              ) : (
                leaveApplications.map((application: LeaveApplication) => (
                  <div
                    key={application.id}
                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">
                          Date
                        </div>
                        <h3 className="font-bold text-gray-800">
                          {formatDateRange(
                            application.start_date,
                            application.end_date
                          )}
                        </h3>
                      </div>
                      <span className={getStatusBadge(application.status)}>
                        {application.status?.charAt(0).toUpperCase() +
                          application.status?.slice(1) || "Unknown"}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          Total Days
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                          {application.total_leave_days ||
                            calculateTotalDays(
                              application.start_date,
                              application.end_date
                            )}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          Leave Balance
                        </div>
                        <div className="text-2xl font-bold text-gray-800">
                          {application.leave_balance || 0}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500 mb-1">
                          Approved By
                        </div>
                        <div className="text-xs font-medium text-gray-700">
                          {application.leave_approver?.name || "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1 text-center justify-between">
                      {/* Additional Info */}
                      {application.leave_type?.name && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs text-blue-500 mb-1">
                            Leave Type
                          </div>
                          <p className="text-sm text-blue-700">
                            {application.leave_type.name}
                          </p>
                        </div>
                      )}

                      {application.employee?.name && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <div className="text-xs text-gray-500 mb-1">
                            Employee
                          </div>
                          <p className="text-sm text-gray-700">
                            {application.employee.name}
                          </p>
                          {application.division?.name && (
                            <p className="text-xs text-gray-500 mt-1">
                              Division: {application.division.name}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation - Fixed */}
        <div className="absolute bottom-0 left-0 right-0">
          <Navbar />
        </div>
      </div>
    </AuthGuard>
  );
}
