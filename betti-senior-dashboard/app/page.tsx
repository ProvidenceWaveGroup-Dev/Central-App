"use client";

import { useState, useEffect } from "react";
import { BettiLoader, usePageLoader } from "@/components/betti-loader";
import { EnvironmentCard } from "@/components/environment-card";
import {
  Heart,
  Droplets,
  Pill,
  Activity,
  Shield,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  Bed,
  Footprints,
  Utensils,
  Calendar,
  Lock,
  Home,
  AlertTriangle,
  PersonStanding,
  AlertOctagon,
  PhoneCall,
  ThumbsUp
} from "lucide-react";

export default function SeniorDashboard() {
  const isPageLoading = usePageLoader(1500);
  const [wellBeingScore] = useState(85);
  const [lastOkTime, setLastOkTime] = useState("2 hours ago");
  const [latestAlert, setLatestAlert] = useState<string | null>(null);
  const [okButtonText, setOkButtonText] = useState("I'm OK");
  const [, setShowAlertSnapshot] = useState(false);
  const [emergencyStatus, setEmergencyStatus] = useState("");

  // Fall Detection State
  const [, setFallDetected] = useState(false);
  const [showRecoveryPrompt, setShowRecoveryPrompt] = useState(false);
  const [lastFallTime, setLastFallTime] = useState<string | null>(null);
  const [fallAlertCountdown, setFallAlertCountdown] = useState(30);
  const [recoveryStatus, setRecoveryStatus] = useState<"monitoring" | "fall_detected" | "recovering" | "help_requested">("monitoring");

  useEffect(() => {
    const hasShownAlert = sessionStorage.getItem("alertShown");

    if (!hasShownAlert) {
      const alerts = [
        "Medication reminder: Take your afternoon pills",
        "Hydration reminder: You haven't had water in 3 hours",
        "Restroom reminder: It's been 4 hours since your last visit",
        "Shower reminder: Daily shower scheduled for 2 PM",
      ];

      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      setLatestAlert(randomAlert);
      sessionStorage.setItem("alertShown", "true");

      const timer = setTimeout(() => {
        setLatestAlert(null);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);

  // Fall Detection Countdown Effect
  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;

    if (showRecoveryPrompt && fallAlertCountdown > 0) {
      countdownInterval = setInterval(() => {
        setFallAlertCountdown((prev) => {
          if (prev <= 1) {
            // Auto-escalate to emergency services
            handleRequestHelp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [showRecoveryPrompt, fallAlertCountdown]);

  // Simulate fall detection (for demo/testing)
  const simulateFallDetection = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setFallDetected(true);
    setLastFallTime(timeString);
    setRecoveryStatus("fall_detected");
    setFallAlertCountdown(30);
    setShowRecoveryPrompt(true);
  };

  // Handle "I'm Fine" response
  const handleImFine = () => {
    setShowRecoveryPrompt(false);
    setFallDetected(false);
    setRecoveryStatus("recovering");
    setFallAlertCountdown(30);

    // Show recovery status for a few seconds then return to monitoring
    setTimeout(() => {
      setRecoveryStatus("monitoring");
    }, 5000);
  };

  // Handle "I Need Help" response
  const handleRequestHelp = () => {
    setShowRecoveryPrompt(false);
    setRecoveryStatus("help_requested");
    setEmergencyStatus("Contacting emergency services and caregivers...");

    setTimeout(() => {
      setEmergencyStatus("Help is on the way! Caregiver notified. ETA: 5 minutes.");
    }, 2000);

    setTimeout(() => {
      setEmergencyStatus("");
      setFallDetected(false);
      setRecoveryStatus("monitoring");
    }, 10000);
  };

  const handleOkButton = () => {
    setOkButtonText("Thank you! Status recorded.");
    setLastOkTime("Just now");
    setTimeout(() => {
      setOkButtonText("I'm OK");
    }, 3000);
  };

  const handlePanicButton = () => {
    setEmergencyStatus("Calling 911...");
    setTimeout(() => {
      setEmergencyStatus("Emergency services contacted. Help is on the way.");
    }, 2000);
    setTimeout(() => {
      setEmergencyStatus("");
    }, 8000);
  };

  const handleViewAlerts = () => {
    setShowAlertSnapshot(true);
  };

  const dismissAlert = () => {
    setLatestAlert(null);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Betti Loading Spinner */}
      <BettiLoader isLoading={isPageLoading} />

      <div className="mx-auto max-w-7xl space-y-6">
        {/* Alert Modal */}
        {latestAlert && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl p-6 max-w-md w-full text-center shadow-2xl">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="font-serif text-xl text-[#233E7D] mb-2">
                Hello, Margaret!
              </h2>
              <div className="rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <AlertTriangle className="h-6 w-6 text-[#5C7F39]" />
                  <div className="font-medium text-[#5C7F39]">Latest Alert</div>
                </div>
                <div className="text-gray-600">{latestAlert}</div>
              </div>
              <button
                onClick={dismissAlert}
                className="inline-flex items-center justify-center rounded-lg bg-[#5C7F39] px-8 py-2 text-sm font-medium text-white hover:bg-[#4a6a2e] transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        )}

        {/* Fall Detection Recovery Prompt Modal */}
        {showRecoveryPrompt && (
          <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full text-center shadow-2xl">
              {/* Alert Icon */}
              <div className="w-24 h-24 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce">
                <AlertOctagon className="h-14 w-14 text-red-600" />
              </div>

              {/* Title */}
              <h2 className="font-serif text-2xl sm:text-3xl text-red-600 mb-2">
                Fall Detected!
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Margaret, are you okay?
              </p>

              {/* Countdown Timer */}
              <div className="mb-6">
                <div className="text-5xl font-bold text-red-600 mb-2">
                  {fallAlertCountdown}
                </div>
                <p className="text-sm text-gray-500">
                  seconds until emergency services are contacted
                </p>
                <div className="mt-3 h-3 rounded-full bg-red-100">
                  <div
                    className="h-3 rounded-full bg-red-500 transition-all"
                    style={{ width: `${(fallAlertCountdown / 30) * 100}%` }}
                  />
                </div>
              </div>

              {/* Response Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleImFine}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-green-600 px-6 py-4 sm:py-6 text-xl font-medium text-white hover:bg-green-700 transition-colors"
                >
                  <ThumbsUp className="h-7 w-7" />
                  I'm Fine
                </button>

                <button
                  onClick={handleRequestHelp}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-4 sm:py-6 text-xl font-medium text-white hover:bg-red-700 transition-colors"
                >
                  <PhoneCall className="h-7 w-7" />
                  I Need Help
                </button>
              </div>

              {/* Additional Info */}
              <p className="text-xs text-gray-400 mt-6">
                If you don't respond, we'll automatically contact your emergency contacts and services.
              </p>
            </div>
          </div>
        )}

        {/* Emergency Status Banner */}
        {emergencyStatus && (
          <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-4 z-40 text-center shadow-lg">
            <div className="flex items-center justify-center gap-3">
              <PhoneCall className="h-5 w-5 animate-pulse" />
              <span className="font-medium">{emergencyStatus}</span>
            </div>
          </div>
        )}

        {/* Welcome Header */}
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
            Welcome Back, Margaret
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Here&apos;s your daily health overview
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Well-being Score Card */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-[#5C7F39]" />
              <h2 className="font-serif text-lg font-semibold text-[#5C7F39]">
                Daily Well-being Score
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#5C7F39]">
                {wellBeingScore}
              </div>
              <div className="text-center sm:text-right">
                <div className="text-sm text-gray-500">Out of 100</div>
                <span className="inline-flex rounded-full bg-[#5C7F39] px-3 py-1 text-xs font-semibold text-white">
                  Excellent
                </span>
              </div>
            </div>
            <div className="mb-4 h-3 rounded-full bg-green-100">
              <div
                className="h-3 rounded-full bg-[#5C7F39] transition-all"
                style={{ width: `${wellBeingScore}%` }}
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
              {[
                { icon: Droplets, label: "Hydration", value: "Good" },
                { icon: Bed, label: "Sleep", value: "7.5 hrs" },
                { icon: Pill, label: "Medications", value: "On track" },
                { icon: Footprints, label: "Movement", value: "Active" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <item.icon className="h-4 w-4 sm:h-5 sm:w-5 mx-auto mb-1 text-[#5C7F39]" />
                  <div className="font-medium text-gray-600 text-xs sm:text-sm">
                    {item.label}
                  </div>
                  <div className="text-gray-600 text-xs sm:text-sm">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar Cards */}
          <div className="space-y-4">
            {/* Quick Check-in */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-serif text-lg font-semibold text-[#233E7D] mb-4">
                Quick Check-in
              </h2>
              <div className="space-y-4">
                <button
                  onClick={handleOkButton}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#5C7F39] px-4 py-4 sm:py-6 text-base sm:text-lg font-medium text-white hover:bg-[#4a6a2e] transition-colors"
                >
                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  {okButtonText}
                </button>
                <div className="text-xs sm:text-sm text-gray-500 text-center">
                  Last check-in: {lastOkTime}
                </div>

                {/* Fall Detection Simulation */}
                {recoveryStatus === "monitoring" && (
                  <button
                    onClick={simulateFallDetection}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-orange-400 px-4 py-3 text-sm font-medium text-orange-600 hover:bg-orange-500 hover:text-white transition-colors"
                  >
                    <PersonStanding className="h-4 w-4" />
                    Simulate Fall Detection
                  </button>
                )}
              </div>
            </div>

            {/* Emergency */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-serif text-lg font-semibold text-[#233E7D] mb-4">
                Emergency
              </h2>
              <button
                onClick={handlePanicButton}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-4 sm:py-6 text-base sm:text-lg font-medium text-white hover:bg-red-700 transition-colors"
              >
                <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                Panic Button
              </button>
            </div>

            {/* Alerts */}
            <div className="rounded-xl border border-gray-200 bg-white p-5">
              <h2 className="font-serif text-lg font-semibold text-[#233E7D] mb-4">
                Alerts
              </h2>
              <button
                onClick={handleViewAlerts}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#233E7D] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors"
              >
                <AlertTriangle className="h-4 w-4" />
                View Alerts
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: Droplets,
              title: "Hydration",
              value: "6/8",
              subtitle: "Glasses today",
              progress: 75,
              goal: "Goal: 8 glasses daily",
              color: "blue",
            },
            {
              icon: Pill,
              title: "Medications",
              value: "3/4",
              subtitle: "Taken today",
              progress: null,
              color: "green",
              details: [
                { label: "Morning pills", status: "done" },
                { label: "Afternoon pills", status: "pending" },
              ],
            },
            {
              icon: Utensils,
              title: "Meals",
              value: "2/3",
              subtitle: "Meals today",
              progress: null,
              color: "orange",
              details: [
                { label: "Breakfast", status: "done" },
                { label: "Lunch", status: "done" },
                { label: "Dinner", status: "pending" },
              ],
            },
            {
              icon: Activity,
              title: "Activity",
              value: "2,847",
              subtitle: "Steps today",
              progress: 57,
              goal: "Goal: 5,000 steps daily",
              color: "purple",
            },
          ].map((card, index) => {
            const colorMap: Record<string, string> = {
              blue: "bg-blue-50 border-blue-200",
              green: "bg-green-50 border-green-200",
              orange: "bg-orange-50 border-orange-200",
              purple: "bg-purple-50 border-purple-200",
            };
            const iconColorMap: Record<string, string> = {
              blue: "text-blue-600",
              green: "text-green-600",
              orange: "text-orange-600",
              purple: "text-purple-600",
            };
            const barColorMap: Record<string, string> = {
              blue: "bg-blue-600",
              green: "bg-green-600",
              orange: "bg-orange-600",
              purple: "bg-purple-600",
            };
            const barBgMap: Record<string, string> = {
              blue: "bg-blue-100",
              green: "bg-green-100",
              orange: "bg-orange-100",
              purple: "bg-purple-100",
            };

            return (
              <div
                key={index}
                className={`rounded-xl border p-5 ${colorMap[card.color]}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <card.icon className={`h-5 w-5 ${iconColorMap[card.color]}`} />
                  <h3 className={`font-serif text-base font-semibold ${iconColorMap[card.color]}`}>
                    {card.title}
                  </h3>
                </div>
                <div className={`text-2xl sm:text-3xl font-bold ${iconColorMap[card.color]} mb-1`}>
                  {card.value}
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mb-3">
                  {card.subtitle}
                </div>
                {card.progress && (
                  <>
                    <div className={`h-2 rounded-full ${barBgMap[card.color]} mb-2`}>
                      <div
                        className={`h-2 rounded-full ${barColorMap[card.color]} transition-all`}
                        style={{ width: `${card.progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">{card.goal}</div>
                  </>
                )}
                {card.details && (
                  <div className="space-y-2 text-xs sm:text-sm">
                    {card.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-gray-500">{detail.label}</span>
                        {detail.status === "done" ? (
                          <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        ) : (
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Environmental Health */}
        <EnvironmentCard />

        {/* Secondary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Appointments */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">
                Appointments
              </h2>
            </div>
            <div className="space-y-3">
              {[
                {
                  doctor: "Dr. Smith",
                  time: "Tomorrow 2:00 PM",
                  status: "Confirmed",
                  badgeClass: "bg-green-100 text-green-700 border border-green-200",
                },
                {
                  doctor: "Physical Therapy",
                  time: "Friday 10:00 AM",
                  status: "Scheduled",
                  badgeClass: "bg-blue-100 text-blue-700 border border-blue-200",
                },
              ].map((apt, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 gap-2"
                >
                  <div className="flex-1">
                    <div className="font-medium text-xs sm:text-sm text-gray-700">
                      {apt.doctor}
                    </div>
                    <div className="text-xs text-gray-500">{apt.time}</div>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold self-start sm:self-auto ${apt.badgeClass}`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Home */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">
                Smart Home
              </h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {[
                { icon: Lock, label: "Front Door", status: "Locked" },
                { icon: Lock, label: "Back Door", status: "Locked" },
                { icon: Home, label: "Security System", status: "Armed" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="h-3 w-3 sm:h-4 sm:w-4 text-[#233E7D]" />
                    <span className="text-xs sm:text-sm text-gray-600">
                      {item.label}
                    </span>
                  </div>
                  <span className="inline-flex rounded-full bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 text-xs font-semibold">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Restroom Activity */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">
                Restroom Activity
              </h2>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#5C7F39] mb-2">
              4
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mb-4">
              Visits today
            </div>
            <div className="text-xs sm:text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Last visit:</span>
                <span className="text-gray-600">1 hour ago</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Average frequency:</span>
                <span className="text-gray-600">Normal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Fall Alert Card */}
          <div className={`rounded-xl border-2 p-5 ${
            recoveryStatus === "fall_detected" || recoveryStatus === "help_requested"
              ? "bg-red-50 border-red-300"
              : recoveryStatus === "recovering"
              ? "bg-yellow-50 border-yellow-300"
              : "bg-white border-gray-200"
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PersonStanding className={`h-5 w-5 sm:h-6 sm:w-6 ${
                  recoveryStatus === "fall_detected" || recoveryStatus === "help_requested"
                    ? "text-red-600"
                    : recoveryStatus === "recovering"
                    ? "text-yellow-600"
                    : "text-[#5C7F39]"
                }`} />
                <h2 className={`font-serif text-base sm:text-lg font-semibold ${
                  recoveryStatus === "fall_detected" || recoveryStatus === "help_requested"
                    ? "text-red-600"
                    : recoveryStatus === "recovering"
                    ? "text-yellow-600"
                    : "text-[#5C7F39]"
                }`}>
                  Fall Alert
                </h2>
              </div>
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
                recoveryStatus === "fall_detected"
                  ? "bg-red-600 animate-pulse"
                  : recoveryStatus === "help_requested"
                  ? "bg-red-700"
                  : recoveryStatus === "recovering"
                  ? "bg-yellow-500"
                  : "bg-[#5C7F39]"
              }`}>
                {recoveryStatus === "fall_detected"
                  ? "FALL DETECTED"
                  : recoveryStatus === "help_requested"
                  ? "HELP REQUESTED"
                  : recoveryStatus === "recovering"
                  ? "Recovering"
                  : "Monitoring"}
              </span>
            </div>

            <div className="space-y-4">
              {/* Status Display */}
              <div className={`p-4 rounded-lg ${
                recoveryStatus === "fall_detected" || recoveryStatus === "help_requested"
                  ? "bg-red-100"
                  : recoveryStatus === "recovering"
                  ? "bg-yellow-100"
                  : "bg-green-50"
              }`}>
                <div className="flex items-center gap-3 mb-2">
                  {recoveryStatus === "monitoring" && (
                    <>
                      <Shield className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-700">All Clear</span>
                    </>
                  )}
                  {recoveryStatus === "fall_detected" && (
                    <>
                      <AlertOctagon className="h-5 w-5 text-red-600 animate-pulse" />
                      <span className="font-medium text-red-700">Fall Detected!</span>
                    </>
                  )}
                  {recoveryStatus === "recovering" && (
                    <>
                      <ThumbsUp className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium text-yellow-700">User Confirmed OK</span>
                    </>
                  )}
                  {recoveryStatus === "help_requested" && (
                    <>
                      <PhoneCall className="h-5 w-5 text-red-600 animate-pulse" />
                      <span className="font-medium text-red-700">Help On The Way</span>
                    </>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-gray-600">
                  {recoveryStatus === "monitoring" && "Sensors are actively monitoring for falls."}
                  {recoveryStatus === "fall_detected" && "Please respond to the recovery prompt."}
                  {recoveryStatus === "recovering" && "Great! Continuing to monitor your safety."}
                  {recoveryStatus === "help_requested" && "Emergency contacts and services notified."}
                </p>
              </div>

              {/* Last Fall Info */}
              <div className="text-xs sm:text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Fall Event:</span>
                  <span className="text-gray-700 font-medium">
                    {lastFallTime || "No recent falls"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Sensor Status:</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Response Time:</span>
                  <span className="text-gray-700 font-medium">30 seconds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Safety Status */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">
                Safety Status
              </h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {[
                { label: "Fall Detection", status: recoveryStatus === "monitoring" ? "Active" : recoveryStatus === "fall_detected" ? "Alert!" : "Active" },
                { label: "Emergency Contacts", status: "3 Available" },
                { label: "Voice Assistant", status: "Connected" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <span className="text-xs sm:text-sm text-gray-600">
                    {item.label}
                  </span>
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${
                    item.status === "Alert!" ? "bg-red-600" : "bg-[#5C7F39]"
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Location */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">
                Current Location
              </h2>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#5C7F39] mb-2">
              Living Room
            </div>
            <div className="text-xs sm:text-sm text-gray-500 mb-4">
              Last updated: 5 minutes ago
            </div>
            <div className="text-xs sm:text-sm">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Time in room:</span>
                <span className="text-gray-600">45 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Activity level:</span>
                <span className="text-gray-600">Normal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Daily Encouragement */}
        <div className="rounded-xl bg-[#233E7D] p-6 text-center">
          <h3 className="font-serif text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-2">
            Daily Encouragement
          </h3>
          <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed">
            You're doing wonderfully today, Margaret! Your consistent health
            habits are paying off. Remember, every small step counts toward
            your well-being. Your family is proud of how well you're taking
            care of yourself.
          </p>
        </div>
      </div>
    </div>
  );
}
