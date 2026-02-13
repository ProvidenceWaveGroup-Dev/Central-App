"use client";

import { useState } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Filter,
} from "lucide-react";

export default function RestroomActivityPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [timeFilter, setTimeFilter] = useState("all");
  const restroomLogs = [
    {
      id: 1,
      date: "2024-01-15",
      time: "08:30 AM",
      duration: "3 min",
      location: "Main Bathroom",
      frequency: "Normal",
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "11:45 AM",
      duration: "2 min",
      location: "Main Bathroom",
      frequency: "Normal",
    },
    {
      id: 3,
      date: "2024-01-15",
      time: "02:15 PM",
      duration: "4 min",
      location: "Main Bathroom",
      frequency: "Normal",
    },
    {
      id: 4,
      date: "2024-01-15",
      time: "05:30 PM",
      duration: "3 min",
      location: "Main Bathroom",
      frequency: "Normal",
    },
    {
      id: 5,
      date: "2024-01-14",
      time: "09:00 AM",
      duration: "5 min",
      location: "Main Bathroom",
      frequency: "Longer",
    },
  ];

  const performanceMetrics = {
    averageDaily: 4.2,
    averageDuration: "3.1 min",
    status: "Good",
    trend: "Stable",
  };

  const filteredLogs = restroomLogs.filter((log) => {
    if (dateFilter && !log.date.includes(dateFilter)) return false;
    if (timeFilter !== "all") {
      const hour = Number.parseInt(log.time.split(":")[0]);
      if (timeFilter === "morning" && (hour < 6 || hour >= 12)) return false;
      if (timeFilter === "afternoon" && (hour < 12 || hour >= 18)) return false;
      if (timeFilter === "evening" && (hour < 18 || hour >= 24)) return false;
    }
    return true;
  });

  const getEncouragementMessage = () => {
    const avgDaily = performanceMetrics.averageDaily;
    if (avgDaily >= 4 && avgDaily <= 6) {
      return "Great job maintaining healthy restroom habits! Your regularity shows excellent digestive health.";
    } else if (avgDaily < 4) {
      return "Consider staying hydrated and eating fiber-rich foods to support healthy digestion.";
    } else {
      return "Your activity levels look good. Keep monitoring for any changes in your routine.";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Restroom Activity Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your restroom activity patterns</p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <MapPin className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{performanceMetrics.averageDaily}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Avg Daily Visits</p>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{performanceMetrics.averageDuration}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Avg Duration</p>
          </div>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">{performanceMetrics.status}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Performance</p>
          </div>

          <div className="rounded-xl bg-purple-50 border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{performanceMetrics.trend}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Trend</p>
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

        {/* Activity History */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">
              Activity History ({filteredLogs.length} entries)
            </h2>
          </div>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">{log.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{log.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{log.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Duration: {log.duration}</span>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      log.frequency === "Normal"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-blue-100 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {log.frequency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="rounded-xl bg-[#233E7D] p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-white" />
            <h3 className="font-serif text-lg font-semibold text-white">Daily Encouragement</h3>
          </div>
          <p className="text-white/90 leading-relaxed">{getEncouragementMessage()}</p>
        </div>
      </div>
    </div>
  );
}
