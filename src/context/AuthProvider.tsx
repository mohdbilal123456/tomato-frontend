import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authAPI } from "../services/authApi";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const loginWithGoogle = async (code: string) => {
  try {
    setLoading(true);

    console.log("Sending code:", code); // 🔥 debug

    const data = await authAPI.loginWithGoogle(code);

    localStorage.setItem("token", data.token);
    navigate("/")
    setUser(data.user);
    setIsAuth(true);

  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
  } finally {
    setLoading(false);
  }
};

  const fetchProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setUser(data.user);
      setIsAuth(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuth, loading, loginWithGoogle, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};