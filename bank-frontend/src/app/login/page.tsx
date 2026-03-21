"use client";

import { useState } from "react";
import API from "../../utils/api";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export default function LoginPage() {
  const [step, setStep] = useState("credentials"); // 'credentials' or 'otp'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /* =========================
     ✅ STEP 1: LOGIN WITH EMAIL & PASSWORD
  ========================= */

  const handleLoginWithCredentials = async () => {
    setError("");
    setLoading(true);

    try {
      if (!email || !password) {
        setError("Email and password are required");
        setLoading(false);
        return;
      }

      const res = await API.post("/auth/login", { email, password });

      if (res.data.requiresOTP) {
        setStep("otp");
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     ✅ STEP 2: VERIFY OTP
  ========================= */

  const handleVerifyOTP = async () => {
    setError("");
    setLoading(true);

    try {
      if (!otp) {
        setError("OTP is required");
        setLoading(false);
        return;
      }

      const res = await API.post("/auth/verify-otp", { email, otp });

      // Store CSRF token if present
      if (res.data.csrfToken) {
        localStorage.setItem("csrfToken", res.data.csrfToken);
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "OTP verification failed");
      } else {
        setError("OTP verification failed");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     🔄 RESEND OTP
  ========================= */

  const handleResendOTP = async () => {
    setError("");
    setLoading(true);

    try {
      await API.post("/auth/resend-otp", { email });
      setError(""); // Clear error on success
      alert("OTP resent successfully");
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || "Failed to resend OTP");
      } else {
        setError("Failed to resend OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     🔙 BACK TO CREDENTIALS
  ========================= */

  const handleBackToCredentials = () => {
    setStep("credentials");
    setOtp("");
    setError("");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96">
        <h1 className="text-3xl font-bold text-center mb-6">🏦 Bank Login</h1>

        {/* STEP 1: CREDENTIALS */}
        {step === "credentials" && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-2 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={handleLoginWithCredentials}
              disabled={loading}
              className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-gray-600 text-sm mt-4">
              Test User: <strong>sarvjeetswanshi25@gmail.com</strong>
            </p>
          </>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
          <>
            <p className="text-gray-600 text-sm mb-4 text-center">
              We&apos;ve sent a 6-digit OTP to <strong>{email}</strong>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Enter OTP Code
              </label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                maxLength={6}
                className="w-full border border-gray-300 p-3 rounded text-center text-2xl letter-spacing font-bold text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              />
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-green-500 text-white py-2 rounded font-semibold hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="flex gap-2 mt-4">
              <button
                onClick={handleResendOTP}
                disabled={loading}
                className="flex-1 border border-blue-500 text-blue-500 py-2 rounded font-semibold hover:bg-blue-50 disabled:opacity-50"
              >
                Resend OTP
              </button>

              <button
                onClick={handleBackToCredentials}
                disabled={loading}
                className="flex-1 border border-gray-300 text-gray-600 py-2 rounded font-semibold hover:bg-gray-50 disabled:opacity-50"
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}