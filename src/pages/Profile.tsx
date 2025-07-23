import { Mail, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Navbar from "../component/navbar";

export default function Profile() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Show SweetAlert confirmation
    const result = await Swal.fire({
      title: "Konfirmasi Logout",
      text: "Apakah Anda yakin ingin keluar dari aplikasi?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#f97316", // Orange color to match theme
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

      // Show loading alert
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
        // Get auth token
        const token = localStorage.getItem("authToken");

        // Call logout API
        await axios.post(
          "/api/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );

        // Clear stored authentication data after successful API call
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");

        // Show success message
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

        // Redirect to login page
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Logout error:", error);

        // Clear local data even if API fails
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");

        // Show warning but still proceed with logout
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

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl overflow-hidden shadow-2xl relative main-container mobile-container">
      {/* Scrollable Content Area */}
      <div className="content-area scrollbar-hide">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => navigate(-1)}
          >
            <i className="fas fa-arrow-left text-gray-600 text-lg" />
          </button>
          <h1 className="text-xl font-semibold text-gray-800">Profil</h1>
          <div className="w-10" />
        </div>

        {/* Profile Photo */}
        <div className="flex justify-center px-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="text-center px-6 mt-4">
          <h2 className="text-xl font-bold text-gray-800">Lukman Ganteng</h2>
          <p className="text-gray-500 text-sm mt-1">Fullstack Web Developer</p>
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
                defaultValue="lukmanhakim1234@gmail.com"
                className="w-full px-4 py-3 border-2 border-orange-300 shadow-md rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                readOnly={true}
                disabled={true}
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
                defaultValue="081123123456"
                className="w-full px-4 py-3 border-2 border-orange-300 shadow-md rounded-xl bg-gray-100 text-gray-600 cursor-not-allowed"
                readOnly={true}
                disabled={true}
                tabIndex={-1}
              />
              <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-400 w-5 h-5" />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-500 text-sm font-medium mb-2">
              Address :
            </label>
            <div className="relative">
              <textarea
                rows={3}
                className="w-full px-4 py-3 border-2 border-orange-300 shadow-md rounded-xl bg-gray-100 text-gray-600 resize-none cursor-not-allowed"
                readOnly={true}
                disabled={true}
                tabIndex={-1}
                defaultValue="Jalan Raya Babakan Serang Desa Bojonggebang Kec. Babakan Kab. Cirebon"
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
            <i
              className={`fas ${
                isLoggingOut ? "fa-spinner fa-spin" : "fa-sign-out-alt"
              }`}
            />
            {isLoggingOut ? "LOGGING OUT..." : "LOGOUT"}
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <Navbar />
    </div>
  );
}
