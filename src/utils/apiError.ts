import axios from "axios";

export const isUnauthorizedError = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401;

export const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    // Backend string response
    if (typeof data === "string") {
      return data;
    }

    // Common keys
    if (typeof data?.message === "string") return data.message;
    if (typeof data?.error === "string") return data.error;
    if (typeof data?.msg === "string") return data.msg;

    // Validation errors
    if (Array.isArray(data?.errors) && data.errors.length > 0) {
      return data.errors
        .map((err: any) => err.message || err.msg)
        .filter(Boolean)
        .join(", ");
    }

    // Agar kuch bhi match nahi hua → raw data dikhao
    return JSON.stringify(data);
  }

  // Non-axios error → jo actual error hai wahi
  if (error instanceof Error) {
    return error.message;
  }

  // Bilkul unknown case
  return "";
};