import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  // ==========================================
  // GET CURRENT USER
  // ==========================================
  const getCurrentUser = async (authToken) => {
    try {
      const response = await axios.get(
        `${API_URL}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      setUser(response.data.user);
    } catch (error) {
      console.error("GET CURRENT USER ERROR:", error);

      // Token invalid/expired
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHECK LOGIN ON PAGE REFRESH
  // ==========================================
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      getCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // ==========================================
  // LOGIN
  // ==========================================
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email,
          password,
        }
      );

      const { token: newToken, user: loggedInUser } =
        response.data;

      // Save JWT
      localStorage.setItem("token", newToken);

      // Update React state
      setToken(newToken);
      setUser(loggedInUser);

      return {
        success: true,
        user: loggedInUser,
      };
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Login failed",
      };
    }
  };

  // ==========================================
  // REGISTER
  // ==========================================
  const register = async (
    username,
    email,
    password
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          username,
          email,
          password,
        }
      );

      return {
        success: true,
        message:
          response.data.message ||
          "Registration successful",
      };
    } catch (error) {
      console.error("REGISTER ERROR:", error);

      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Registration failed",
      };
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
  const logout = () => {
    localStorage.removeItem("token");

    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};