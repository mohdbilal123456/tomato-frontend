import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { type ICart, type LocationData, type Props, type User } from "../types";
import { tryCatch } from "../utils/tryCatch";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { getApiErrorMessage, isUnauthorizedError } from "../utils/apiError";
import {
  AUTH_SESSION_EXPIRED_EVENT,
} from "../utils/authEvents";
import { authAPI } from "../services/authservice/authApi";
import { cartAPI } from "../services/restaurantservices/cartApi";

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [city, setCity] = useState("fetching Location ...");
  const [cart, setCart] = useState<ICart[]>([])
  const [subTotal, setSubTotal] = useState(0);
  const [quantity, setQuantity] = useState(0)
  const pageLocation = useLocation();

  const loginWithGoogle = async (code: string) => {
    setLoading(true);

    const [data, error] = await tryCatch(() =>
      authAPI.loginWithGoogle(code)
    );

    if (error) {
      console.error("Login Error:", error);
      if (!isUnauthorizedError(error)) {
        toast.error(getApiErrorMessage(error));
      }
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
      if (pageLocation.pathname !== "/login" && !isUnauthorizedError(error)) {
        toast.error(getApiErrorMessage(error));
      }
      setUser(null);
      setIsAuth(false);
      setLoading(false);
      return;
    }

    setUser(data.user);
    setIsAuth(true);
    setLoading(false);
  };

  async function fetchCart() {
    if (!user || user?.role !== "customer") return

    try {
      const data = await cartAPI.fetchCart()
      setCart(data.cart)
      setCart(data.cart);

      setSubTotal(data.subTotal);

      setQuantity(data.cartLength);
      
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getCart = async () => {
      if (user && user.role === "customer") {
        fetchCart()
      }
    }
    getCart()
  }, [user])



  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setIsAuth(false);
      setLoading(false);
      // toast.error("Session expired. Please login again.");

      if (window.location.pathname !== "/login") {
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [navigate]);

  useEffect(() => {
    const init = async () => {
      if (pageLocation.pathname !== "/login") {
        await fetchProfile();
      } else {
        setLoading(false);
      }
    };

    init();
  }, [pageLocation.pathname]);
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

    getLocation();
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
    city,
    cart,
    subTotal,
    quantity,
    fetchCart
  }


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
