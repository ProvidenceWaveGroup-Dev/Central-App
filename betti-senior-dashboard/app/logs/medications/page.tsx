"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  Filter,
  X,
  Pill,
} from "lucide-react";

export default function MedicationsPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const medicationLogs = [
    {
      id: 1,
      date: "2024-01-15",
      time: "08:00 AM",
      medication: "Lisinopril 10mg",
      dosage: "1 tablet",
      status: "Taken",
      condition: "Blood Pressure",
      sideEffects: "None",
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "02:00 PM",
      medication: "Metformin 500mg",
      dosage: "1 tablet",
      status: "Missed",
      condition: "Diabetes",
      sideEffects: "None",
    },
    {
      id: 3,
      date: "2024-01-15",
      time: "08:00 PM",
      medication: "Atorvastatin 20mg",
      dosage: "1 tablet",
      status: "Taken",
      condition: "Cholesterol",
      sideEffects: "None",
    },
    {
      id: 4,
      date: "2024-01-14",
      time: "08:00 AM",
      medication: "Lisinopril 10mg",
      dosage: "1 tablet",
      status: "Taken",
      condition: "Blood Pressure",
      sideEffects: "None",
    },
    {
      id: 5,
      date: "2024-01-14",
      time: "02:00 PM",
      medication: "Metformin 500mg",
      dosage: "1 tablet",
      status: "Taken",
      condition: "Diabetes",
      sideEffects: "Mild nausea",
    },
    {
      id: 6,
      date: "2024-01-14",
      time: "08:00 PM",
      medication: "Atorvastatin 20mg",
      dosage: "1 tablet",
      status: "Taken",
      condition: "Cholesterol",
      sideEffects: "None",
    },
  ];

  const healthMetrics = {
    adherenceRate: 88,
    improvementScore: 92,
    status: "Excellent",
    trend: "Improving",
  };

  const filteredMedications = medicationLogs.filter((med) => {
    if (dateFilter && !med.date.includes(dateFilter)) return false;
    if (statusFilter !== "all" && med.status.toLowerCase() !== statusFilter)
      return false;
    return true;
  });

  const getEncouragementMessage = () => {
    if (healthMetrics.adherenceRate >= 90) {
      return "Outstanding medication adherence! Your commitment to your health is truly inspiring.";
    } else if (healthMetrics.adherenceRate >= 80) {
      return "Great job staying on track with your medications! Keep up the excellent work.";
    } else if (healthMetrics.adherenceRate >= 70) {
      return "You're doing well with your medication routine. Small improvements can make a big difference!";
    } else {
      return "Every step towards better medication adherence is progress. You've got this!";
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Medication History
          </h1>
          <p className="text-sm text-gray-500 mt-1">Track your medication adherence and health metrics</p>
        </div>

        {/* Health Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <Pill className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{healthMetrics.adherenceRate}%</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Adherence Rate</p>
            <div className="mt-2 h-2 rounded-full bg-green-100">
              <div
                className="h-2 rounded-full bg-green-600 transition-all"
                style={{ width: `${healthMetrics.adherenceRate}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-2xl font-bold text-blue-600">{healthMetrics.improvementScore}%</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Health Improvement</p>
            <div className="mt-2 h-2 rounded-full bg-blue-100">
              <div
                className="h-2 rounded-full bg-blue-600 transition-all"
                style={{ width: `${healthMetrics.improvementScore}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center justify-between">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
              <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                {healthMetrics.status}
              </span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Overall Status</p>
          </div>

          <div className="rounded-xl bg-purple-50 border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span className="text-2xl font-bold text-purple-600">{healthMetrics.trend}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Health Trend</p>
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
              <label className="text-sm font-medium text-gray-600 mb-2 block">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent bg-white"
              >
                <option value="all">All Statuses</option>
                <option value="taken">Taken</option>
                <option value="missed">Missed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Medications List */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Pill className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">
              Medication Logs ({filteredMedications.length} entries)
            </h2>
          </div>
          <div className="space-y-3">
            {filteredMedications.map((med) => (
              <div
                key={med.id}
                className={`rounded-lg border p-4 hover:bg-gray-50 transition-colors ${
                  med.status === "Taken"
                    ? "border-green-200 bg-green-50/30"
                    : "border-red-200 bg-red-50/30"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Pill className="h-4 w-4 text-[#233E7D]" />
                    <span className="font-serif font-semibold text-gray-900">{med.medication}</span>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {med.status === "Taken" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    <span
                      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        med.status === "Taken"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-red-100 text-red-700 border border-red-200"
                      }`}
                    >
                      {med.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{med.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{med.time}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Dosage: </span>
                      <span className="text-gray-600">{med.dosage}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Condition: </span>
                      <span className="font-medium text-[#5C7F39]">{med.condition}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Side Effects:</div>
                    <div className="text-sm">
                      {med.sideEffects === "None" ? (
                        <span className="text-green-600 font-medium">No side effects reported</span>
                      ) : (
                        <span className="text-orange-600 font-medium">{med.sideEffects}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="rounded-xl bg-[#233E7D] p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Pill className="h-5 w-5 text-white" />
            <h3 className="font-serif text-lg font-semibold text-white">Daily Encouragement</h3>
          </div>
          <p className="text-white/90 leading-relaxed">{getEncouragementMessage()}</p>
        </div>
      </div>
    </div>
  );
}
