"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  Filter,
  Droplets,
} from "lucide-react";

export default function HydrationPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const hydrationLogs = [
    {
      id: 1,
      date: "2024-01-15",
      time: "08:00 AM",
      amount: "8 oz",
      type: "Water",
      source: "Manual Entry",
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "10:30 AM",
      amount: "8 oz",
      type: "Water",
      source: "Smart Bottle",
    },
    {
      id: 3,
      date: "2024-01-15",
      time: "12:45 PM",
      amount: "12 oz",
      type: "Water with Lunch",
      source: "Manual Entry",
    },
    {
      id: 4,
      date: "2024-01-15",
      time: "03:15 PM",
      amount: "8 oz",
      type: "Water",
      source: "Smart Bottle",
    },
    {
      id: 5,
      date: "2024-01-15",
      time: "06:00 PM",
      amount: "10 oz",
      type: "Water with Dinner",
      source: "Manual Entry",
    },
    {
      id: 6,
      date: "2024-01-15",
      time: "08:30 PM",
      amount: "6 oz",
      type: "Herbal Tea",
      source: "Manual Entry",
    },
    {
      id: 7,
      date: "2024-01-14",
      time: "07:30 AM",
      amount: "8 oz",
      type: "Water",
      source: "Smart Bottle",
    },
    {
      id: 8,
      date: "2024-01-14",
      time: "11:00 AM",
      amount: "8 oz",
      type: "Water",
      source: "Smart Bottle",
    },
  ];

  const performanceMetrics = {
    dailyGoal: 64,
    currentIntake: 52,
    averageDaily: 58,
    status: "Good",
  };

  const filteredLogs = hydrationLogs.filter((log) => {
    if (dateFilter && !log.date.includes(dateFilter)) return false;
    if (timeFilter !== "all") {
      const hour = Number.parseInt(log.time.split(":")[0]);
      if (timeFilter === "morning" && (hour < 6 || hour >= 12)) return false;
      if (timeFilter === "afternoon" && (hour < 12 || hour >= 18)) return false;
      if (timeFilter === "evening" && (hour < 18 || hour >= 24)) return false;
    }
    return true;
  });

  const progressPercentage = Math.round(
    (performanceMetrics.currentIntake / performanceMetrics.dailyGoal) * 100
  );

  const getEncouragementMessage = () => {
    if (progressPercentage >= 100) {
      return "Fantastic hydration today! You've reached your daily goal and your body is thanking you.";
    } else if (progressPercentage >= 80) {
      return "Great job staying hydrated! You're almost at your daily goal - keep it up!";
    } else if (progressPercentage >= 60) {
      return "Good progress on your hydration! Remember, every sip counts towards better health.";
    } else {
      return "Stay hydrated for better energy and health! Small, frequent sips make a big difference.";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Hydration Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your daily water intake</p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{performanceMetrics.currentIntake} oz</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Today&apos;s Intake</p>
            <div className="mt-2 h-2 rounded-full bg-blue-100">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-cyan-50 border border-cyan-200 p-4">
            <div className="flex items-center justify-between">
              <Droplets className="h-5 w-5 text-cyan-600" />
              <span className="text-2xl font-bold text-cyan-600">{performanceMetrics.dailyGoal} oz</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Daily Goal</p>
          </div>

          <div className="rounded-xl bg-indigo-50 border border-indigo-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-2xl font-bold text-indigo-600">{performanceMetrics.averageDaily} oz</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">7-Day Average</p>
          </div>

          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="inline-flex rounded-full bg-green-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                {performanceMetrics.status}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Performance Status</p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Filter by Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Filter by Time of Day</label>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent bg-white"
              >
                <option value="all">All Day</option>
                <option value="morning">Morning (6 AM - 12 PM)</option>
                <option value="afternoon">Afternoon (12 PM - 6 PM)</option>
                <option value="evening">Evening (6 PM - 12 AM)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Hydration History */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">
              Hydration History ({filteredLogs.length} entries)
            </h2>
          </div>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors gap-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{log.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{log.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-auto">
                  <span className="text-lg font-bold text-[#233E7D]">{log.amount}</span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      log.source === "Smart Bottle"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {log.source}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="rounded-xl bg-[#233E7D] p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Droplets className="h-5 w-5 text-white" />
            <h3 className="font-serif text-lg font-semibold text-white">Daily Encouragement</h3>
          </div>
          <p className="text-white/90 leading-relaxed">{getEncouragementMessage()}</p>
        </div>
      </div>
    </div>
  );
}
