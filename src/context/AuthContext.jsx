import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("auth_token") || "");
  const [loading, setLoading] = useState(true);
  const [isConnecting, setIsConnecting] = useState("Connecting to server... please wait.");

  const login = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) {
      localStorage.setItem("auth_token", data.token);
      setToken(data.token);
      setUser(data.user);
      return true;
    }
    return false;
  };

  const signup = async (payload) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    return data.success;
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    setToken("");
    setUser(null);
  };

  useEffect(() => {
    const loadMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) setUser(data.user);
      } finally {
        setLoading(false);
      }
    };
    loadMe();
  }, [token]);

  useEffect(() => {
  const checkHealth = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/health`, {
        method: 'GET'
      });
      
      if (!res.ok) {
        setIsConnecting("Unable to connect to server. Please try again later.");
        // Maybe show a notification to user
      }
      if (res.ok) {
        setIsConnecting(""); // Clear the connecting message    
      }
    } catch (err) {
      setIsConnecting("Unable to connect to server. Please check your connection and try again.");
      // Maybe show offline indicator
    }
  };

  checkHealth();
}, []);

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading, isConnecting }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

