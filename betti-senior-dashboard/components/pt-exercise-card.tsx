"use client";

import { useState } from "react";
import Link from "next/link";
import { Activity, CheckCircle, Clock, TrendingUp, BarChart3 } from "lucide-react";

const MOCK = {
  todayPrompt: { id: "pt1", title: "Morning stretches", duration: "10 min", completed: false },
  sessionsThisWeek: [
    { day: "Mon", completed: true },
    { day: "Tue", completed: false },
    { day: "Wed", completed: true },
    { day: "Thu", completed: true },
    { day: "Fri", completed: false },
    { day: "Sat", completed: false },
    { day: "Sun", completed: true },
  ],
  weeklyCompliance: 57,
  complianceTrend: [40, 50, 45, 60, 55, 50, 57],
  caseStudyMetric: "4.2 sessions/week avg",
};

export function PTExerciseCard() {
  const [completed, setCompleted] = useState(MOCK.todayPrompt.completed);

  const handleComplete = () => {
    setCompleted(true);
  };

  const completedCount = MOCK.sessionsThisWeek.filter((s) => s.completed).length;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#5C7F39]" />
          <h2 className="font-serif text-lg font-semibold text-gray-900">Physical Therapy & Exercise</h2>
        </div>
        <Link href="/logs/pt-exercise" prefetch className="text-xs font-medium text-[#5C7F39] hover:underline">
          View logs
        </Link>
      </div>

      {/* PT/Exercise prompt */}
      <div className="mb-4 p-4 rounded-xl bg-[#5C7F39]/10 border border-[#5C7F39]/30">
        <div className="text-xs font-medium text-[#5C7F39] mb-2">Today&apos;s prompt</div>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-semibold text-gray-900">{MOCK.todayPrompt.title}</div>
            <div className="text-sm text-gray-500">{MOCK.todayPrompt.duration}</div>
          </div>
          {!completed ? (
            <button
              onClick={handleComplete}
              className="rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4a6a2e]"
            >
              Mark complete
            </button>
          ) : (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Done</span>
            </div>
          )}
        </div>
      </div>

      {/* Completion per session - this week */}
      <div className="mb-4">
        <div className="text-xs font-medium text-gray-500 mb-2">This week</div>
        <div className="flex gap-1">
          {MOCK.sessionsThisWeek.map((s, i) => (
            <div
              key={i}
              className={`flex-1 rounded py-2 text-center text-[10px] font-medium ${s.completed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
              title={`${s.day}: ${s.completed ? "Completed" : "Pending"}`}
            >
              {s.day}
            </div>
          ))}
        </div>
      </div>

      {/* Compliance over time */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">Weekly compliance</span>
          <span className="text-sm font-bold text-[#5C7F39]">{MOCK.weeklyCompliance}%</span>
        </div>
        <div className="flex items-end gap-1 h-10">
          {MOCK.complianceTrend.map((val, i) => (
            <div key={i} className="flex-1 rounded-t bg-[#5C7F39]/50" style={{ height: `${val}%` }} />
          ))}
        </div>
      </div>

      {/* Case study metric */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
        <BarChart3 className="h-4 w-4 text-[#5C7F39]" />
        <span className="text-xs font-medium text-gray-700">{MOCK.caseStudyMetric}</span>
      </div>
    </div>
  );
}
