
import { useGoogleLogin } from "@react-oauth/google";

import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../hooks/useAuth";
const Login = () => {
  const { loginWithGoogle, loading } = useAuth();

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (res) => {
      loginWithGoogle(res.code);
    
    },
    onError: () => {
      console.error("Google login failed");
      alert("Google sign-in failed. Please try again.");
    },
  });

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
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl 
          border border-gray-300 bg-white px-4 py-3 cursor-pointer "
        >
          <FcGoogle size={20} />
          {loading ? "Signing in ..." : "Continue with Google"}
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