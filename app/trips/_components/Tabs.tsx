// app/trips/[id]/_components/Tabs.tsx
"use client";

import { useState } from "react";

export default function Tabs({
  overview,
  map,
}: {
  overview: React.ReactNode;
  map: React.ReactNode;
}) {
  const [tab, setTab] = useState<"overview" | "map">("overview");

  return (
    <div className="space-y-4 ">
      <div
        role="tablist"
        className="tabs tabs-boxed w-fit gap-3 px-2 bg-base-300 rounded-xl shadow-xl "
      >
        <button
          role="tab"
          className={`tab ${tab === "overview" ? "tab-active" : ""}`}
          onClick={() => setTab("overview")}
        >
          Overview
        </button>
        <button
          role="tab"
          className={`tab ${tab === "map" ? "tab-active" : ""}`}
          onClick={() => setTab("map")}
        >
          Map
        </button>
      </div>

      <div className="rounded-xl border p-4">
        {tab === "overview" ? overview : map}
      </div>
    </div>
  );
}
