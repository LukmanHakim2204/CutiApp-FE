import { ArrowLeft, LogOutIcon, Mail, MapPin, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Navbar from "../component/Navbar";
import AuthGuard from "../component/AuthGuard";
import {
  apiClient,
  isAuthenticated,
  getCurrentUser,
  apiService,
} from "../services/api";
import type { User } from "../types/type";

export default function Profile() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8000/storage";

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);

        // First get local user data
        const localUser = getCurrentUser();

        if (localUser) {
          setUser(localUser);
        }

        // Then fetch from API if authenticated
        if (isAuthenticated()) {
          try {
            const apiResponse = await apiService.getUserProfile();

            // Handle different response formats
            let actualUser: User | null = null;

            if (apiResponse && typeof apiResponse === "object") {
              // Check if response has 'user' property (wrapped format)
              if ("user" in apiResponse && apiResponse.user) {
                actualUser = apiResponse.user as User;
              }
              // Check if response is direct user object
              else if (
                "id" in apiResponse ||
                "name" in apiResponse ||
                "email" in apiResponse
              ) {
                actualUser = apiResponse as User;
              }
              // Fallback to local data
              else {
                actualUser = localUser;
              }
            } else {
              actualUser = localUser;
            }

            if (actualUser) {
              setUser(actualUser);
              // Update localStorage with fresh data
              localStorage.setItem("user_data", JSON.stringify(actualUser));
            }
          } catch {
            // Keep using local data if API fails
          }
        }
      } catch {
        // Handle global errors silently
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar dari aplikasi?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Ya, Logout",
      cancelButtonText: "Batal",
      reverseButtons: true,
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-xl font-semibold",
        cancelButton: "rounded-xl font-semibold",
      },
    });

    if (result.isConfirmed) {
      setIsLoggingOut(true);

      Swal.fire({
        title: "Logging out...",
        text: "Mohon tunggu sebentar",
        icon: "info",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
        customClass: {
          popup: "rounded-2xl",
        },
      });

      try {
        await apiClient.post("/logout");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");

        await Swal.fire({
          title: "Logout Berhasil!",
          text: "Anda telah berhasil keluar dari aplikasi",
          icon: "success",
          confirmButtonColor: "#f97316",
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-2xl",
            confirmButton: "rounded-xl font-semibold",
          },
        });

        navigate("/", { replace: true });
      } catch {
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");

        await Swal.fire({
          title: "Logout Berhasil",
          text: "Sesi lokal telah dihapus. Anda akan diarahkan ke halaman login.",
          icon: "warning",
          confirmButtonColor: "#f97316",
          confirmButtonText: "OK",
          customClass: {
            popup: "rounded-2xl",
            confirmButton: "rounded-xl font-semibold",
          },
        });

        navigate("/", { replace: true });
      } finally {
        setIsLoggingOut(false);
      }
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative main-container mobile-container">
          <div className="content-area flex items-center justify-center">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading profile...</p>
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative main-container mobile-container">
        <div className="content-area scrollbar-hide">
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <Link
              to="/home"
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="text-gray-600 w-6 h-6" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-800">Profil</h1>
            <div className="w-10" />
          </div>

          {/* Profile Photo */}
          <div className="flex justify-center px-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                {user?.employee?.profile_picture ? (
                  <img
                    src={`${baseUrl}/${user.employee.profile_picture}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : null}
                {/* Default Avatar - Always rendered but hidden when image loads */}
                <div
                  className={`absolute inset-0 flex items-center justify-center text-white ${
                    user?.employee?.profile_picture
                      ? "opacity-0"
                      : "opacity-100"
                  }`}
                >
                  <i className="fas fa-user text-3xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="text-center px-6 mt-4">
            <h2 className="text-xl font-bold text-gray-800">
              {user?.employee?.name || user?.name || "No Name"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {user?.employee?.position?.name || "Employee"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="px-6 mt-8 space-y-6">
            {/* Email */}
            <div>
              <label className="block text-gray-500 text-sm font-medium mb-2">
                Email :
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email || "N/A"}
                  className="w-full px-4 py-3 border-2 border-orange-300 shadow-md rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                  readOnly
                  disabled
                  tabIndex={-1}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-500 text-sm font-medium mb-2">
                Phone :
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={user?.employee?.employee_phone || "N/A"}
                  className="w-full px-4 py-3 border-2 border-orange-300 shadow-md rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                  readOnly
                  disabled
                  tabIndex={-1}
                />
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-500 text-sm font-medium mb-2">
                Alamat :
              </label>
              <div className="relative">
                <textarea
                  rows={3}
                  value={user?.employee?.permanent_address || "N/A"}
                  className="w-full px-4 py-3 pr-12 border-2 border-orange-300 shadow-md rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed resize-none"
                  readOnly
                  disabled
                  tabIndex={-1}
                />
                <MapPin className="absolute right-4 top-4 text-orange-400 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="px-6 mt-8 pb-32">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 ${
                isLoggingOut
                  ? "bg-orange-400 cursor-not-allowed text-white"
                  : "bg-orange-500 hover:bg-orange-600 text-white cursor-pointer"
              }`}
            >
              <LogOutIcon className="w-5 h-5" />
              {isLoggingOut ? "LOGGING OUT..." : "LOGOUT"}
            </button>
          </div>
        </div>

        <Navbar />
      </div>
    </AuthGuard>
  );
}
