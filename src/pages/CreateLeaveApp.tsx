import {
  ArrowLeft,
  Plus,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  Loader2,
  Building,
  UserIcon,
  FileX,
} from "lucide-react";
import { useState, useEffect } from "react";
import Navbar from "../component/Navbar";
import type { DisplayData, FormData, LeaveBalance, LeaveType, User } from "../types/type";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

// API Configuration
const API_BASE_URL = "http://localhost:8000/api";
const API_KEY = "Lukman321";


// Interface untuk data yang dikirim ke API
interface LeaveApplicationData {
  employee_id: number | null;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  reason: string;
  division_id: number | null;
  leave_approver_id: number | null;
  status: string;
}

// Updated interface to match your API response
interface LeaveAllocationResponse {
  leave_type_id: number;
  leave_type_name: string;
  allocated_days: number;
  remaining_days: number;
  status: "available" | "limited" | "exhausted";
  allocation_period: {
    start_date: string;
    end_date: string;
  };
}

// Interface for the complete API response
interface LeaveAllocationApiResponse {
  data: LeaveAllocationResponse[];
  meta: {
    employee_id: string;
    total_records: number;
    generated_at: string;
  };
}

// Create a simple HTTP client using fetch (simulating axios interface)
const httpClient = {
  async get<T>(endpoint: string): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    // Check if this is the leave types or holidays endpoint
    const isLeaveTypesEndpoint =
      endpoint === "/leavetypes" || endpoint.endsWith("/leavetypes");
    const isHolidaysEndpoint =
      endpoint === "/holidaylist" || endpoint.endsWith("/holidaylist");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const token = localStorage.getItem("auth_token");
    if (isLeaveTypesEndpoint || isHolidaysEndpoint) {
      headers["X-API-KEY"] = API_KEY;
    } else if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  },

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem("auth_token");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();

      let errorData: Record<string, unknown> = {};
      try {
        errorData = JSON.parse(errorText);
      } catch {
        // If response is not JSON, use the text as error message
        errorData = { message: errorText };
      }

      const errorMessage =
        (errorData.message as string) ||
        (errorData.error as string) ||
        `HTTP ${response.status}: ${response.statusText}`;

      // Include validation errors if available
      if (errorData.errors) {
        const validationErrorMessages = Object.entries(
          errorData.errors as Record<string, string[]>
        )
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("\n");
        throw new Error(
          `${errorMessage}\n\nValidation Details:\n${validationErrorMessages}`
        );
      }
      throw new Error(errorMessage);
    }
    return await response.json();
  },
};

export default function CreateLeaveApp() {
  const [formData, setFormData] = useState<FormData>({
    leave_type_id: "",
    start_date: "",
    end_date: "",
    reason: "",
    employee_id: null,
    division_id: null,
    leave_approver_id: null,
  });

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string[]>
  >({});
  const [holidays, setHolidays] = useState<string[]>([]);

  // Updated state for leave allocations from API
  const [leaveAllocations, setLeaveAllocations] = useState<
    LeaveAllocationResponse[]
  >([]);
  const [loadingAllocations, setLoadingAllocations] = useState<boolean>(false);
  const [allocationError, setAllocationError] = useState<string>("");
  const [hasNoAllocations, setHasNoAllocations] = useState<boolean>(false);

  // Default colors for different leave types
  const defaultColors = [
    "orange",
    "red",
    "blue",
    "purple",
    "green",
    "yellow",
    "indigo",
    "pink",
  ];

  // Updated fetch leave allocations function
  const fetchLeaveAllocations = async (employeeId: number): Promise<void> => {
    if (!employeeId) return;

    setLoadingAllocations(true);
    setAllocationError("");
    setHasNoAllocations(false);

    try {
      const response = await httpClient.get<LeaveAllocationApiResponse>(
        `/leave-allocations?employee_id=${employeeId}`
      );

      // Handle the response structure
      let allocations: LeaveAllocationResponse[] = [];

      if (response && response.data && Array.isArray(response.data)) {
        allocations = response.data;
      } else if (Array.isArray(response)) {
        // Fallback if response is directly an array
        allocations = response;
      }

      // Check if no allocations found
      if (allocations.length === 0) {
        setHasNoAllocations(true);
      }

      setLeaveAllocations(allocations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";

      // Check if it's a 404 error (not found)
      if (errorMessage.includes("404")) {
        setHasNoAllocations(true);
        setAllocationError("");
      } else {
        setAllocationError(`Failed to load leave allocations: ${errorMessage}`);
      }
    } finally {
      setLoadingAllocations(false);
    }
  };

  // Updated fetchHolidays function to use API key
  const fetchHolidays = async (): Promise<void> => {
    try {
      const response = await httpClient.get<{ date: string }[]>("/holidaylist");
      const holidayDates = response.map((holiday) => holiday.date);
      setHolidays(holidayDates);
    } catch {
      // Log error but continue without holidays data
    }
  };

  // Updated function to convert API response to LeaveBalance format
  const getLeaveBalanceFromAPI = (leaveTypeId: number): LeaveBalance | null => {
    if (!Array.isArray(leaveAllocations) || leaveAllocations.length === 0) {
      return null;
    }

    const allocation = leaveAllocations.find(
      (alloc) => alloc.leave_type_id === leaveTypeId
    );

    if (!allocation) {
      return null;
    }

    // Calculate used days from allocated and remaining
    const total = allocation.allocated_days;
    const remaining = allocation.remaining_days;
    const used = total - remaining;

    return {
      total,
      used,
      remaining,
      color: defaultColors[(leaveTypeId - 1) % defaultColors.length],
      name: allocation.leave_type_name,
      leave_type_id: leaveTypeId,
    };
  };

  // Function to get all available leave types with their balances
  const getAllLeaveBalances = (): LeaveBalance[] => {
    const balances: LeaveBalance[] = [];

    // Get from API allocations
    leaveAllocations.forEach((allocation) => {
      const total = allocation.allocated_days;
      const remaining = allocation.remaining_days;
      const used = total - remaining;

      balances.push({
        total,
        used,
        remaining,
        color:
          defaultColors[(allocation.leave_type_id - 1) % defaultColors.length],
        name: allocation.leave_type_name,
        leave_type_id: allocation.leave_type_id,
      });
    });

    return balances;
  };

  // Fetch leave types, user data, and holidays on component mount
  useEffect(() => {
    fetchCurrentUser();
    fetchLeaveTypes();
    fetchHolidays(); // This will now use API key
  }, []);

  // Fetch leave allocations when employee data is available
  useEffect(() => {
    if (currentUser?.employee?.id || currentUser?.id) {
      const employeeId = currentUser.employee?.id || currentUser.id;
      fetchLeaveAllocations(employeeId);
    }
  }, [currentUser]);

  // State terpisah untuk data display
  const [displayData, setDisplayData] = useState<DisplayData>({
    employee_name: "",
    division_name: "",
    leave_approver_name: "",
  });

  const fetchCurrentUser = async (): Promise<void> => {
    try {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        const user: User = JSON.parse(userData);
        setCurrentUser(user);

        // Set form data - hanya ID
        setFormData((prev) => ({
          ...prev,
          employee_id: user.employee?.id || user.id,
          division_id: user.employee?.division?.id || null,
          leave_approver_id: user.employee?.leaveApprover?.id || null,
        }));

        // Set display data - nama untuk ditampilkan
        setDisplayData({
          employee_name: user.employee?.name || user.name || "Not assigned",
          division_name: user.employee?.division?.name || "Not assigned",
          leave_approver_name:
            user.employee?.leaveApprover?.name || "Not assigned",
        });
      } else {
        // Fallback: fetch from API
        const response = await httpClient.get<
          { success?: boolean; user?: User } | User
        >("/user");

        let user: User;
        if ("user" in response && response.user) {
          user = response.user;
        } else if (
          "id" in response &&
          "name" in response &&
          "email" in response
        ) {
          user = response as User;
        } else {
          throw new Error("Invalid user data received from API");
        }

        setCurrentUser(user);
        localStorage.setItem("user_data", JSON.stringify(user));

        // Set form data - hanya ID
        setFormData((prev) => ({
          ...prev,
          employee_id: user.employee?.id || user.id,
          division_id: user.employee?.division?.id || null,
          leave_approver_id: user.employee?.leaveApprover?.id || null,
        }));

        // Set display data - nama untuk ditampilkan
        setDisplayData({
          employee_name: user.employee?.name || user.name || "Not assigned",
          division_name: user.employee?.division?.name || "Not assigned",
          leave_approver_name:
            user.employee?.leaveApprover?.name || "Not assigned",
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load user data: ${errorMessage}`);
    }
  };

  const fetchLeaveTypes = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const response = await httpClient.get<
        LeaveType[] | { data: LeaveType[] }
      >("/leavetypes");

      // Handle different response formats
      const types: LeaveType[] = Array.isArray(response)
        ? response
        : response.data || [];
      setLeaveTypes(types);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(`Failed to load leave types: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (error) setError("");
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const calculateLeaveDays = (): number => {
    if (formData.start_date && formData.end_date) {
      const from = new Date(formData.start_date);
      const to = new Date(formData.end_date);
      const diffTime = Math.abs(to.getTime() - from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const isWeekend = (date: Date): boolean => {
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  // Helper function to format date for API (ensure Y-m-d format)
  const formatDateForAPI = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // This ensures Y-m-d format
  };

  // Validasi form berdasarkan tipe cuti
  // Enhanced validation function
  const validateForm = (): string[] => {
    const errors: string[] = [];
    const leaveDays = calculateLeaveDays();
    const balance = getCurrentBalance();

    if (!formData.leave_type_id) errors.push("Tipe cuti harus dipilih");
    if (!formData.start_date) errors.push("Tanggal mulai harus diisi");
    if (!formData.end_date) errors.push("Tanggal selesai harus diisi");

    // Enhanced reason validation (min 10 characters)
    if (!formData.reason) {
      errors.push("Alasan cuti harus diisi");
    } else if (formData.reason.trim().length < 10) {
      errors.push("Alasan cuti minimal 10 karakter");
    } else if (formData.reason.trim().length > 500) {
      errors.push("Alasan cuti maksimal 500 karakter");
    }

    if (!formData.employee_id) errors.push("Data employee tidak tersedia");
    if (!formData.division_id) errors.push("Data divisi tidak tersedia");
    if (!formData.leave_approver_id)
      errors.push("Data leave approver tidak tersedia");

    // Enhanced date validation
    if (formData.start_date && formData.end_date) {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Check if dates are in the past
      if (startDate < today) {
        errors.push("Tanggal mulai tidak boleh kurang dari hari ini");
      }

      if (endDate < startDate) {
        errors.push("Tanggal selesai tidak boleh kurang dari tanggal mulai");
      }

      // Check for weekends
      if (isWeekend(startDate)) {
        errors.push("Tanggal mulai tidak boleh di akhir pekan (Sabtu/Minggu)");
      }

      if (isWeekend(endDate)) {
        errors.push(
          "Tanggal selesai tidak boleh di akhir pekan (Sabtu/Minggu)"
        );
      }

      // Check for holidays
      if (holidays.includes(formData.start_date)) {
        errors.push("Tanggal mulai tidak boleh pada hari libur");
      }

      if (holidays.includes(formData.end_date)) {
        errors.push("Tanggal selesai tidak boleh pada hari libur");
      }

      // Check maximum 30 days
      const diffInDays = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffInDays > 30) {
        errors.push("Periode cuti tidak boleh lebih dari 30 hari");
      }
    }

    // Balance validation (only if we have allocation data)
    if (
      formData.leave_type_id &&
      balance &&
      leaveDays > 0 &&
      !hasNoAllocations
    ) {
      if (leaveDays > balance.remaining) {
        errors.push(`Saldo cuti ${balance.name} tidak mencukupi`);
      }
    }

    // If no allocations, add specific error
    if (hasNoAllocations && formData.leave_type_id) {
      errors.push("Tidak ada alokasi cuti tersedia untuk employee ini");
    }

    return errors;
  };

  const handleSubmit = async (): Promise<void> => {
    const errors = validateForm();
    if (errors.length > 0) {
      setError("Validation errors:\n" + errors.join("\n"));
      return;
    }

    if (!currentUser) {
      setError("User data not available. Please refresh the page.");
      return;
    }

    setSubmitting(true);
    setError("");
    setValidationErrors({});

    try {
      // Prepare data for API with properly formatted dates
      const submitData: LeaveApplicationData = {
        employee_id: formData.employee_id,
        leave_type_id: parseInt(formData.leave_type_id),
        start_date: formatDateForAPI(formData.start_date), // Ensure proper format
        end_date: formatDateForAPI(formData.end_date), // Ensure proper format
        reason: formData.reason.trim(), // Trim whitespace
        division_id: formData.division_id,
        leave_approver_id: formData.leave_approver_id,
        status: "pending",
      };

      await httpClient.post("/leave-applications", submitData);

      // Reset form
      setFormData((prev) => ({
        leave_type_id: "",
        start_date: "",
        end_date: "",
        reason: "",
        employee_id: prev.employee_id,
        division_id: prev.division_id,
        leave_approver_id: prev.leave_approver_id,
      }));

      // Refresh leave allocations
      if (currentUser?.employee?.id || currentUser?.id) {
        const employeeId = currentUser.employee?.id || currentUser.id;
        fetchLeaveAllocations(employeeId);
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Pengajuan cuti berhasil dibuat!",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "OK",
      });
    } catch (err) {
      if (err instanceof Error) {
        // Parse validation errors from Laravel response
        const errorMessage = err.message;

        // Check if it's a validation error with details
        if (errorMessage.includes("Validation Details:")) {
          setError(errorMessage);
        } else {
          // Try to parse JSON error for better display
          try {
            const errorData = JSON.parse(errorMessage);
            if (errorData.errors) {
              setValidationErrors(errorData.errors);
              setError("Validation failed. Please check the form fields.");
            } else {
              setError(
                `Failed to create leave application: ${
                  errorData.message || errorMessage
                }`
              );
            }
          } catch {
            setError(`Failed to create leave application: ${errorMessage}`);
          }
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Updated getCurrentBalance function
  const getCurrentBalance = (): LeaveBalance | null => {
    const leaveTypeId = parseInt(formData.leave_type_id);

    // If no allocations available, return null
    if (hasNoAllocations) {
      return null;
    }

    // Try to get from API first
    if (leaveTypeId && !isNaN(leaveTypeId)) {
      const apiBalance = getLeaveBalanceFromAPI(leaveTypeId);
      if (apiBalance) {
        return apiBalance;
      }
    }

    return null;
  };

  const getSelectedLeaveType = (): LeaveType | undefined => {
    const leaveTypeId = parseInt(formData.leave_type_id);
    return leaveTypes.find((type) => type.id === leaveTypeId);
  };

  const getColorClasses = (color: string): string => {
    const colors: Record<string, string> = {
      orange: "bg-orange-500",
      red: "bg-red-500",
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      indigo: "bg-indigo-500",
      pink: "bg-pink-500",
    };
    return colors[color] || colors.orange;
  };

  const currentBalance = getCurrentBalance();
  const selectedLeaveType = getSelectedLeaveType();
  const leaveDays = calculateLeaveDays();
  const clientValidationErrors = validateForm();

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative main-container mobile-container">
      {/* Scrollable Content Area */}
      <div className="content-area scrollbar-hide overflow-y-auto h-screen pb-32">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 bg-white sticky top-0 z-10">
          <Link
            to={"/home"}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <ArrowLeft className="text-gray-600" />
          </Link>
          <h1 className="text-xl font-semibold text-gray-800">
            Pengajuan Cuti
          </h1>
          <div className="w-10" />
        </div>

        {/* Leave Balance Information */}
        <div className="px-6 pb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {selectedLeaveType
                ? selectedLeaveType.name
                : "Saldo Cuti Saat Ini"}
            </h3>
            <p className="text-gray-600 text-sm">
              {selectedLeaveType
                ? `Informasi saldo untuk ${selectedLeaveType.name}`
                : "Informasi saldo cuti untuk periode aktif"}
            </p>

            {/* Loading indicator for allocations */}
            {loadingAllocations && (
              <div className="flex items-center gap-2 mt-2">
                <Loader2 size={14} className="animate-spin text-blue-500" />
                <span className="text-sm text-blue-600">
                  Loading saldo cuti...
                </span>
              </div>
            )}

            {/* Error indicator for allocations */}
            {allocationError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                <div className="flex items-center gap-2">
                  <AlertCircle size={16} className="text-red-600" />
                  <span className="text-sm text-red-800">
                    {allocationError}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Updated Leave Balance Table */}
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-5 gap-2 p-4 text-xs font-medium text-gray-300 border-b border-gray-700">
              <div>Jenis Cuti</div>
              <div>Alokasi</div>
              <div>Terpakai</div>
              <div>Sisa</div>
              <div>Status</div>
            </div>

            {/* Show Not Found if no allocations */}
            {hasNoAllocations && !loadingAllocations ? (
              <div className="p-8 text-center">
                <FileX size={48} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-300 mb-2">
                  Not Found
                </h3>
                <p className="text-sm text-gray-400">
                  Tidak ada alokasi cuti ditemukan untuk employee ini.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Silakan hubungi administrator untuk mengatur alokasi cuti.
                </p>
              </div>
            ) : (
              <>
                {/* Table Rows - Show all leave types or just selected one */}
                {selectedLeaveType && currentBalance ? (
                  // Show only selected leave type
                  <div className="grid grid-cols-5 gap-2 p-4 text-xs text-gray-300 items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 ${getColorClasses(
                          currentBalance.color
                        )} rounded-full`}
                      ></div>
                      <span className="truncate">{currentBalance.name}</span>
                    </div>
                    <div>{currentBalance.total} hari</div>
                    <div>{currentBalance.used} hari</div>
                    <div>{currentBalance.remaining} hari</div>
                    <div>
                      <span className="inline-flex items-center gap-1 text-xs">
                        <div
                          className={`w-2 h-2 ${
                            currentBalance.remaining > 0
                              ? "bg-green-500"
                              : "bg-red-500"
                          } rounded-full`}
                        ></div>
                        {currentBalance.remaining > 0 ? "Tersedia" : "Habis"}
                      </span>
                    </div>
                  </div>
                ) : (
                  // Show all leave types when none selected
                  getAllLeaveBalances().map((balance) => (
                    <div
                      key={balance.leave_type_id}
                      className="grid grid-cols-5 gap-2 p-4 text-xs text-gray-300 items-center border-b border-gray-800 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 ${getColorClasses(
                            balance.color
                          )} rounded-full`}
                        ></div>
                        <span className="truncate">{balance.name}</span>
                      </div>
                      <div>{balance.total} hari</div>
                      <div>{balance.used} hari</div>
                      <div>{balance.remaining} hari</div>
                      <div>
                        <span className="inline-flex items-center gap-1 text-xs">
                          <div
                            className={`w-2 h-2 ${
                              balance.remaining > 0
                                ? "bg-green-500"
                                : "bg-red-500"
                            } rounded-full`}
                          ></div>
                          {balance.remaining > 0 ? "Tersedia" : "Habis"}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
          </div>

          {/* Summary Cards - Only show if there are allocations */}
          {/* Summary Cards - Only show if there are allocations */}
          {!hasNoAllocations && currentBalance && (
            <div className="grid grid-cols-3 gap-3 mt-6 text-center">
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-xl font-bold text-white">
                  {currentBalance.total}
                </div>
                <div className="text-xs text-gray-400">Total Alokasi</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-xl font-bold text-white">
                  {currentBalance.used}
                </div>
                <div className="text-xs text-gray-400">Total Terpakai</div>
              </div>
              <div className="bg-gray-900 rounded-xl p-4">
                <div className="text-xl font-bold text-white">
                  {currentBalance.remaining}
                </div>
                <div className="text-xs text-gray-400">Total Sisa</div>
              </div>
            </div>
          )}
        </div>

        {/* Create Leave Form */}
        <div className="px-6 mb-8">
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-500 rounded-xl">
                <Plus className="text-white" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                Buat Pengajuan Cuti Baru
              </h2>
            </div>

            {/* No Allocations Warning */}
            {hasNoAllocations && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle size={16} className="text-red-600" />
                  <h4 className="font-semibold text-red-900">
                    Tidak Ada Alokasi Cuti
                  </h4>
                </div>
                <p className="text-sm text-red-800">
                  Employee ini belum memiliki alokasi cuti. Silakan hubungi
                  administrator untuk mengatur alokasi cuti sebelum dapat
                  mengajukan cuti.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {/* Employee, Division and Leave Approver - Read Only Fields */}
              <div className="grid grid-cols-1 gap-4">
                {/* Employee Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Employee (ID: {formData.employee_id})
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={displayData.employee_name} // Gunakan displayData
                      readOnly
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed pl-12"
                    />
                    <UserIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                  {!formData.employee_id && (
                    <p className="text-sm text-red-600 mt-1">
                      Data employee tidak tersedia. Hubungi administrator.
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Divisi (ID: {formData.division_id})
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={displayData.division_name} // Gunakan displayData
                      readOnly
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed pl-12"
                    />
                    <Building
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                  {!formData.division_id && (
                    <p className="text-sm text-red-600 mt-1">
                      Data divisi tidak tersedia. Hubungi administrator.
                    </p>
                  )}
                </div>
                {/* Leave Approver Field */}
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Leave Approver (ID: {formData.leave_approver_id})
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={displayData.leave_approver_name} // Gunakan displayData
                      readOnly
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed pl-12"
                    />
                    <UserIcon
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                  {!formData.leave_approver_id && (
                    <p className="text-sm text-red-600 mt-1">
                      Data leave approver tidak tersedia. Hubungi administrator.
                    </p>
                  )}
                </div>
              </div>

              {/* Leave Type Information */}
              {selectedLeaveType && selectedLeaveType.id === 1 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-blue-600" />
                    <h4 className="font-semibold text-blue-900">
                      Perhatian: Cuti Tahunan
                    </h4>
                  </div>
                  <p className="text-sm text-blue-800">
                    Cuti tahunan harus diajukan minimal 7 hari sebelum tanggal
                    pelaksanaan. Untuk pengajuan hari ini, tanggal mulai minimal
                    adalah{" "}
                    <strong>
                      {new Date(
                        Date.now() + 7 * 24 * 60 * 60 * 1000
                      ).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </strong>
                  </p>
                </div>
              )}

              {/* General Validation Errors */}
              {Object.keys(validationErrors).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={16} />
                    Error Validasi
                  </h4>
                  <div className="text-sm text-red-800 space-y-1">
                    {Object.entries(validationErrors).map(([field, errors]) => (
                      <div key={field}>
                        <strong className="capitalize">
                          {field.replace("_", " ")}:
                        </strong>
                        <ul className="ml-4 list-disc">
                          {(errors as string[]).map(
                            (error: string, index: number) => (
                              <li key={index}>{error}</li>
                            )
                          )}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leave Type */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Tipe Cuti
                </label>
                <div className="relative">
                  <select
                    value={formData.leave_type_id}
                    onChange={(e) =>
                      handleInputChange("leave_type_id", e.target.value)
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-700 bg-white appearance-none ${
                      validationErrors.leave_type_id
                        ? "border-red-300 focus:border-red-500"
                        : "border-orange-200 focus:border-orange-400"
                    }`}
                    disabled={loading || hasNoAllocations}
                  >
                    <option value="">
                      {loading
                        ? "Loading..."
                        : hasNoAllocations
                        ? "Tidak ada alokasi cuti"
                        : "Pilih tipe cuti"}
                    </option>
                    {leaveTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                {validationErrors.leave_type_id && (
                  <div className="mt-1 text-sm text-red-600">
                    {validationErrors.leave_type_id.map(
                      (error: string, index: number) => (
                        <div key={index} className="flex items-center gap-1">
                          <AlertCircle size={14} />
                          {error}
                        </div>
                      )
                    )}
                  </div>
                )}
                {leaveTypes.length === 0 && !loading && (
                  <p className="text-sm text-red-600 mt-1">
                    Failed to load leave types. Please check your API
                    configuration.
                  </p>
                )}
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Tanggal Mulai
                  </label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      handleInputChange("start_date", e.target.value)
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-700 bg-white ${
                      validationErrors.start_date
                        ? "border-red-300 focus:border-red-500"
                        : "border-orange-200 focus:border-orange-400"
                    }`}
                    style={{ colorScheme: "light" }}
                    disabled={hasNoAllocations}
                  />
                  {validationErrors.start_date && (
                    <div className="mt-1 text-sm text-red-600">
                      {validationErrors.start_date.map(
                        (error: string, index: number) => (
                          <div key={index} className="flex items-center gap-1">
                            <AlertCircle size={14} />
                            {error}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Tanggal Selesai
                  </label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      handleInputChange("end_date", e.target.value)
                    }
                    min={
                      formData.start_date ||
                      new Date().toISOString().split("T")[0]
                    }
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-700 bg-white ${
                      validationErrors.end_date
                        ? "border-red-300 focus:border-red-500"
                        : "border-orange-200 focus:border-orange-400"
                    }`}
                    style={{ colorScheme: "light" }}
                    disabled={hasNoAllocations}
                  />
                  {validationErrors.end_date && (
                    <div className="mt-1 text-sm text-red-600">
                      {validationErrors.end_date.map(
                        (error: string, index: number) => (
                          <div key={index} className="flex items-center gap-1">
                            <AlertCircle size={14} />
                            {error}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Auto-calculated Leave Days */}
              {leaveDays > 0 && currentBalance && (
                <div
                  className={`border rounded-xl p-4 ${
                    leaveDays > currentBalance.remaining
                      ? "bg-red-100 border-red-300"
                      : "bg-orange-100 border-orange-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      {leaveDays > currentBalance.remaining ? (
                        <AlertCircle size={16} className="text-red-500" />
                      ) : (
                        <CheckCircle size={16} className="text-green-500" />
                      )}
                      Jumlah Hari Cuti:
                    </span>
                    <span
                      className={`font-bold text-lg ${
                        leaveDays > currentBalance.remaining
                          ? "text-red-600"
                          : "text-orange-600"
                      }`}
                    >
                      {leaveDays} hari
                    </span>
                  </div>
                  {leaveDays > currentBalance.remaining && (
                    <p className="text-sm text-red-600 mt-2">
                      Saldo cuti tidak mencukupi! Sisa:{" "}
                      {currentBalance.remaining} hari
                    </p>
                  )}
                </div>
              )}

              {/* Show leave days calculation even without balance data */}
              {leaveDays > 0 && !currentBalance && hasNoAllocations && (
                <div className="border rounded-xl p-4 bg-gray-100 border-gray-300">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-gray-700 font-medium">
                      <AlertCircle size={16} className="text-gray-500" />
                      Jumlah Hari Cuti:
                    </span>
                    <span className="font-bold text-lg text-gray-600">
                      {leaveDays} hari
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Tidak dapat memvalidasi saldo karena tidak ada alokasi cuti.
                  </p>
                </div>
              )}

              {/* Reason */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Alasan Cuti ({formData.reason.length}/500 karakter)
                </label>
                <textarea
                  rows={3}
                  placeholder="Masukkan alasan pengajuan cuti (minimal 10 karakter)..."
                  value={formData.reason}
                  onChange={(e) => handleInputChange("reason", e.target.value)}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors text-gray-700 placeholder-gray-400 resize-none bg-white ${
                    validationErrors.reason || formData.reason.length < 10
                      ? "border-red-300 focus:border-red-500"
                      : "border-orange-200 focus:border-orange-400"
                  }`}
                  disabled={hasNoAllocations}
                />
                {formData.reason.length > 0 && formData.reason.length < 10 && (
                  <p className="text-sm text-red-600 mt-1">
                    Alasan minimal 10 karakter (saat ini:{" "}
                    {formData.reason.length})
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={
                  clientValidationErrors.length > 0 ||
                  submitting ||
                  loading ||
                  hasNoAllocations
                }
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors duration-200 mt-6 flex items-center justify-center gap-2 ${
                  clientValidationErrors.length > 0 ||
                  submitting ||
                  loading ||
                  hasNoAllocations
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600 text-white"
                }`}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting
                  ? "Mengirim..."
                  : hasNoAllocations
                  ? "Tidak Dapat Mengajukan"
                  : "Buat Pengajuan Cuti"}
              </button>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      size={16}
                      className="text-red-600 mt-0.5 flex-shrink-0"
                    />
                    <div className="text-sm text-red-800">
                      <div className="font-semibold mb-1">Error:</div>
                      <pre className="whitespace-pre-wrap text-xs">{error}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
