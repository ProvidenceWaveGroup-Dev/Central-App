"use client";

import { useState } from "react";
import { MessageSquare, Users, Stethoscope, Building2, Send, X, AlertTriangle } from "lucide-react";

// ── Shared helpers ─────────────────────────────────────────────────────────────
const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#233E7D] focus:outline-none focus:ring-2 focus:ring-[#233E7D]/20";

function Modal({
  title,
  onClose,
  children,
  danger,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div
          className={`flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 ${
            danger ? "bg-red-50" : ""
          }`}
        >
          <h2
            className={`font-serif text-lg font-semibold ${
              danger ? "text-red-700" : "text-gray-900"
            }`}
          >
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-gray-100 transition"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-5 space-y-4 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm font-semibold text-green-700">
      {message}
    </div>
  );
}

// ── Family Update Modal ────────────────────────────────────────────────────────
function FamilyUpdateModal({ onClose }: { onClose: () => void }) {
  const [family, setFamily]   = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [sent, setSent]       = useState(false);

  const families = [
    "Collins Family — Margaret Collins (Room 204)",
    "Chen Family — Robert Chen (Room 118)",
    "Wilson Family — James Wilson (Room 105)",
    "Torres Family — Helen Torres (Room 220)",
    "Martinez Family — Frank Martinez (Room 401)",
    "Palmer Family — Dorothy Palmer (Room 310)",
  ];

  const canSend = family && subject.trim() && body.trim();

  if (sent) {
    return (
      <Modal title="Family Update" onClose={onClose}>
        <SuccessBanner message="Family update sent successfully." />
        <button
          onClick={onClose}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Close
        </button>
      </Modal>
    );
  }

  return (
    <Modal title="Family Update" onClose={onClose}>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Recipient Family
        </label>
        <select value={family} onChange={(e) => setFamily(e.target.value)} className={inputCls}>
          <option value="">Select family…</option>
          {families.map((f) => (
            <option key={f} value={f}>{f}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Weekly health update"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Message
        </label>
        <textarea
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your update for the family here…"
          className={`${inputCls} resize-none`}
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          disabled={!canSend}
          onClick={() => setSent(true)}
          className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send Update
        </button>
      </div>
    </Modal>
  );
}

// ── Clinical Note Modal ────────────────────────────────────────────────────────
function ClinicalNoteModal({ onClose }: { onClose: () => void }) {
  const [resident, setResident]   = useState("");
  const [noteType, setNoteType]   = useState("");
  const [content, setContent]     = useState("");
  const [submitted, setSubmitted] = useState(false);

  const residents = [
    "Margaret Collins — Room 204",
    "Thomas Wright — Room 306",
    "Robert Chen — Room 118",
    "Dorothy Palmer — Room 310",
    "Frank Martinez — Room 401",
    "William Davis — Room 302",
    "Helen Torres — Room 220",
  ];

  const noteTypes = [
    "Observation Note",
    "Medication Administration",
    "Incident Follow-Up",
    "Vitals Notation",
    "Behavior Note",
    "Family Communication Note",
    "Care Plan Update",
  ];

  const canSubmit = resident && noteType && content.trim();

  if (submitted) {
    return (
      <Modal title="Clinical Note" onClose={onClose}>
        <SuccessBanner message="Clinical note recorded successfully." />
        <button
          onClick={onClose}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Close
        </button>
      </Modal>
    );
  }

  return (
    <Modal title="Clinical Note" onClose={onClose}>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Resident
        </label>
        <select value={resident} onChange={(e) => setResident(e.target.value)} className={inputCls}>
          <option value="">Select resident…</option>
          {residents.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Note Type
        </label>
        <select value={noteType} onChange={(e) => setNoteType(e.target.value)} className={inputCls}>
          <option value="">Select type…</option>
          {noteTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Note Content
        </label>
        <textarea
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Record your clinical observation or note…"
          className={`${inputCls} resize-none`}
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
          className="flex-1 rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-semibold text-white hover:bg-[#4f6b32] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Submit Note
        </button>
      </div>
    </Modal>
  );
}

// ── Team Message Modal ─────────────────────────────────────────────────────────
function TeamMessageModal({ onClose }: { onClose: () => void }) {
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [sent, setSent]       = useState(false);

  const canSend = subject.trim() && body.trim();

  if (sent) {
    return (
      <Modal title="Team Message" onClose={onClose}>
        <SuccessBanner message="Message sent to all on-shift staff." />
        <button
          onClick={onClose}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Close
        </button>
      </Modal>
    );
  }

  return (
    <Modal title="Team Message" onClose={onClose}>
      <p className="text-xs text-gray-500 rounded-lg bg-purple-50 border border-purple-100 px-3 py-2">
        This message will be sent to all staff currently on shift.
      </p>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Shift briefing update"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Message
        </label>
        <textarea
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Write your message to the team…"
          className={`${inputCls} resize-none`}
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          disabled={!canSend}
          onClick={() => setSent(true)}
          className="flex-1 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send to Team
        </button>
      </div>
    </Modal>
  );
}

// ── Emergency Broadcast Modal ──────────────────────────────────────────────────
function EmergencyBroadcastModal({ onClose }: { onClose: () => void }) {
  const [recipients, setRecipients] = useState<string[]>([]);
  const [message, setMessage]       = useState("");
  const [sent, setSent]             = useState(false);

  const recipientOptions = [
    "All On-Shift Staff",
    "Nursing Team",
    "Care Aides",
    "Shift Supervisor",
    "Facility Management",
    "External Emergency Services",
  ];

  const toggleRecipient = (r: string) =>
    setRecipients((prev) =>
      prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]
    );

  const canSend = recipients.length > 0 && message.trim();

  if (sent) {
    return (
      <Modal title="Emergency Broadcast" onClose={onClose} danger>
        <SuccessBanner message="Emergency broadcast sent to all selected recipients." />
        <button
          onClick={onClose}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Close
        </button>
      </Modal>
    );
  }

  return (
    <Modal title="Emergency Broadcast" onClose={onClose} danger>
      <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2">
        <AlertTriangle className="h-4 w-4 text-red-600 flex-shrink-0" />
        <p className="text-xs font-semibold text-red-700">
          This will immediately alert all selected recipients. Use only for urgent situations.
        </p>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
          Recipients
        </label>
        <div className="space-y-2">
          {recipientOptions.map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={recipients.includes(r)}
                onChange={() => toggleRecipient(r)}
                className="h-4 w-4 rounded border-gray-300 accent-red-600"
              />
              <span className="text-sm text-gray-700">{r}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Broadcast Message
        </label>
        <textarea
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe the emergency situation clearly and concisely…"
          className={`${inputCls} resize-none`}
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          disabled={!canSend}
          onClick={() => setSent(true)}
          className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send Broadcast
        </button>
      </div>
    </Modal>
  );
}

// ── Direct Message Modal ───────────────────────────────────────────────────────
function DirectMessageModal({
  contact,
  onClose,
}: {
  contact: { name: string; role: string };
  onClose: () => void;
}) {
  const [subject, setSubject] = useState("");
  const [body, setBody]       = useState("");
  const [sent, setSent]       = useState(false);

  const canSend = subject.trim() && body.trim();

  if (sent) {
    return (
      <Modal title="Message" onClose={onClose}>
        <SuccessBanner message={`Message sent to ${contact.name}.`} />
        <button
          onClick={onClose}
          className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Close
        </button>
      </Modal>
    );
  }

  return (
    <Modal title="Send Message" onClose={onClose}>
      {/* Recipient banner */}
      <div className="flex items-center gap-3 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2">
        <div className="h-9 w-9 rounded-full bg-[#233E7D] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {contact.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{contact.name}</p>
          <p className="text-xs text-gray-500">{contact.role}</p>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Subject
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Message subject…"
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Message
        </label>
        <textarea
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Write your message to ${contact.name}…`}
          className={`${inputCls} resize-none`}
        />
      </div>
      <div className="flex gap-3 pt-1">
        <button
          onClick={onClose}
          className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          disabled={!canSend}
          onClick={() => setSent(true)}
          className="flex-1 rounded-lg bg-[#233E7D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1c3164] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Send Message
        </button>
      </div>
    </Modal>
  );
}

// ── Static data ────────────────────────────────────────────────────────────────
type QuickActionKey = "Family Update" | "Clinical Note" | "Team Message" | "Emergency Broadcast";

const quickActions: { label: QuickActionKey; icon: React.ElementType; bg: string; text: string }[] = [
  { label: "Family Update",        icon: Users,        bg: "bg-blue-50 hover:bg-blue-100 border-blue-200",   text: "text-blue-700"   },
  { label: "Clinical Note",        icon: Stethoscope,  bg: "bg-green-50 hover:bg-green-100 border-green-200", text: "text-green-700"  },
  { label: "Team Message",         icon: MessageSquare, bg: "bg-purple-50 hover:bg-purple-100 border-purple-200", text: "text-purple-700" },
  { label: "Emergency Broadcast",  icon: Send,         bg: "bg-red-50 hover:bg-red-100 border-red-200",       text: "text-red-700"    },
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
  { id: 1, sender: "You",              recipientType: "Family",   subject: "Update: Margaret Collins — Stable after fall assessment",  time: "10 min ago", read: true  },
  { id: 2, sender: "Dr. Angela Rivera", recipientType: "Clinical", subject: "Adjust medication for Robert Chen (Room 118)",             time: "25 min ago", read: false },
  { id: 3, sender: "Nurse Sarah Kim",  recipientType: "Team",     subject: "Room 204 needs extra monitoring this shift",               time: "45 min ago", read: true  },
  { id: 4, sender: "Collins Family",   recipientType: "Family",   subject: "RE: Thank you for the update on Mom",                      time: "1 hr ago",   read: false },
  { id: 5, sender: "Maria Lopez",      recipientType: "Team",     subject: "Shift handoff notes — important items flagged",            time: "2 hr ago",   read: true  },
  { id: 6, sender: "You",              recipientType: "Clinical", subject: "Vitals report for Thomas Wright — temp elevated",          time: "3 hr ago",   read: true  },
];

const recipientColors: Record<string, string> = {
  Family:   "bg-blue-100 text-blue-700",
  Clinical: "bg-green-100 text-green-700",
  Team:     "bg-purple-100 text-purple-700",
};

const contactTabs = ["Families", "Clinical Team", "Management"] as const;

const contacts: Record<string, { name: string; role: string }[]> = {
  Families: [
    { name: "Collins Family", role: "Margaret Collins (Room 204)" },
    { name: "Chen Family",    role: "Robert Chen (Room 118)"      },
    { name: "Wilson Family",  role: "James Wilson (Room 105)"     },
    { name: "Torres Family",  role: "Helen Torres (Room 220)"     },
  ],
  "Clinical Team": [
    { name: "Dr. Angela Rivera", role: "Primary Physician"        },
    { name: "Dr. Mark Thompson", role: "Geriatric Specialist"     },
    { name: "Lisa Park, PT",     role: "Physical Therapist"       },
    { name: "Pharmacy Team",     role: "Medication Management"    },
  ],
  Management: [
    { name: "Director Johnson", role: "Facility Director"   },
    { name: "HR Department",    role: "Human Resources"      },
    { name: "Maintenance",      role: "Facility Maintenance" },
    { name: "IT Support",       role: "Technical Support"    },
  ],
};

// ── Page ──────────────────────────────────────────────────────────────────────
type ActiveModal =
  | { type: "familyUpdate" }
  | { type: "clinicalNote" }
  | { type: "teamMessage" }
  | { type: "emergencyBroadcast" }
  | { type: "directMessage"; contact: { name: string; role: string } }
  | null;

export default function CommunicationPage() {
  const [activeTab,   setActiveTab]   = useState<string>("Families");
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const openQuickAction = (label: QuickActionKey) => {
    if (label === "Family Update")       setActiveModal({ type: "familyUpdate" });
    if (label === "Clinical Note")       setActiveModal({ type: "clinicalNote" });
    if (label === "Team Message")        setActiveModal({ type: "teamMessage" });
    if (label === "Emergency Broadcast") setActiveModal({ type: "emergencyBroadcast" });
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">Communication Center</h1>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((a) => (
            <button
              key={a.label}
              onClick={() => openQuickAction(a.label)}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${a.bg}`}
            >
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
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 ${
                    !msg.read ? "bg-blue-50/50" : ""
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5 h-8 w-8 rounded-full bg-[#233E7D] flex items-center justify-center text-white text-xs font-semibold">
                    {msg.sender.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-gray-900 truncate">{msg.sender}</p>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${recipientColors[msg.recipientType]}`}>
                        {msg.recipientType}
                      </span>
                      {!msg.read && <span className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />}
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
                  <button
                    onClick={() => setActiveModal({ type: "directMessage", contact: c })}
                    className="rounded-lg bg-[#233E7D] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1c3164] transition"
                  >
                    Message
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal?.type === "familyUpdate"       && <FamilyUpdateModal       onClose={() => setActiveModal(null)} />}
      {activeModal?.type === "clinicalNote"        && <ClinicalNoteModal        onClose={() => setActiveModal(null)} />}
      {activeModal?.type === "teamMessage"         && <TeamMessageModal         onClose={() => setActiveModal(null)} />}
      {activeModal?.type === "emergencyBroadcast"  && <EmergencyBroadcastModal  onClose={() => setActiveModal(null)} />}
      {activeModal?.type === "directMessage"       && (
        <DirectMessageModal
          contact={(activeModal as { type: "directMessage"; contact: { name: string; role: string } }).contact}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
