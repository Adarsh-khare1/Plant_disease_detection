"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/useAuth";
import { listAnalyses } from "@/lib/api/analyses";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [analysisCount, setAnalysisCount] = useState(0);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await listAnalyses({ skip: 0, limit: 1 });
        setAnalysisCount(res.total || 0);
      } catch (err) {
        console.warn("Failed to load profile analysis stats:", err);
      }
    }
    loadStats();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const displayName = user?.displayName || (user?.email ? user.email.split("@")[0] : "Alex Chen");
  const email = user?.email || "alex@example.com";
  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "AC";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">User profile</h1>
          <p className="mt-1 text-sm text-stone-600">
            Account details and workspace activity overview.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs rounded border border-stone-300 transition-colors flex items-center gap-2"
        >
          <span>Log out</span>
        </button>
      </div>

      {/* User Information Card */}
      <div className="bg-white border border-stone-200 rounded-lg p-6 space-y-6 shadow-xs">
        <div className="flex items-center gap-4 border-b border-stone-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center font-serif text-2xl font-bold shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900">{displayName}</h2>
            <p className="text-xs text-stone-500">{email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              Email Address
            </span>
            <p className="text-stone-900 font-medium text-sm">{email}</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              User ID / UID
            </span>
            <p className="text-stone-900 font-mono text-xs">{user?.uid || "dev_user"}</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              Total Analyses Evaluated
            </span>
            <p className="text-stone-900 font-medium text-sm">{analysisCount} scans</p>
          </div>

          <div className="space-y-1">
            <span className="font-semibold text-stone-500 uppercase tracking-wider text-[10px]">
              Primary Crop Focus
            </span>
            <p className="text-stone-900 font-medium text-sm">Tomato & Potato</p>
          </div>
        </div>
      </div>
    </div>
  );
}
