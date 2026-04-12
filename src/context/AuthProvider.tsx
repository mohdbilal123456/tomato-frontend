import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { authAPI } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import type { LocationData, Props, User } from "../types";
import { tryCatch } from "../utils/tryCatch";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [city, setCity] = useState("fetching Location ...");
  const pageLocation = useLocation();

  const loginWithGoogle = async (code: string) => {
    // setLoading(true);

    const [data, error] = await tryCatch(() =>
      authAPI.loginWithGoogle(code)
    );

    if (error) {
      console.error("Login Error:", error);
      setLoading(false);
      return;
    }

    setUser(data.user);
    setIsAuth(true);
    toast.success(data?.message)
    navigate("/");

    setLoading(false);
  };

  const fetchProfile = async () => {
    setLoading(true);

    const [data, error] = await tryCatch(() =>
      authAPI.getProfile()
    );

    if (error) {
      console.log(error);
      setUser(null);
      setIsAuth(false);
      setLoading(false);
      return;
    }

    setUser(data.user);
    setIsAuth(true);
    setLoading(false);
  };
  useEffect(() => {
  const init = async () => {
    if (pageLocation.pathname !== "/login") {
      await fetchProfile();
    } else {
      setLoading(false);
    }
  };

  init();
}, [pageLocation.pathname]); // ✅ important
  useEffect(() => {
    const getLocation = () => {
      if (!navigator.geolocation) {
        alert("Please Allow Location to continue");
        return;
      }

      setLoadingLocation(true);

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        const [res, error] = await tryCatch(() =>
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
        );

        if (error || !res) {
          setLocation({
            latitude,
            longitude,
            formattedAddress: "current Location",
          });
          setLoadingLocation(false);
          return;
        }

        const data = await res.json();

        setLocation({
          latitude,
          longitude,
          formattedAddress: data.display_name || "current Location",
        });

        setCity(
          data.address.city ||
          data.address.town ||
          data.address.village ||
          "Your Location"
        );

        setLoadingLocation(false);
      });
    };

    getLocation(); // ✅ now safe
  }, []);

  const value = {
    user,
    isAuth,
    loading,
    setUser,
    setIsAuth,
    setLoading,
    loginWithGoogle,
    location,
    loadingLocation,
    setLoadingLocation,
    city
  }


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
