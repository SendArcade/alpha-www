"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function AuthPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSocialLogin = async (provider: "github" | "google") => {
    setIsLoading(true);
    try {
      // Use the signIn function with fewer options to reduce complexity
      await signIn(provider, {
        callbackUrl: "/dashboard",
      });
    } catch (error) {
      console.error("Error during social login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen z-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-[#0A0A1B] rounded-xl shadow-xl border border-[#232333]">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-white">
            Welcome to Send Arcade
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your account
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button
            onClick={() => handleSocialLogin("github")}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-[#24292F] hover:bg-[#2C3137] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#24292F] transition-colors duration-200"
          >
            <FaGithub className="w-5 h-5" />
            Continue with GitHub
          </button>

          <button
            onClick={() => handleSocialLogin("google")}
            disabled={isLoading}
            className="w-full z-50 flex items-center justify-center gap-3 px-4 py-3 border border-[#232333] text-sm font-medium rounded-lg text-white bg-[#0A0A1B] hover:bg-[#111122] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#232333] transition-colors duration-200"
          >
            <FcGoogle className="w-5 h-5" />
            Continue with Google
          </button>
        </div>

        {isLoading && (
          <div className="text-center text-sm text-gray-400">
            Redirecting to provider...
          </div>
        )}

        <div className="mt-4 text-center text-sm text-gray-400">
          By signing in, you agree to our{" "}
          <a href="/terms" className="text-blue-500 hover:text-blue-400">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-500 hover:text-blue-400">
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
}
