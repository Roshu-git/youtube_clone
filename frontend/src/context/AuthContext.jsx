import React, {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  // Load user from localStorage on app start
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  // Load token from localStorage on app start
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // Login
  const login = (userData, userToken) => {

    localStorage.setItem("token", userToken);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );

    setUser(userData);
    setToken(userToken);
  };

  // Logout
  const logout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}