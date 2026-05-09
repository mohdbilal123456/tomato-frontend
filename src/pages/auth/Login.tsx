import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { GOOGLE_CLIENT_ID } from "../../config/env";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
  const { loginWithGoogle, loading } = useAuth();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (googleRes) => {
      try {
        const apiRes = await loginWithGoogle(googleRes.code);

        console.log("API RESPONSE:", apiRes);
        // toast.success(apiRes?.message)
      } catch (error) {
        console.error("Backend login failed", error);
        toast.error("Login failed. Please try again.");
      }
    },
    onError: () => {
      console.error("Google login failed");
      toast.error("Google sign-in failed. Please try again.");
    },
  });

  const isGoogleConfigured = Boolean(GOOGLE_CLIENT_ID);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-center text-3xl font-bold text-[#E23774]">
          Tomato
        </h1>

        <p className="text-center text-sm text-gray-500">
          Log in or sign up to continue
        </p>

        <button
          onClick={googleLogin}
          disabled={loading || !isGoogleConfigured}
          className="flex w-full items-center justify-center gap-3 rounded-xl 
          border border-gray-300 bg-white px-4 py-3 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 "
        >
          <FcGoogle size={20} />
          {!isGoogleConfigured
            ? "Google client id missing"
            : loading
              ? "Signing in ..."
              : "Continue with Google"}
        </button>

        <p className="text-center text-xs text-gray-400">
          By continuing, you agree with our{" "}
          <span className="text-[#E23774]">Terms of Service</span> &{" "}
          <span className="text-[#E23774]">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

export default Login;
