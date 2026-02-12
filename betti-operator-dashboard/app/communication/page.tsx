"use client";

import { useState } from "react";
import { MessageSquare, Users, Stethoscope, Building2, Send } from "lucide-react";

const quickActions = [
  { label: "Family Update", icon: Users, bg: "bg-blue-50 hover:bg-blue-100 border-blue-200", text: "text-blue-700" },
  { label: "Clinical Note", icon: Stethoscope, bg: "bg-green-50 hover:bg-green-100 border-green-200", text: "text-green-700" },
  { label: "Team Message", icon: MessageSquare, bg: "bg-purple-50 hover:bg-purple-100 border-purple-200", text: "text-purple-700" },
  { label: "Emergency Broadcast", icon: Send, bg: "bg-red-50 hover:bg-red-100 border-red-200", text: "text-red-700" },
];

interface Message {
  id: number;
  sender: string;
  recipientType: "Family" | "Clinical" | "Team";
  subject: string;
  time: string;
  read: boolean;
}

const recentMessages: Message[] = [
  { id: 1, sender: "You", recipientType: "Family", subject: "Update: Margaret Collins — Stable after fall assessment", time: "10 min ago", read: true },
  { id: 2, sender: "Dr. Angela Rivera", recipientType: "Clinical", subject: "Adjust medication for Robert Chen (Room 118)", time: "25 min ago", read: false },
  { id: 3, sender: "Nurse Sarah Kim", recipientType: "Team", subject: "Room 204 needs extra monitoring this shift", time: "45 min ago", read: true },
  { id: 4, sender: "Collins Family", recipientType: "Family", subject: "RE: Thank you for the update on Mom", time: "1 hr ago", read: false },
  { id: 5, sender: "Maria Lopez", recipientType: "Team", subject: "Shift handoff notes — important items flagged", time: "2 hr ago", read: true },
  { id: 6, sender: "You", recipientType: "Clinical", subject: "Vitals report for Thomas Wright — temp elevated", time: "3 hr ago", read: true },
];

const recipientColors: Record<string, string> = {
  Family: "bg-blue-100 text-blue-700",
  Clinical: "bg-green-100 text-green-700",
  Team: "bg-purple-100 text-purple-700",
};

const contactTabs = ["Families", "Clinical Team", "Management"] as const;

const contacts: Record<string, { name: string; role: string }[]> = {
  Families: [
    { name: "Collins Family", role: "Margaret Collins (Room 204)" },
    { name: "Chen Family", role: "Robert Chen (Room 118)" },
    { name: "Wilson Family", role: "James Wilson (Room 105)" },
    { name: "Torres Family", role: "Helen Torres (Room 220)" },
  ],
  "Clinical Team": [
    { name: "Dr. Angela Rivera", role: "Primary Physician" },
    { name: "Dr. Mark Thompson", role: "Geriatric Specialist" },
    { name: "Lisa Park, PT", role: "Physical Therapist" },
    { name: "Pharmacy Team", role: "Medication Management" },
  ],
  Management: [
    { name: "Director Johnson", role: "Facility Director" },
    { name: "HR Department", role: "Human Resources" },
    { name: "Maintenance", role: "Facility Maintenance" },
    { name: "IT Support", role: "Technical Support" },
  ],
};

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState<string>("Families");

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Communication Center</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a) => (
            <button key={a.label} className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${a.bg}`}>
              <a.icon className={`h-5 w-5 ${a.text}`} />
              <span className={`text-sm font-semibold ${a.text}`}>{a.label}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Messages */}
          <div className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">Recent Messages</h2>
            <div className="space-y-3">
              {recentMessages.map((msg) => (
                <div key={msg.id} className={`flex items-start gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 ${!msg.read ? "bg-blue-50/50" : ""}`}>
                  <div className="flex-shrink-0 mt-0.5 h-8 w-8 rounded-full bg-[#233E7D] flex items-center justify-center text-white text-xs font-semibold">
                    {msg.sender.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-gray-900 truncate">{msg.sender}</p>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${recipientColors[msg.recipientType]}`}>
                        {msg.recipientType}
                      </span>
                      {!msg.read && <span className="h-2 w-2 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Directory */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="font-serif text-lg font-semibold text-gray-900 mb-4">Contact Directory</h2>
            <div className="flex gap-1 mb-4 border-b border-gray-200">
              {contactTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-xs font-semibold transition-colors border-b-2 ${
                    activeTab === tab
                      ? "border-[#5C7F39] text-[#5C7F39]"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {contacts[activeTab]?.map((c) => (
                <div key={c.name} className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.role}</p>
                  </div>
                  <button className="rounded-lg bg-[#233E7D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1c3164] transition">
                    Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
