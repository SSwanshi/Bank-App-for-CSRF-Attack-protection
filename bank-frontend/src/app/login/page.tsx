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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 overflow-hidden">
      <div className="card w-full max-w-[440px] p-10 bg-white">
        <div className="text-center mb-10">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-2">Secure Portal</h2>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">SECUREBANK</h1>
        </div>

        {/* STEP 1: CREDENTIALS */}
        {step === "credentials" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 block">Business Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 block">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-md font-medium">
                {error}
              </div>
            )}

            <button
              onClick={handleLoginWithCredentials}
              disabled={loading}
              className="btn-primary w-full py-3.5 shadow-md shadow-blue-500/10 active:scale-[0.98]"
            >
              {loading ? "Authenticating..." : "Login to System"}
            </button>
            <p className="text-center text-xs text-slate-400 font-medium">
              By logging in, you agree to our security protocols.
            </p>
          </div>
        )}

        {/* STEP 2: OTP VERIFICATION */}
        {step === "otp" && (
          <div className="space-y-8">
            <div className="text-center">
              <p className="text-sm text-slate-500 leading-relaxed max-w-[280px] mx-auto">
                Security code sent to your registered email: <br/><strong className="text-slate-800">{email}</strong>
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-600 block text-center uppercase tracking-wider">
                6-Digit Verification Code
              </label>
              <input
                type="text"
                placeholder="000 000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                maxLength={6}
                className="w-full bg-slate-50 border border-slate-200 p-5 rounded-lg text-center text-3xl tracking-[0.5em] font-mono font-bold text-primary focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-primary transition-all"
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm p-3 rounded-md font-medium text-center">
                {error}
              </div>
            )}

            <div className="space-y-3 pt-2">
              <button
                onClick={handleVerifyOTP}
                disabled={loading}
                className="btn-primary w-full py-4 text-lg"
              >
                {loading ? "Verifying..." : "Validate Security Code"}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="btn-secondary flex-1 py-3 text-sm"
                >
                  Send Again
                </button>

                <button
                  onClick={handleBackToCredentials}
                  disabled={loading}
                  className="flex-1 border border-slate-200 text-slate-500 py-3 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-8 text-slate-400 text-xs font-semibold uppercase tracking-widest">
        Enhanced Security Protocol Enabled
      </div>
    </div>
  );
}