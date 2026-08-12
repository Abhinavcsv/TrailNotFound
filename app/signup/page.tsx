"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Lock, Mail, User, Mountain } from "lucide-react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.96H1.27v3.11C3.25 21.3 7.28 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.27a7.2 7.2 0 010-4.54V6.62H1.27a12 12 0 000 10.76l4-3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.28 0 3.25 2.7 1.27 6.62l4 3.11C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

function InputField({
  icon: Icon,
  type = "text",
  placeholder,
  value,
  onChange,
  showPassword,
  onTogglePassword,
}: {
  icon: typeof User;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}) {
  return (
    <div className="relative">
      <Icon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

      <input
        type={showPassword ? "text" : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
      />

      {onTogglePassword && (
        <button
          type="button"
          onClick={onTogglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5" />
          ) : (
            <Eye className="h-5 w-5" />
          )}
        </button>
      )}
    </div>
  );
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Unable to create account.");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        window.location.href = "/login";
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f8fafc] px-4 py-12">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Mountain className="h-5 w-5" />
            </span>

            TrailNotFound
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-900/5 sm:p-9">
          <div className="mb-7 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Join TrailNotFound and start discovering your next adventure.
            </p>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
              or continue with email
            </span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <InputField
              icon={User}
              placeholder="Full name"
              value={name}
              onChange={setName}
            />

            {/* Email */}
            <InputField
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
            />

            {/* Password */}
            <InputField
              icon={Lock}
              type="password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {/* Confirm Password */}
            <InputField
              icon={Lock}
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              showPassword={showConfirmPassword}
              onTogglePassword={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            />

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Log in
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs leading-5 text-slate-400">
          By creating an account, you agree to our Terms of Service and
          Privacy Policy.
        </p>
      </div>
    </main>
  );
}