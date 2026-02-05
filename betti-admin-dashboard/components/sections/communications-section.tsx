"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PaginationControlled } from "@/components/ui/pagination";
import {
  MessageSquare,
  Phone,
  Video,
  Clock,
  User,
  Search,
  Plus,
  CheckCircle,
  PhoneIncoming,
  PhoneOutgoing,
} from "lucide-react";

// Schema-aligned: messages table
interface Message {
  message_id: number;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  recipient_id: number;
  recipient_name: string;
  channel: "text" | "email" | "push" | "in_app";
  content: string;
  sent_at: string;
  read_at: string | null;
  related_patient_id: number | null;
  related_patient_name: string | null;
}

// Schema-aligned: calls table
interface Call {
  call_id: number;
  caller_id: number;
  caller_name: string;
  recipient_id: number;
  recipient_name: string;
  call_type: "voice" | "video";
  status: "completed" | "missed" | "declined" | "ongoing";
  duration_seconds: number | null;
  started_at: string;
  ended_at: string | null;
  related_patient_id: number | null;
  related_patient_name: string | null;
}

const messages: Message[] = [
  {
    message_id: 5521,
    sender_id: 340,
    sender_name: "Angela Reyes",
    sender_role: "Caregiver",
    recipient_id: 501,
    recipient_name: "Johnson Family",
    channel: "text",
    content: "Patient is stable, monitoring continues. Will update after evening check-in.",
    sent_at: "2026-02-01T06:50:00Z",
    read_at: "2026-02-01T06:52:00Z",
    related_patient_id: 501,
    related_patient_name: "Margaret Johnson"
  },
  {
    message_id: 5518,
    sender_id: 342,
    sender_name: "Emily Brown",
    sender_role: "Caregiver",
    recipient_id: 503,
    recipient_name: "Davis Family",
    channel: "text",
    content: "Helen had a good night. Slight confusion this morning but responded well to redirection.",
    sent_at: "2026-02-01T06:30:00Z",
    read_at: null,
    related_patient_id: 503,
    related_patient_name: "Helen Davis"
  },
  {
    message_id: 5515,
    sender_id: 1,
    sender_name: "System",
    sender_role: "Automated",
    recipient_id: 340,
    recipient_name: "Angela Reyes",
    channel: "push",
    content: "Alert: Fall detected for Margaret Johnson in Room 214. Immediate attention required.",
    sent_at: "2026-02-01T06:47:30Z",
    read_at: "2026-02-01T06:47:45Z",
    related_patient_id: 501,
    related_patient_name: "Margaret Johnson"
  },
  {
    message_id: 5512,
    sender_id: 344,
    sender_name: "Sarah Williams",
    sender_role: "Admin",
    recipient_id: 0,
    recipient_name: "All Staff",
    channel: "in_app",
    content: "Reminder: Monthly safety drill scheduled for tomorrow at 10 AM. All staff please participate.",
    sent_at: "2026-02-01T05:00:00Z",
    read_at: null,
    related_patient_id: null,
    related_patient_name: null
  },
  // Additional messages
  {
    message_id: 5509,
    sender_id: 341,
    sender_name: "John Davis",
    sender_role: "Caregiver",
    recipient_id: 502,
    recipient_name: "Smith Family",
    channel: "text",
    content: "Robert's blood pressure is within normal range this morning. He enjoyed breakfast and is in good spirits.",
    sent_at: "2026-02-01T04:45:00Z",
    read_at: "2026-02-01T04:50:00Z",
    related_patient_id: 502,
    related_patient_name: "Robert Smith"
  },
  {
    message_id: 5506,
    sender_id: 1,
    sender_name: "System",
    sender_role: "Automated",
    recipient_id: 342,
    recipient_name: "Emily Brown",
    channel: "push",
    content: "Medication reminder: Dorothy Miller's 8 AM medication is due in 15 minutes.",
    sent_at: "2026-02-01T04:45:00Z",
    read_at: "2026-02-01T04:46:00Z",
    related_patient_id: 507,
    related_patient_name: "Dorothy Miller"
  },
  {
    message_id: 5503,
    sender_id: 343,
    sender_name: "Michael Lee",
    sender_role: "Caregiver",
    recipient_id: 509,
    recipient_name: "Taylor Family",
    channel: "email",
    content: "Elizabeth's physical therapy session went well today. Showing improvement in mobility exercises.",
    sent_at: "2026-02-01T04:30:00Z",
    read_at: null,
    related_patient_id: 509,
    related_patient_name: "Elizabeth Taylor"
  },
  {
    message_id: 5500,
    sender_id: 340,
    sender_name: "Angela Reyes",
    sender_role: "Caregiver",
    recipient_id: 510,
    recipient_name: "Anderson Family",
    channel: "text",
    content: "Richard had a restless night. We're monitoring closely. Will schedule a doctor check-in for this afternoon.",
    sent_at: "2026-02-01T04:15:00Z",
    read_at: "2026-02-01T04:20:00Z",
    related_patient_id: 510,
    related_patient_name: "Richard Anderson"
  },
  {
    message_id: 5497,
    sender_id: 344,
    sender_name: "Sarah Williams",
    sender_role: "Admin",
    recipient_id: 0,
    recipient_name: "All Caregivers",
    channel: "in_app",
    content: "New protocol update: Please review updated fall prevention guidelines in the staff portal.",
    sent_at: "2026-02-01T03:30:00Z",
    read_at: null,
    related_patient_id: null,
    related_patient_name: null
  },
  {
    message_id: 5494,
    sender_id: 342,
    sender_name: "Emily Brown",
    sender_role: "Caregiver",
    recipient_id: 512,
    recipient_name: "White Family",
    channel: "text",
    content: "Joseph is resting comfortably. His cognitive exercises went well this morning.",
    sent_at: "2026-02-01T03:00:00Z",
    read_at: "2026-02-01T03:15:00Z",
    related_patient_id: 512,
    related_patient_name: "Joseph White"
  },
  {
    message_id: 5491,
    sender_id: 1,
    sender_name: "System",
    sender_role: "Automated",
    recipient_id: 341,
    recipient_name: "John Davis",
    channel: "push",
    content: "Alert: Nancy Harris reports discomfort. Please check on patient in Room 308.",
    sent_at: "2026-02-01T02:45:00Z",
    read_at: "2026-02-01T02:46:00Z",
    related_patient_id: 513,
    related_patient_name: "Nancy Harris"
  },
  {
    message_id: 5488,
    sender_id: 343,
    sender_name: "Michael Lee",
    sender_role: "Caregiver",
    recipient_id: 514,
    recipient_name: "Martin Family",
    channel: "email",
    content: "Thomas is making progress with speech therapy. Weekly report attached with detailed notes.",
    sent_at: "2026-02-01T02:30:00Z",
    read_at: null,
    related_patient_id: 514,
    related_patient_name: "Thomas Martin"
  },
];

const calls: Call[] = [
  {
    call_id: 1125,
    caller_id: 340,
    caller_name: "Angela Reyes",
    recipient_id: 501,
    recipient_name: "Johnson Family",
    call_type: "video",
    status: "completed",
    duration_seconds: 485,
    started_at: "2026-02-01T06:00:00Z",
    ended_at: "2026-02-01T06:08:05Z",
    related_patient_id: 501,
    related_patient_name: "Margaret Johnson"
  },
  {
    call_id: 1122,
    caller_id: 503,
    caller_name: "Davis Family",
    recipient_id: 342,
    recipient_name: "Emily Brown",
    call_type: "voice",
    status: "missed",
    duration_seconds: null,
    started_at: "2026-02-01T05:45:00Z",
    ended_at: null,
    related_patient_id: 503,
    related_patient_name: "Helen Davis"
  },
  {
    call_id: 1120,
    caller_id: 341,
    caller_name: "John Davis",
    recipient_id: 502,
    recipient_name: "Smith Family",
    call_type: "video",
    status: "completed",
    duration_seconds: 312,
    started_at: "2026-02-01T04:30:00Z",
    ended_at: "2026-02-01T04:35:12Z",
    related_patient_id: 502,
    related_patient_name: "Robert Smith"
  },
  {
    call_id: 1118,
    caller_id: 505,
    caller_name: "Brown Family",
    recipient_id: 340,
    recipient_name: "Angela Reyes",
    call_type: "voice",
    status: "completed",
    duration_seconds: 180,
    started_at: "2026-02-01T03:00:00Z",
    ended_at: "2026-02-01T03:03:00Z",
    related_patient_id: 505,
    related_patient_name: "Patricia Brown"
  },
  // Additional calls
  {
    call_id: 1115,
    caller_id: 342,
    caller_name: "Emily Brown",
    recipient_id: 507,
    recipient_name: "Miller Family",
    call_type: "video",
    status: "completed",
    duration_seconds: 420,
    started_at: "2026-02-01T02:30:00Z",
    ended_at: "2026-02-01T02:37:00Z",
    related_patient_id: 507,
    related_patient_name: "Dorothy Miller"
  },
  {
    call_id: 1112,
    caller_id: 510,
    caller_name: "Anderson Family",
    recipient_id: 340,
    recipient_name: "Angela Reyes",
    call_type: "voice",
    status: "completed",
    duration_seconds: 245,
    started_at: "2026-02-01T02:00:00Z",
    ended_at: "2026-02-01T02:04:05Z",
    related_patient_id: 510,
    related_patient_name: "Richard Anderson"
  },
  {
    call_id: 1109,
    caller_id: 343,
    caller_name: "Michael Lee",
    recipient_id: 509,
    recipient_name: "Taylor Family",
    call_type: "video",
    status: "declined",
    duration_seconds: null,
    started_at: "2026-02-01T01:45:00Z",
    ended_at: null,
    related_patient_id: 509,
    related_patient_name: "Elizabeth Taylor"
  },
  {
    call_id: 1106,
    caller_id: 512,
    caller_name: "White Family",
    recipient_id: 342,
    recipient_name: "Emily Brown",
    call_type: "voice",
    status: "missed",
    duration_seconds: null,
    started_at: "2026-02-01T01:30:00Z",
    ended_at: null,
    related_patient_id: 512,
    related_patient_name: "Joseph White"
  },
  {
    call_id: 1103,
    caller_id: 341,
    caller_name: "John Davis",
    recipient_id: 513,
    recipient_name: "Harris Family",
    call_type: "video",
    status: "completed",
    duration_seconds: 380,
    started_at: "2026-02-01T01:00:00Z",
    ended_at: "2026-02-01T01:06:20Z",
    related_patient_id: 513,
    related_patient_name: "Nancy Harris"
  },
  {
    call_id: 1100,
    caller_id: 514,
    caller_name: "Martin Family",
    recipient_id: 343,
    recipient_name: "Michael Lee",
    call_type: "voice",
    status: "completed",
    duration_seconds: 156,
    started_at: "2026-02-01T00:30:00Z",
    ended_at: "2026-02-01T00:32:36Z",
    related_patient_id: 514,
    related_patient_name: "Thomas Martin"
  },
  {
    call_id: 1097,
    caller_id: 340,
    caller_name: "Angela Reyes",
    recipient_id: 511,
    recipient_name: "Jackson Family",
    call_type: "video",
    status: "completed",
    duration_seconds: 520,
    started_at: "2026-01-31T23:45:00Z",
    ended_at: "2026-01-31T23:53:40Z",
    related_patient_id: 511,
    related_patient_name: "Susan Jackson"
  },
  {
    call_id: 1094,
    caller_id: 515,
    caller_name: "Garcia Family",
    recipient_id: 344,
    recipient_name: "Sarah Williams",
    call_type: "voice",
    status: "missed",
    duration_seconds: null,
    started_at: "2026-01-31T23:15:00Z",
    ended_at: null,
    related_patient_id: 515,
    related_patient_name: "Betty Garcia"
  },
];

const formatTimeAgo = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  // Use ISO format for consistency between server and client
  return date.toISOString().split("T")[0];
};

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const channelConfig: Record<Message["channel"], { label: string; color: string }> = {
  text: { label: "SMS", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  email: { label: "Email", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  push: { label: "Push", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  in_app: { label: "In-App", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
};

const MESSAGES_PER_PAGE = 5;
const CALLS_PER_PAGE = 5;

type CommFilterType = "all" | "unread" | "completed-calls" | "missed-calls";

export function CommunicationsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [messagePage, setMessagePage] = useState(1);
  const [callPage, setCallPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<CommFilterType>("all");

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.recipient_name.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFilter === "unread") {
      return m.read_at === null;
    }
    return true;
  });

  const filteredCalls = calls.filter(c => {
    const matchesSearch = c.caller_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.recipient_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.related_patient_name && c.related_patient_name.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    switch (activeFilter) {
      case "completed-calls":
        return c.status === "completed";
      case "missed-calls":
        return c.status === "missed";
      default:
        return true;
    }
  });

  // Pagination for messages
  const totalMessagePages = Math.ceil(filteredMessages.length / MESSAGES_PER_PAGE);
  const paginatedMessages = filteredMessages.slice(
    (messagePage - 1) * MESSAGES_PER_PAGE,
    messagePage * MESSAGES_PER_PAGE
  );

  // Pagination for calls
  const totalCallPages = Math.ceil(filteredCalls.length / CALLS_PER_PAGE);
  const paginatedCalls = filteredCalls.slice(
    (callPage - 1) * CALLS_PER_PAGE,
    callPage * CALLS_PER_PAGE
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setMessagePage(1);
    setCallPage(1);
  };

  const handleFilterChange = (filter: CommFilterType) => {
    setActiveFilter(filter);
    setMessagePage(1);
    setCallPage(1);
  };

  const unreadMessages = messages.filter(m => m.read_at === null);
  const completedCalls = calls.filter(c => c.status === "completed");
  const missedCalls = calls.filter(c => c.status === "missed");
  const totalCallMinutes = completedCalls.reduce((sum, c) => sum + (c.duration_seconds || 0), 0) / 60;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Fixed Header Section */}
      <div className="flex-shrink-0 space-y-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Communications</h1>
            <p className="text-muted-foreground">Manage messages and calls with families and staff</p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Message
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "all" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("all")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{messages.length}</div>
                <div className="text-xs text-muted-foreground">Total Messages</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "unread" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("unread")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <MessageSquare className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{unreadMessages.length}</div>
                <div className="text-xs text-muted-foreground">Unread</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "completed-calls" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("completed-calls")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Phone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{completedCalls.length}</div>
                <div className="text-xs text-muted-foreground">Calls Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${activeFilter === "missed-calls" ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"}`}
          onClick={() => handleFilterChange("missed-calls")}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Phone className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{missedCalls.length}</div>
                <div className="text-xs text-muted-foreground">Missed Calls</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search messages and calls..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Side by Side Cards - No outer scroll */}
      <div className="flex-1 min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
          {/* Messages Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Recent Messages ({filteredMessages.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                {paginatedMessages.map((message) => {
                  const channelInfo = channelConfig[message.channel];
                  return (
                    <div key={message.message_id} className="p-3 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{message.sender_name}</div>
                            <div className="text-xs text-muted-foreground">To: {message.recipient_name}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={channelInfo.color} variant="secondary">
                            {channelInfo.label}
                          </Badge>
                          {message.read_at ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Badge variant="destructive" className="text-xs">Unread</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{message.content}</p>
                      <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                        {message.related_patient_name && (
                          <span>Re: {message.related_patient_name}</span>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(message.sent_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="pt-3 border-t mt-3">
                <PaginationControlled
                  currentPage={messagePage}
                  totalPages={totalMessagePages}
                  onPageChange={setMessagePage}
                  totalItems={filteredMessages.length}
                  itemsPerPage={MESSAGES_PER_PAGE}
                />
              </div>
            </CardContent>
          </Card>

          {/* Calls Card */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Recent Calls ({filteredCalls.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto max-h-[400px] space-y-3 pr-1">
                {paginatedCalls.map((call) => (
                  <div key={call.call_id} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${call.status === "completed" ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
                          {call.status === "completed" ? (
                            <PhoneOutgoing className={`h-4 w-4 ${call.status === "completed" ? "text-green-600" : "text-red-600"}`} />
                          ) : (
                            <PhoneIncoming className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{call.caller_name}</div>
                          <div className="text-xs text-muted-foreground">To: {call.recipient_name}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="gap-1">
                          {call.call_type === "video" ? <Video className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
                          {call.call_type}
                        </Badge>
                        <Badge
                          variant={call.status === "completed" ? "default" : call.status === "missed" ? "destructive" : "secondary"}
                        >
                          {call.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        {call.duration_seconds && (
                          <span>Duration: {formatDuration(call.duration_seconds)}</span>
                        )}
                        {call.related_patient_name && (
                          <span>Re: {call.related_patient_name}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTimeAgo(call.started_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t mt-3">
                <PaginationControlled
                  currentPage={callPage}
                  totalPages={totalCallPages}
                  onPageChange={setCallPage}
                  totalItems={filteredCalls.length}
                  itemsPerPage={CALLS_PER_PAGE}
                />
                <div className="text-center text-sm text-muted-foreground pt-2">
                  Total call time today: {totalCallMinutes.toFixed(0)} minutes
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
