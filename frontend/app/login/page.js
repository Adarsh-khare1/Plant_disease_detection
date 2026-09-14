"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { useAuth } from "@/lib/auth/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, user, isConfigured } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/app/dashboard");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isConfigured) {
      setError("Live authentication is currently unavailable because Firebase environment variables are unconfigured.");
      return;
    }

    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/app/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      let msg = err.message || "Failed to log in. Please check your credentials.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        msg = "Invalid email address or password.";
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-stone-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="space-y-1 text-center">
            <h1 className="font-serif text-2xl font-bold text-stone-900">Log in to PlantDx</h1>
            <p className="text-xs text-stone-600">
              Access your field analysis workspace and saved diagnostic records.
            </p>
          </div>

          {!isConfigured && (
            <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-md text-xs text-amber-900 flex items-start gap-2">
              <span className="font-semibold text-amber-700 shrink-0">Notice:</span>
              <span>
                Live Firebase authentication is unconfigured. Set <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">NEXT_PUBLIC_FIREBASE_*</code> environment variables to enable user authentication.
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-semibold text-stone-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                disabled={!isConfigured}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full text-xs bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-stone-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] text-emerald-800 hover:text-emerald-950 underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                disabled={!isConfigured}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs bg-stone-50 border border-stone-300 rounded-md px-3 py-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !isConfigured}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-stone-600 pt-2 border-t border-stone-100">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-emerald-800 font-semibold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
