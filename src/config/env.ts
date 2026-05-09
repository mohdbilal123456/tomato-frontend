const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const getEnv = (key: string, fallback = "") => {
  const value = import.meta.env[key];

  if (typeof value !== "string") return fallback;

  return value.trim();
};

export const AUTH_SERVICE_URL = trimTrailingSlash(
  getEnv("VITE_AUTH_URL", "http://localhost:3001")
);

export const RESTAURANT_SERVICE_URL = trimTrailingSlash(
  getEnv("VITE_RESTAURANT_URL", "http://localhost:3002")
);

export const GOOGLE_CLIENT_ID = getEnv("VITE_GOOGLE_CLIENT_ID");
