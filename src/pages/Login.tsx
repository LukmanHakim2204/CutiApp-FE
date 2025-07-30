import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "/assets/images/logoputih.png";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  // ✅ Fixed: Changed to handle form submission instead of button click
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Mohon isi semua field yang diperlukan.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("https://dashbar.barareca.co.id/api/login", {
        email: formData.email,
        password: formData.password,
      });

      const data = response.data;

      // Login successful - Handle the current backend response format
      if (data.success && data.user) {
        // Token is at top level: data.token (not data.user.token)
        const token = data.token; // ✅ Fixed: Get token from top level
        const userData = data.user; // User data is separate

        if (token) {
          // Store with consistent key names (matching api.ts)
          localStorage.setItem("auth_token", token);
          localStorage.setItem("user_data", JSON.stringify(userData));

          // Clear form
          setFormData({ email: "", password: "" });

          navigate("/home");
        } else {
          setError("Token tidak ditemukan dalam response. Silakan coba lagi.");
        }
      } else {
        setError("Login gagal. Response tidak valid.");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const errorMessage =
            error.response.data?.message ||
            "Login gagal. Periksa email dan password Anda.";
          setError(errorMessage);
        } else if (error.request) {
          // Network error
          setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
        } else {
          // Other error
          setError("Terjadi kesalahan. Silakan coba lagi.");
        }
      } else {
        // Non-axios error
        setError("Terjadi kesalahan yang tidak diketahui.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = (field: string) => {
    setFocusedField(field);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="w-[400px] h-[910px] relative bg-white overflow-hidden rounded-2xl shadow-xl">
          {/* Orange decorative circles */}
          <div className="w-100 h-100 top-[-175px] absolute bg-orange-500 rounded-full justify-center"></div>
          <div className="w-100 h-100 top-[700px] absolute bg-orange-500 rounded-full justify-center"></div>

          {/* Logo placeholder */}
          <img
            className="w-25 h-25 left-1/2 transform -translate-x-12 top-[65px] absolute"
            src={Logo}
            alt="Company Logo"
          />

          {/* Welcome text */}
          <div className="justify-center">
            <h1 className="top-[286px] left-1/2 transform -translate-x-1/2 absolute justify-start text-black text-xl font-bold font-['Inter'] whitespace-nowrap">
              Welcome To Leave Application
            </h1>

            {/* Company name */}
            <h1 className="top-[320px] left-1/2 transform -translate-x-1/2 absolute justify-start text-orange-500 text-xl font-bold font-['Inter']">
              PT Bara Reca Niroga
            </h1>

            {/* Error message */}
            {error && (
              <div className="top-[360px] left-1/2 transform -translate-x-32 absolute w-64 text-red-500 text-xs text-center">
                {error}
              </div>
            )}

            {/* ✅ Fixed: Wrapped inputs in form with onSubmit */}
            <form onSubmit={handleLogin} className="relative z-10">
              {/* email/Email Input */}
              <div
                className={`w-64 h-11 top-[384px] left-1/2 transform -translate-x-32 absolute bg-zinc-300 rounded-[30px] overflow-hidden transition-all duration-200 ${
                  focusedField === "email" ? "ring-2 ring-orange-300" : ""
                }`}
              >
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("email")}
                  onBlur={handleBlur}
                  placeholder="Masukkan Username / Email .."
                  className="w-full h-full px-4 bg-transparent text-neutral-600 text-sm font-light font-['Inter'] outline-none placeholder-neutral-600"
                  disabled={isLoading}
                />
              </div>

              {/* Password Input */}
              <div
                className={`w-64 h-11 top-[467px] left-1/2 transform -translate-x-32 absolute bg-zinc-300 rounded-[30px] overflow-hidden transition-all duration-200 ${
                  focusedField === "password" ? "ring-2 ring-orange-300" : ""
                }`}
              >
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={handleBlur}
                  placeholder="Masukkan Password..."
                  className="w-full h-full px-4 bg-transparent text-neutral-600 text-sm font-light font-['Inter'] outline-none placeholder-neutral-600"
                  disabled={isLoading}
                />
              </div>

              {/* ✅ Fixed: Added type="submit" to button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`cursor-pointer w-64 h-9 top-[550px] left-1/2 transform -translate-x-32 absolute rounded-[30px] transition-all duration-200 shadow-lg hover:shadow-xl ${
                  isLoading
                    ? "bg-orange-400 cursor-not-allowed"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                <span className="text-white text-base font-extrabold font-['Inter']">
                  {isLoading ? "LOADING..." : "LOGIN"}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
