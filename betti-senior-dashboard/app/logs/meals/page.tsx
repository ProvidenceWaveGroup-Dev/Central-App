"use client";

import { useState } from "react";
import {
  Utensils,
  Calendar,
  Clock,
  TrendingUp,
  Filter,
} from "lucide-react";

export default function MealsPage() {
  const [dateFilter, setDateFilter] = useState("");
  const [mealFilter, setMealFilter] = useState("all");
  const mealLogs = [
    {
      id: 1,
      date: "2024-01-15",
      time: "08:00 AM",
      meal: "Breakfast",
      items: ["Oatmeal with berries", "Orange juice", "Coffee"],
      calories: 350,
      nutrition: "Balanced",
    },
    {
      id: 2,
      date: "2024-01-15",
      time: "12:30 PM",
      meal: "Lunch",
      items: ["Grilled chicken salad", "Whole grain roll", "Water"],
      calories: 420,
      nutrition: "Excellent",
    },
    {
      id: 3,
      date: "2024-01-15",
      time: "06:00 PM",
      meal: "Dinner",
      items: ["Baked salmon", "Steamed vegetables", "Brown rice"],
      calories: 480,
      nutrition: "Excellent",
    },
    {
      id: 4,
      date: "2024-01-14",
      time: "08:15 AM",
      meal: "Breakfast",
      items: ["Scrambled eggs", "Toast", "Apple juice"],
      calories: 320,
      nutrition: "Good",
    },
    {
      id: 5,
      date: "2024-01-14",
      time: "01:00 PM",
      meal: "Lunch",
      items: ["Vegetable soup", "Crackers", "Tea"],
      calories: 280,
      nutrition: "Light",
    },
    {
      id: 6,
      date: "2024-01-14",
      time: "07:30 PM",
      meal: "Dinner",
      items: ["Pasta with marinara", "Side salad", "Garlic bread"],
      calories: 520,
      nutrition: "Good",
    },
  ];

  const performanceMetrics = {
    averageCalories: 395,
    mealsPerDay: 2.8,
    nutritionScore: 85,
    status: "Good",
  };

  const filteredMeals = mealLogs.filter((meal) => {
    if (dateFilter && !meal.date.includes(dateFilter)) return false;
    if (mealFilter !== "all" && meal.meal.toLowerCase() !== mealFilter)
      return false;
    return true;
  });

  const getEncouragementMessage = () => {
    const nutritionScore = performanceMetrics.nutritionScore;
    const mealsPerDay = performanceMetrics.mealsPerDay;

    if (nutritionScore >= 80 && mealsPerDay >= 3) {
      return "Excellent nutrition habits! You're maintaining a balanced diet with regular meals.";
    } else if (nutritionScore >= 70) {
      return "Good progress on your nutrition goals. Keep focusing on balanced meals throughout the day.";
    } else {
      return "Consider adding more variety to your meals and maintaining regular eating schedules for better nutrition.";
    }
  };

  const nutritionColor: Record<string, string> = {
    Excellent: "bg-green-100 text-green-700 border border-green-200",
    Good: "bg-blue-100 text-blue-700 border border-blue-200",
    Balanced: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    Light: "bg-gray-100 text-gray-700 border border-gray-300",
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Meal Tracking Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Monitor your daily nutrition and meals</p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
            <div className="flex items-center justify-between">
              <Utensils className="h-5 w-5 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{performanceMetrics.averageCalories}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Avg Daily Calories</p>
          </div>

          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <div className="flex items-center justify-between">
              <Utensils className="h-5 w-5 text-amber-600" />
              <span className="text-2xl font-bold text-amber-600">{performanceMetrics.mealsPerDay}</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Meals Per Day</p>
          </div>

          <div className="rounded-xl bg-green-50 border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-2xl font-bold text-green-600">{performanceMetrics.nutritionScore}%</span>
            </div>
            <p className="mt-2 text-xs font-medium text-gray-600">Nutrition Score</p>
            <div className="mt-2 h-2 rounded-full bg-green-100">
              <div
                className="h-2 rounded-full bg-green-600 transition-all"
                style={{ width: `${performanceMetrics.nutritionScore}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
            <div className="flex items-center justify-between">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              <span className="inline-flex rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-semibold text-white">
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
              <label className="text-sm font-medium text-gray-600 mb-2 block">Filter by Meal Type</label>
              <select
                value={mealFilter}
                onChange={(e) => setMealFilter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent bg-white"
              >
                <option value="all">All Meals</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
            </div>
          </div>
        </div>

        {/* Meals List */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-3 mb-4">
            <Utensils className="h-5 w-5 text-[#233E7D]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">
              Meal History ({filteredMeals.length} entries)
            </h2>
          </div>
          <div className="space-y-3">
            {filteredMeals.map((meal) => (
              <div
                key={meal.id}
                className="rounded-lg border border-gray-100 bg-gray-50 p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-[#233E7D]" />
                    <span className="font-serif font-semibold text-gray-900">{meal.meal}</span>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold self-start sm:self-auto ${nutritionColor[meal.nutrition] || "bg-gray-100 text-gray-700"}`}>
                    {meal.nutrition}
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">{meal.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{meal.time}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-gray-700">Calories: </span>
                      <span className="font-bold text-[#5C7F39]">{meal.calories}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700 mb-2">Food Items:</div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {meal.items.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-[#5C7F39] rounded-full flex-shrink-0"></span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Encouragement */}
        <div className="rounded-xl bg-[#233E7D] p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Utensils className="h-5 w-5 text-white" />
            <h3 className="font-serif text-lg font-semibold text-white">Daily Encouragement</h3>
          </div>
          <p className="text-white/90 leading-relaxed">{getEncouragementMessage()}</p>
        </div>
      </div>
    </div>
  );
}
