import React, { useEffect, useState, useCallback } from "react";
import { apiService, isAuthenticated } from "../services/api";

interface AuthGuardProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  const checkAuthentication = useCallback(async () => {
    try {
      if (!isAuthenticated()) {
        redirectToLogin();
        return;
      }

      const authValid = await apiService.checkAuth();

      if (authValid) {
        setIsAuth(true);
      } else {
        redirectToLogin();
      }
    } catch {
      redirectToLogin();
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  const redirectToLogin = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    window.location.href = "/";
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">Authentication required</p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthGuard;
