export const AUTH_SESSION_EXPIRED_EVENT = "auth:session-expired";

export const notifySessionExpired = () => {
  window.dispatchEvent(new Event(AUTH_SESSION_EXPIRED_EVENT));
};
