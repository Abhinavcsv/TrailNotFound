"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Mountain,
  ArrowRight,
} from "lucide-react";

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
        d="M5.27 14.27a7.2 7.2 0 010-4.54V6.62H1.27a12 12 0 000 10.76l4 3.11z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.6 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.28 0 3.25 2.7 1.27 6.62l4 3.11C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password.");
        return;
      }

      window.location.href = "/";
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
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

          {/* Image overlays */}
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

        {/* RIGHT — Login */}
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

            {/* Heading */}
            <div className="mb-8">
              <p className="mb-2 text-sm font-semibold text-blue-600">
                Welcome back 👋
              </p>

              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                Log in to your account
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Continue planning trips, saving destinations and discovering
                hidden gems.
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
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                or
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Email */}
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

              {/* Password */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Log in"}

                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            {/* Signup */}
            <p className="mt-8 text-center text-sm text-slate-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create an account
              </Link>
            </p>

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