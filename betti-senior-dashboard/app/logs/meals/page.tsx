"use client";

import { useState, useMemo } from "react";
import {
  Utensils,
  Calendar as CalendarIcon,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Droplets,
  Smile,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

const MEAL_NUTRITION_MOCK = {
  mealsToday: [
    { id: "b", label: "Breakfast", confirmed: true, time: "8:00 AM" },
    { id: "l", label: "Lunch", confirmed: true, time: "12:30 PM" },
    { id: "d", label: "Dinner", confirmed: false, time: "6:00 PM" },
  ],
  missedMealsToday: 0,
  missedMealsThisWeek: 1,
  nutritionCompliance: 85,
  moodCorrelation: "Good meals → Stable mood",
  hydrationNote: "Higher intake on days with 3 meals",
};

const ITEMS_PER_PAGE = 5;

const toDateStr = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function MealsPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [mealFilter, setMealFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [confirmingMeal, setConfirmingMeal] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({
    b: MEAL_NUTRITION_MOCK.mealsToday[0].confirmed ?? false,
    l: MEAL_NUTRITION_MOCK.mealsToday[1].confirmed ?? false,
    d: MEAL_NUTRITION_MOCK.mealsToday[2].confirmed ?? false,
  });

  const handleConfirmMeal = (id: string) => {
    setConfirmingMeal(id);
    setTimeout(() => {
      setConfirmed((prev) => ({ ...prev, [id]: true }));
      setConfirmingMeal(null);
    }, 800);
  };
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

  const dateFilterStr = selectedDate ? toDateStr(selectedDate) : "";
  const filteredMeals = useMemo(
    () =>
      mealLogs.filter((meal) => {
        if (selectedDate && meal.date !== dateFilterStr) return false;
        if (mealFilter !== "all" && meal.meal.toLowerCase() !== mealFilter) return false;
        return true;
      }),
    [mealLogs, selectedDate, dateFilterStr, mealFilter]
  );
  const sortedMeals = useMemo(
    () => [...filteredMeals].sort((a, b) => (a.date > b.date ? -1 : a.date < b.date ? 1 : 0)),
    [filteredMeals]
  );
  const totalPages = Math.max(1, Math.ceil(sortedMeals.length / ITEMS_PER_PAGE));
  const paginatedMeals = sortedMeals.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );
  const datesWithMeals = useMemo(() => new Set(mealLogs.map((m) => m.date)), [mealLogs]);

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

        {/* Meal & Nutrition - Today's meals, prompts, compliance */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-4">
            <Utensils className="h-5 w-5 text-[#5C7F39]" />
            <h2 className="font-serif text-lg font-semibold text-gray-900">Meal & Nutrition</h2>
          </div>
          <div className="space-y-2 mb-4">
            <div className="text-xs font-medium text-gray-500 mb-2">Today&apos;s meals</div>
            {MEAL_NUTRITION_MOCK.mealsToday.map((meal) => (
              <div
                key={meal.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${confirmed[meal.id] ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}
              >
                <div className="flex items-center gap-2">
                  {confirmed[meal.id] ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-amber-600" />
                  )}
                  <span className="font-medium text-gray-700">{meal.label}</span>
                  <span className="text-xs text-gray-500">({meal.time})</span>
                </div>
                {!confirmed[meal.id] && (
                  <button
                    onClick={() => handleConfirmMeal(meal.id)}
                    disabled={confirmingMeal === meal.id}
                    className="rounded-lg bg-[#5C7F39] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#4a6a2e] disabled:opacity-70"
                  >
                    {confirmingMeal === meal.id ? "Confirming..." : "Confirm"}
                  </button>
                )}
              </div>
            ))}
          </div>
          {(MEAL_NUTRITION_MOCK.missedMealsToday > 0 || MEAL_NUTRITION_MOCK.missedMealsThisWeek > 0) && (
            <div className="mb-4 flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
              <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
              <div>
                <div className="text-sm font-medium text-red-700">Missed meals</div>
                <div className="text-xs text-red-600">
                  {MEAL_NUTRITION_MOCK.missedMealsToday > 0 && `${MEAL_NUTRITION_MOCK.missedMealsToday} today`}
                  {MEAL_NUTRITION_MOCK.missedMealsToday > 0 && MEAL_NUTRITION_MOCK.missedMealsThisWeek > 0 && " • "}
                  {MEAL_NUTRITION_MOCK.missedMealsThisWeek > 0 && `${MEAL_NUTRITION_MOCK.missedMealsThisWeek} this week`}
                </div>
              </div>
            </div>
          )}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-gray-500">Nutrition compliance</span>
              <span className={`text-sm font-bold ${MEAL_NUTRITION_MOCK.nutritionCompliance >= 80 ? "text-green-600" : MEAL_NUTRITION_MOCK.nutritionCompliance >= 60 ? "text-amber-600" : "text-red-600"}`}>
                {MEAL_NUTRITION_MOCK.nutritionCompliance}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100">
              <div
                className={`h-2 rounded-full ${MEAL_NUTRITION_MOCK.nutritionCompliance >= 80 ? "bg-green-500" : MEAL_NUTRITION_MOCK.nutritionCompliance >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                style={{ width: `${MEAL_NUTRITION_MOCK.nutritionCompliance}%` }}
              />
            </div>
          </div>
          <div className="space-y-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <div className="flex items-center gap-2 text-xs">
              <Smile className="h-3.5 w-3.5 text-[#5C7F39]" />
              <span className="text-gray-700">{MEAL_NUTRITION_MOCK.moodCorrelation}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Droplets className="h-3.5 w-3.5 text-blue-500" />
              <span className="text-gray-700">{MEAL_NUTRITION_MOCK.hydrationNote}</span>
            </div>
          </div>
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

        {/* Calendar + Filter + Meals List */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 min-h-[420px] flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Utensils className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Meal History</h2>
            </div>
            <select
              value={mealFilter}
              onChange={(e) => {
                setMealFilter(e.target.value);
                setCurrentPage(0);
              }}
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent bg-white"
            >
              <option value="all">All Meals</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
            </select>
          </div>
          <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
            <div className="flex-shrink-0 rounded-lg border border-gray-200 p-4 bg-gray-50/50">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(d) => {
                  setSelectedDate(d);
                  setCurrentPage(0);
                }}
                captionLayout="dropdown"
                fromYear={2020}
                toYear={2030}
                modifiers={{ hasMeal: (date) => datesWithMeals.has(toDateStr(date)) }}
                modifiersClassNames={{ hasMeal: "bg-[#5C7F39]/10 font-semibold" }}
                className="mx-auto"
              />
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(undefined)}
                  className="mt-3 w-full text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear selection
                </button>
              )}
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <p className="text-sm text-gray-600 mb-2">
                {selectedDate
                  ? `Meals on ${selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}`
                  : "Click a date to filter by day"}
              </p>
              <div className="overflow-y-auto flex-1 space-y-3 pr-1">
            {paginatedMeals.map((meal) => (
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
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
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
              {sortedMeals.length > ITEMS_PER_PAGE && (
                <div className="flex-shrink-0 flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    Showing {currentPage * ITEMS_PER_PAGE + 1}–{Math.min((currentPage + 1) * ITEMS_PER_PAGE, sortedMeals.length)} of {sortedMeals.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                      disabled={currentPage === 0}
                      className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-600 px-2">{currentPage + 1} / {totalPages}</span>
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={currentPage >= totalPages - 1}
                      className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
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
