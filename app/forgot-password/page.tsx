"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Mountain,
  RefreshCw,
} from "lucide-react";

type Step = "email" | "otp" | "password" | "success";

function OTPInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const digits = Array.from(
    { length: 6 },
    (_, index) => value[index] || ""
  );

  function handleChange(index: number, inputValue: string) {
    const digit = inputValue.replace(/\D/g, "").slice(-1);

    const next = [...digits];
    next[index] = digit;

    onChange(next.join(""));

    if (digit && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    onChange(pasted);

    const nextIndex = Math.min(pasted.length, 5);
    document.getElementById(`otp-${nextIndex}`)?.focus();
  }

  return (
    <div className="flex justify-between gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          id={`otp-${index}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) =>
            handleChange(index, e.target.value)
          }
          onKeyDown={(e) =>
            handleKeyDown(index, e)
          }
          onPaste={handlePaste}
          className="h-12 w-12 rounded-xl border border-slate-200 bg-white text-center text-lg font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 sm:h-14 sm:w-14"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<Step>("email");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  async function sendOTP(e?: FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to send OTP.");
        return;
      }

      setEmail(normalizedEmail);
      setOtp("");
      setStep("otp");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resendOTP() {
    setError("");

    try {
      setResending(true);

      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to resend OTP.");
        return;
      }

      setOtp("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setResending(false);
    }
  }

  async function verifyOTP(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid OTP.");
        return;
      }

      setStep("password");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to reset password.");
        return;
      }

      setStep("success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function goBack() {
    setError("");

    if (step === "otp") {
      setStep("email");
      setOtp("");
    } else if (step === "password") {
      setStep("otp");
    }
  }

  return (
    <main className="min-h-screen">
      <div className="flex min-h-screen w-full overflow-hidden bg-white">
        {/* LEFT — Hero Image */}
        <section className="relative hidden w-1/2 overflow-hidden lg:block">
          <Image
            src="/images/hero-himalaya.png"
            alt="Himalayan mountains"
            fill
            priority
            className="object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

          {/* Logo */}
          <Link
            href="/"
            className="absolute left-8 top-8 z-10 flex items-center gap-2 text-xl font-extrabold tracking-tight text-white"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur-md">
              <Mountain className="h-5 w-5" />
            </span>
            TrailNotFound
          </Link>

          {/* Hero copy */}
          <div className="absolute bottom-10 left-8 right-8 z-10 text-white">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
              Your journey starts here
            </p>

            <h2 className="max-w-lg text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
              Find the trail.
              <br />
              Create the story.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-white/75">
              Discover hidden places, plan unforgettable journeys and share
              your adventures with a community of explorers.
            </p>
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 xl:px-16">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="mb-10 lg:hidden">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white">
                  <Mountain className="h-5 w-5" />
                </span>
                TrailNotFound
              </Link>
            </div>

            {/* ================= EMAIL ================= */}
            {step === "email" && (
              <>
                <div className="mb-8">
                  <p className="mb-2 text-sm font-semibold text-blue-600">
                    Account recovery 🔐
                  </p>

                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    Forgot your password?
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Enter your registered email and we&apos;ll send you a
                    verification code to reset your password.
                  </p>
                </div>

                <form onSubmit={sendOTP} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}

                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-slate-500">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Log in
                  </Link>
                </p>
              </>
            )}

            {/* ================= OTP ================= */}
            {step === "otp" && (
              <>
                <button
                  type="button"
                  onClick={goBack}
                  className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <div className="mb-8">
                  <p className="mb-2 text-sm font-semibold text-blue-600">
                    Verify your email ✉️
                  </p>

                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    Enter your OTP
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    We sent a 6-digit verification code to{" "}
                    <span className="font-semibold text-slate-700">
                      {email}
                    </span>
                    .
                  </p>
                </div>

                <form onSubmit={verifyOTP} className="space-y-6">
                  <OTPInput value={otp} onChange={setOtp} />

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}

                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>

                <div className="mt-8 text-center">
                  <p className="text-sm text-slate-500">
                    Didn&apos;t receive the code?
                  </p>

                  <button
                    type="button"
                    onClick={resendOTP}
                    disabled={resending}
                    className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-50"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        resending ? "animate-spin" : ""
                      }`}
                    />
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                </div>
              </>
            )}

            {/* ================= PASSWORD ================= */}
            {step === "password" && (
              <>
                <button
                  type="button"
                  onClick={goBack}
                  className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>

                <div className="mb-8">
                  <p className="mb-2 text-sm font-semibold text-blue-600">
                    Almost there 🎉
                  </p>

                  <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                    Create a new password
                  </h1>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    Choose a strong password for your TrailNotFound account.
                  </p>
                </div>

                <form onSubmit={resetPassword} className="space-y-5">
                  {/* New password */}
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      New password
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />

                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      Password must be at least 8 characters.
                    </p>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Confirm password
                    </label>

                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword ? "text" : "password"
                        }
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Resetting password..." : "Reset Password"}

                    {!loading && <ArrowRight className="h-4 w-4" />}
                  </button>
                </form>
              </>
            )}

            {/* ================= SUCCESS ================= */}
            {step === "success" && (
              <div className="text-center">
                <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-green-50">
                  <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>

                <p className="mb-2 text-sm font-semibold text-blue-600">
                  All set 🎉
                </p>

                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Password reset successfully
                </h1>

                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                  Your password has been updated successfully. You can now
                  log in using your new password.
                </p>

                <Link
                  href="/login"
                  className="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
                >
                  Go to Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}

            {/* Footer */}
            <p className="mt-8 text-center text-xs leading-5 text-slate-400">
              By continuing, you agree to TrailNotFound&apos;s terms and
              privacy policy.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}