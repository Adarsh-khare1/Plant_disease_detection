"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { dashboardMockData } from "@/lib/mock/dashboard";

export default function RecentAnalyses({ data }) {
  const recentAnalyses = data || dashboardMockData.recentAnalyses;
  const [selectedCrop, setSelectedCrop] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const filteredItems = (recentAnalyses.items || []).filter((item) => {
    const matchesCrop = selectedCrop === "All" || item.crop === selectedCrop;
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "Healthy" && item.isHealthy) ||
      (selectedStatus === "Potential disease" && !item.isHealthy);
    return matchesCrop && matchesStatus;
  });

  return (
    <section aria-label="Recent Analyses" className="bg-surface rounded-lg border border-border/80 shadow-xs overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-4 border-b border-border/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Title & Count */}
        <div className="flex items-center gap-2">
          <h3 className="font-body text-[14px] font-semibold text-text">
            {recentAnalyses.title || "Recent Analyses"}
          </h3>
          <span className="font-body text-[12px] text-text-muted">
            Latest {filteredItems.length} of {recentAnalyses.totalCount || 0}
          </span>
        </div>

        {/* Center: Filters */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-body">
          {/* Crop Filter */}
          <div className="flex items-center gap-1">
            <span className="text-text-muted mr-1">Crop:</span>
            {["All", "Tomato", "Potato"].map((crop) => (
              <button
                key={crop}
                type="button"
                onClick={() => setSelectedCrop(crop)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedCrop === crop
                    ? "bg-text text-white font-medium"
                    : "text-text-muted hover:text-text bg-surface-low"
                } focus-visible:outline-2 focus-visible:outline-primary`}
              >
                {crop}
              </button>
            ))}
          </div>

          <span className="text-border hidden sm:inline" aria-hidden="true">|</span>

          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <span className="text-text-muted mr-1">Status:</span>
            {["All", "Healthy", "Potential disease"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-2 py-0.5 rounded transition-colors ${
                  selectedStatus === status
                    ? "bg-text text-white font-medium"
                    : "text-text-muted hover:text-text bg-surface-low"
                } focus-visible:outline-2 focus-visible:outline-primary`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Right: View all link */}
        <div className="flex items-center">
          <Link
            href="/app/history"
            className="text-[12px] font-medium text-text hover:text-primary transition-colors flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-primary rounded"
          >
            <span>View all ({recentAnalyses.totalCount || 0})</span>
            <Icon name="arrow_forward" className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll containment */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          <thead>
            <tr className="border-b border-border/60 bg-surface-low/50 text-[11px] font-medium text-text-muted uppercase tracking-wider">
              <th scope="col" className="py-2.5 px-4">Image</th>
              <th scope="col" className="py-2.5 px-4">Crop</th>
              <th scope="col" className="py-2.5 px-4">Result</th>
              <th scope="col" className="py-2.5 px-4">Confidence</th>
              <th scope="col" className="py-2.5 px-4">Date</th>
              <th scope="col" className="py-2.5 px-4">Status</th>
              <th scope="col" className="py-2.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-[13px] font-body">
            {filteredItems.map((item) => (
              <tr key={item.id} className="hover:bg-surface-low/60 transition-colors">
                {/* Image */}
                <td className="py-3 px-4">
                  <div className="w-9 h-9 rounded overflow-hidden bg-surface-high border border-border/80 shrink-0 relative">
                    <Image
                      src={item.image || "/images/results/sample-healthy-leaf.jpg"}
                      alt={`${item.crop} leaf specimen preview`}
                      width={36}
                      height={36}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>

                {/* Crop */}
                <td className="py-3 px-4 font-medium text-text">
                  {item.crop}
                </td>

                {/* Result */}
                <td className="py-3 px-4 text-text">
                  {item.result}
                </td>

                {/* Confidence */}
                <td className="py-3 px-4">
                  {item.confidence != null ? (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text w-8 text-[12px]">
                        {item.confidence}%
                      </span>
                      <div
                        className="w-16 bg-surface-high h-1.5 rounded-full overflow-hidden shrink-0"
                        role="progressbar"
                        aria-valuenow={item.confidence}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <div
                          className={`h-full rounded-full ${
                            item.isHealthy ? "bg-success" : "bg-error"
                          }`}
                          style={{ width: `${item.confidence}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-text-muted">—</span>
                  )}
                </td>

                {/* Date */}
                <td className="py-3 px-4 text-text-muted text-[12px] whitespace-nowrap">
                  {item.date}
                </td>

                {/* Status Badge */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-medium ${
                      item.isHealthy
                        ? "bg-success/10 text-success"
                        : "bg-error/10 text-error"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.isHealthy ? "bg-success" : "bg-error"
                      }`}
                      aria-hidden="true"
                    />
                    <span>{item.status}</span>
                  </span>
                </td>

                {/* Action */}
                <td className="py-3 px-4 text-right whitespace-nowrap">
                  <Link
                    href={`/app/results/${item.id}`}
                    className="text-[12px] font-medium text-text hover:text-primary transition-colors inline-flex items-center gap-1 focus-visible:outline-2 focus-visible:outline-primary rounded px-1"
                  >
                    <span>View result</span>
                    <Icon name="chevron_right" className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
            {filteredItems.length === 0 && (
              <tr>
                <td colSpan={7} className="py-8 text-center text-text-muted text-[13px]">
                  No analyses match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer info */}
      <div className="py-3 px-4 bg-surface-low/30 border-t border-border/60 text-[11px] text-text-muted">
        Showing {filteredItems.length} of {recentAnalyses.totalCount || 0} recent analyses.
      </div>
    </section>
  );
}
