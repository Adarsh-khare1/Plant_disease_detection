"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import OverviewMetrics from "@/components/dashboard/OverviewMetrics";
import CropActivity from "@/components/dashboard/CropActivity";
import HealthOverview from "@/components/dashboard/HealthOverview";
import QuickActions from "@/components/dashboard/QuickActions";
import ContinueWork from "@/components/dashboard/ContinueWork";
import RecentAnalyses from "@/components/dashboard/RecentAnalyses";
import { listAnalyses } from "@/lib/api/analyses";
import { dashboardMockData } from "@/lib/mock/dashboard";

export default function DashboardPage() {
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setLoading(true);
        const data = await listAnalyses({ skip: 0, limit: 100 });
        const items = data.items || [];
        const total = data.total || 0;

        const healthyCount = items.filter((i) => i.status === "healthy").length;
        const diseaseCount = items.filter((i) => i.status === "disease_detected").length;
        const tomatoCount = items.filter((i) => i.crop_check?.label === "tomato").length;
        const potatoCount = items.filter((i) => i.crop_check?.label === "potato").length;

        const tomatoPct = total > 0 ? Math.round((tomatoCount / total) * 100) : 50;
        const potatoPct = total > 0 ? Math.round((potatoCount / total) * 100) : 50;

        const overview = {
          totalAnalyses: {
            label: "Total Analyses",
            count: String(total),
            meta: "Lifetime recorded",
          },
          healthyResults: {
            label: "Healthy Results",
            count: String(healthyCount),
            meta: `${total > 0 ? Math.round((healthyCount / total) * 100) : 0}% of evaluated`,
          },
          potentialDiseaseResults: {
            label: "Potential Disease",
            count: String(diseaseCount),
            meta: `${total > 0 ? Math.round((diseaseCount / total) * 100) : 0}% of evaluated`,
          },
        };

        const cropActivity = {
          title: "Crop Activity Distribution",
          subtitle: "Proportion of analyzed leaf specimens by crop type.",
          crops: [
            { name: "Tomato", count: tomatoCount, percentage: tomatoPct, color: "#1b4d3e" },
            { name: "Potato", count: potatoCount, percentage: potatoPct, color: "#8c6418" },
          ],
        };

        const recentItems = items.slice(0, 5).map((item) => {
          const isHealthy = item.status === "healthy";
          const cropName =
            item.crop_check?.label === "tomato"
              ? "Tomato"
              : item.crop_check?.label === "potato"
              ? "Potato"
              : "Other";

          const resultTitle =
            item.prediction?.display_name ||
            (isHealthy
              ? "Healthy"
              : item.status === "not_leaf"
              ? "No leaf detected"
              : item.status === "unsupported_crop"
              ? "Unsupported crop"
              : "Analysis failed");

          const scorePct = item.prediction?.score != null ? Math.round(item.prediction.score * 100) : null;

          return {
            id: item.analysis_id,
            crop: cropName,
            result: resultTitle,
            confidence: scorePct,
            date: new Date(item.created_at).toLocaleDateString([], { month: "short", day: "numeric" }),
            status: isHealthy ? "Healthy" : "Attention Needed",
            isHealthy,
            image: "/images/results/sample-healthy-leaf.jpg",
          };
        });

        const recentAnalyses = {
          title: "Recent Analyses",
          displayedCount: recentItems.length,
          totalCount: total,
          viewAllHref: "/app/history",
          items: recentItems,
        };

        setLiveData({
          overview,
          cropActivity,
          recentAnalyses,
        });
      } catch (err) {
        console.warn("Failed to load dashboard live data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const { greeting, header } = dashboardMockData;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Page Header / Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-[28px] sm:text-[32px] text-text font-medium leading-tight">
            Dashboard
          </h1>
          <p className="font-body text-[14px] text-text-muted mt-1">
            {greeting.subtitle}
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Status Indicator Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border/80 text-[12px] font-body text-text-muted shadow-xs">
            <span className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
            <span>{greeting.chipText}</span>
          </div>

          {/* Contextual Action Button */}
          <Link
            href={header.actionHref}
            className="h-9 px-4 bg-primary text-white rounded inline-flex items-center gap-2 text-[13px] font-medium active:bg-primary/90 transition-colors shadow-xs focus-visible:outline-2 focus-visible:outline-primary shrink-0"
          >
            <Icon name="document_scanner" className="w-4 h-4" />
            <span>{header.actionText}</span>
          </Link>
        </div>
      </div>

      {/* 1. Overview Metrics */}
      <OverviewMetrics data={liveData?.overview} />

      {/* 2. Crop Activity & Health Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CropActivity data={liveData?.cropActivity} />
        <HealthOverview />
      </div>

      {/* 3. Quick Actions & Continue Work Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <QuickActions />
        </div>
        <div className="lg:col-span-1">
          <ContinueWork />
        </div>
      </div>

      {/* 4. Recent Analyses Table */}
      <RecentAnalyses data={liveData?.recentAnalyses} />
    </div>
  );
}
