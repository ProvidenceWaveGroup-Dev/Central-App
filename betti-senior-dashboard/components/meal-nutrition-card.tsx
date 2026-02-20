"use client";

import { useState } from "react";
import Link from "next/link";
import { Utensils, CheckCircle, Clock, AlertTriangle, Droplets, Smile } from "lucide-react";

const MOCK = {
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

export function MealNutritionCard() {
  const [confirmingMeal, setConfirmingMeal] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({ b: true, l: true, d: false });

  const handleConfirmMeal = (id: string) => {
    setConfirmingMeal(id);
    setTimeout(() => {
      setConfirmed((prev) => ({ ...prev, [id]: true }));
      setConfirmingMeal(null);
    }, 800);
  };

  const pendingMeals = MOCK.mealsToday.filter((m) => !confirmed[m.id]);
  const complianceColor = MOCK.nutritionCompliance >= 80 ? "text-green-600" : MOCK.nutritionCompliance >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Utensils className="h-5 w-5 text-[#5C7F39]" />
          <h2 className="font-serif text-lg font-semibold text-gray-900">Meal & Nutrition</h2>
        </div>
        <Link href="/logs/meals" prefetch className="text-xs font-medium text-[#5C7F39] hover:underline">
          View logs
        </Link>
      </div>

      {/* Meal confirmation prompts */}
      <div className="space-y-2 mb-4">
        <div className="text-xs font-medium text-gray-500 mb-2">Today&apos;s meals</div>
        {MOCK.mealsToday.map((meal) => (
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

      {/* Missed meals indicator */}
      {(MOCK.missedMealsToday > 0 || MOCK.missedMealsThisWeek > 0) && (
        <div className="mb-4 flex items-center gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
          <div>
            <div className="text-sm font-medium text-red-700">Missed meals</div>
            <div className="text-xs text-red-600">
              {MOCK.missedMealsToday > 0 && `${MOCK.missedMealsToday} today`}
              {MOCK.missedMealsToday > 0 && MOCK.missedMealsThisWeek > 0 && " • "}
              {MOCK.missedMealsThisWeek > 0 && `${MOCK.missedMealsThisWeek} this week`}
            </div>
          </div>
        </div>
      )}

      {/* Nutrition compliance */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-500">Nutrition compliance</span>
          <span className={`text-sm font-bold ${complianceColor}`}>{MOCK.nutritionCompliance}%</span>
        </div>
        <div className="h-2 rounded-full bg-gray-100">
          <div
            className={`h-2 rounded-full ${MOCK.nutritionCompliance >= 80 ? "bg-green-500" : MOCK.nutritionCompliance >= 60 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${MOCK.nutritionCompliance}%` }}
          />
        </div>
      </div>

      {/* Correlation with mood/hydration */}
      <div className="space-y-2 p-3 rounded-lg bg-gray-50 border border-gray-100">
        <div className="flex items-center gap-2 text-xs">
          <Smile className="h-3.5 w-3.5 text-[#5C7F39]" />
          <span className="text-gray-700">{MOCK.moodCorrelation}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Droplets className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-gray-700">{MOCK.hydrationNote}</span>
        </div>
      </div>
    </div>
  );
}
