import { useState } from "react";
// useNavigate tidak digunakan di komponen ini lagi jika navigasi terjadi di luar
// Namun, kita akan tetap menyimpannya jika diperlukan untuk logika masa depan
import { useNavigate } from "react-router-dom"; 
// Ganti dengan path logo Anda yang sesuai dengan tema gelap atau terang
// Untuk contoh ini, saya akan asumsikan logo Anda bekerja dengan baik di latar belakang gelap
import Logo from "/assets/images/logoputih.png"; 
import { apiClient } from "../services/api";

// Komponen Ikon untuk kemudahan penggunaan
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect width="20" height="16" x="2" y="4" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const SpinnerIcon = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


export default function Login() {
  // --- LOGIC TETAP SAMA ---
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError("");
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Mohon isi semua field yang diperlukan.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      if (data.success && data.user) {
        const token = data.token;
        const userData = data.user;

        if (token) {
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user_data", JSON.stringify(userData));
          setFormData({ email: "", password: "" });
          navigate("/home");
        } else {
          setError("Token tidak ditemukan dalam response. Silakan coba lagi.");
        }
      } else {
        setError("Login gagal. Response tidak valid.");
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage =
          error.response.data?.message ||
          "Login gagal. Periksa email dan password Anda.";
        setError(errorMessage);
      } else if (error.request) {
        setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  // --- AKHIR DARI LOGIC YANG SAMA ---

  // --- UI BARU DIMULAI DI SINI ---
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 selection:bg-orange-500 selection:text-white">
      <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-orange-600 rounded-full opacity-20 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-sky-500 rounded-full opacity-20 blur-3xl animate-pulse animation-delay-4000"></div>
      </div>
      
      <div className="w-full max-w-md bg-gray-800/60 backdrop-blur-lg rounded-2xl shadow-2xl p-8 z-10">
        <div className="flex flex-col items-center mb-8">
          <img
            className="w-24 h-24 mb-4"
            src={Logo}
            alt="Company Logo"
          />
          <h1 className="text-2xl font-bold tracking-tight">
            Leave Application
          </h1>
          <p className="text-orange-400 font-semibold mt-1">
            PT Bara Reca Niroga
          </p>
        </div>

        {/* Tampilan Error yang lebih modern */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-300 text-sm rounded-lg p-3 mb-6 text-center transition-all duration-300">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Input Email dengan Ikon */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Username / Email
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MailIcon />
              </span>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Masukkan username atau email"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Input Password dengan Ikon */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <LockIcon />
              </span>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Masukkan password"
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-orange-700 disabled:bg-orange-800 disabled:cursor-not-allowed transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-500/50"
          >
            {isLoading && <SpinnerIcon />}
            {isLoading ? "Memproses..." : "LOGIN"}
          </button>
        </form>
      </div>
    </div>
  );
}
