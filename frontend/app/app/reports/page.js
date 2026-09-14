"use client";

import { useEffect, useState } from "react";
import { listAnalyses } from "@/lib/api/analyses";
import { mockReportsData } from "@/lib/mock/reports";

export default function ReportsPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadReportsData() {
      try {
        const res = await listAnalyses({ skip: 0, limit: 100 });
        const items = res.items || [];
        const total = res.total || 0;

        const healthyCount = items.filter((i) => i.status === "healthy").length;
        const diseaseCount = items.filter((i) => i.status === "disease_detected").length;
        const nonLeafCount = items.filter((i) => i.status === "not_leaf" || i.status === "unsupported_crop").length;

        const tomatoCount = items.filter((i) => i.crop_check?.label === "tomato").length;
        const potatoCount = items.filter((i) => i.crop_check?.label === "potato").length;
        const otherCount = total - (tomatoCount + potatoCount);

        const calcPct = (cnt) => (total > 0 ? Math.round((cnt / total) * 100) : 0);

        setData({
          summary: {
            totalAnalyses: total,
            healthyCount,
            diseaseDetectedCount: diseaseCount,
            nonLeafOrUnsupportedCount: nonLeafCount,
          },
          cropDistribution: [
            { name: "Tomato", count: tomatoCount, percentage: calcPct(tomatoCount), color: "bg-emerald-800" },
            { name: "Potato", count: potatoCount, percentage: calcPct(potatoCount), color: "bg-amber-700" },
            { name: "Other / Unclassified", count: otherCount, percentage: calcPct(otherCount), color: "bg-stone-400" },
          ],
          conditionBreakdown: [
            { name: "Healthy", count: healthyCount, percentage: calcPct(healthyCount), status: "healthy" },
            { name: "Disease Detected", count: diseaseCount, percentage: calcPct(diseaseCount), status: "disease" },
            { name: "Non-leaf / Stopped", count: nonLeafCount, percentage: calcPct(nonLeafCount), status: "other" },
          ],
        });
      } catch (err) {
        console.warn("Failed to load reports live data:", err);
      }
    }
    loadReportsData();
  }, []);

  const summary = data?.summary || mockReportsData.summary;
  const cropDistribution = data?.cropDistribution || mockReportsData.cropDistribution;
  const conditionBreakdown = data?.conditionBreakdown || mockReportsData.conditionBreakdown;
  const recentSummaries = mockReportsData.recentSummaries;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900">Reports</h1>
        <p className="mt-1 text-sm text-stone-600">
          Aggregated analytics, crop distributions, and field summary statistics.
        </p>
      </div>

      {/* Summary Banner */}
      <div className="bg-stone-900 text-white rounded-lg p-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-stone-800">
          <div className="px-2">
            <p className="text-2xl md:text-3xl font-bold font-mono">{summary.totalAnalyses}</p>
            <p className="text-xs text-stone-400 mt-1">Total Analyses</p>
          </div>
          <div className="px-2">
            <p className="text-2xl md:text-3xl font-bold font-mono text-emerald-400">
              {summary.healthyCount}
            </p>
            <p className="text-xs text-stone-400 mt-1">Healthy Results</p>
          </div>
          <div className="px-2">
            <p className="text-2xl md:text-3xl font-bold font-mono text-amber-400">
              {summary.diseaseDetectedCount}
            </p>
            <p className="text-xs text-stone-400 mt-1">Potential Disease</p>
          </div>
          <div className="px-2">
            <p className="text-2xl md:text-3xl font-bold font-mono text-stone-300">
              {summary.nonLeafOrUnsupportedCount}
            </p>
            <p className="text-xs text-stone-400 mt-1">Non-leaf / Unsupported</p>
          </div>
        </div>
      </div>

      {/* Visual Breakdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Crop Distribution */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
          <h2 className="text-base font-bold text-stone-900 font-serif">Crop Distribution</h2>
          <div className="space-y-3">
            {cropDistribution.map((crop) => (
              <div key={crop.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-stone-700">
                  <span>{crop.name}</span>
                  <span className="font-mono">{crop.count} ({crop.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${crop.color}`}
                    style={{ width: `${crop.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Condition Breakdown */}
        <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
          <h2 className="text-base font-bold text-stone-900 font-serif">Condition Breakdown</h2>
          <div className="space-y-3">
            {conditionBreakdown.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-stone-700">
                  <span>{item.name}</span>
                  <span className="font-mono">{item.count} ({item.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      item.status === "healthy"
                        ? "bg-emerald-600"
                        : item.status === "disease"
                        ? "bg-amber-600"
                        : "bg-stone-400"
                    }`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Summaries */}
      <div className="bg-white border border-stone-200 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900 font-serif">Recent Monthly Summaries</h2>
          <span className="text-xs text-stone-400">UI Preview</span>
        </div>
        <div className="divide-y divide-stone-100">
          {recentSummaries.map((rep) => (
            <div key={rep.id} className="py-3 flex items-center justify-between text-xs">
              <div>
                <p className="font-medium text-stone-900">{rep.title}</p>
                <p className="text-stone-500 mt-0.5">
                  Generated {rep.date} • {rep.totalScans} scans evaluated
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-2 py-1 bg-stone-100 text-stone-600 rounded font-mono text-[11px]">
                  Disease rate: {rep.diseaseRate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export / Download Disclaimer */}
      <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <div className="text-amber-800 shrink-0 mt-0.5">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold text-amber-900">PDF & Data Export Notice</p>
          <p className="text-xs text-amber-800/90 leading-relaxed">
            Downloadable PDF field reports and CSV data exports require additional reporting services and will be enabled in a future release.
          </p>
          <div className="pt-2">
            <button
              disabled
              className="px-3 py-1.5 bg-stone-200 text-stone-500 rounded text-xs font-medium cursor-not-allowed border border-stone-300"
            >
              Export PDF Report (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
