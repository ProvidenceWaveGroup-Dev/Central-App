"use client";

import type React from "react";

import { useState } from "react";
import {
  AlertCircle,
  Bell,
  Volume2,
  Eye,
  Shield,
  Save,
  RotateCcw,
  Phone,
  CreditCard,
  BarChart3,
  Code2,
  FileText,
  Zap,
  X,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    medicationReminders: true,
    hydrationReminders: true,
    appointmentReminders: true,
    restroomReminders: false,
    showerReminders: true,
    silentHoursEnabled: true,
    silentStart: "22:00",
    silentEnd: "07:00",
    voiceType: "female",
    speechSpeed: 1.0,
    voiceVolume: 75,
    confirmationSounds: true,
    largeText: false,
    highContrast: false,
    buttonSize: "normal",
    screenReader: false,
    shareWithFamily: true,
    shareWithDoctor: true,
    dataRetention: "1year",
    locationTracking: true,
  });

  const [openModal, setOpenModal] = useState<string | null>(null);
  const [modalData, setModalData] = useState<{ title: string; content: React.ReactNode }>({ title: "", content: null });

  const handleSave = () => {
    console.log("Settings saved:", settings);
  };

  const handleReset = () => {
    setSettings({
      medicationReminders: true,
      hydrationReminders: true,
      appointmentReminders: true,
      restroomReminders: false,
      showerReminders: true,
      silentHoursEnabled: true,
      silentStart: "22:00",
      silentEnd: "07:00",
      voiceType: "female",
      speechSpeed: 1.0,
      voiceVolume: 75,
      confirmationSounds: true,
      largeText: false,
      highContrast: false,
      buttonSize: "normal",
      screenReader: false,
      shareWithFamily: true,
      shareWithDoctor: true,
      dataRetention: "1year",
      locationTracking: true,
    });
  };

  const handleUpdatePayer = () => {
    setModalData({
      title: "Update Payer Information",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Primary Insurance Provider</label>
            <input type="text" defaultValue="Blue Cross Blue Shield" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233E7D]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Member ID</label>
            <input type="text" defaultValue="XXX-XX-1234" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233E7D]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Secondary Insurance</label>
            <input type="text" placeholder="None on file" className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233E7D]" />
          </div>
        </div>
      ),
    });
    setOpenModal("updatePayer");
  };

  const handleExportCSV = () => {
    setModalData({
      title: "Export Billing Data as CSV",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Select Date Range</label>
            <div className="flex gap-2">
              <input type="date" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233E7D]" />
              <input type="date" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233E7D]" />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-sm text-gray-600">CSV file will be downloaded to your computer</p>
          </div>
        </div>
      ),
    });
    setOpenModal("exportCSV");
  };

  const handleExportFHIR = () => {
    setModalData({
      title: "Export Billing Data as FHIR",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Select Date Range</label>
            <div className="flex gap-2">
              <input type="date" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233E7D]" />
              <input type="date" className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#233E7D]" />
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <p className="text-sm text-gray-600">FHIR format file will be downloaded to your computer</p>
          </div>
        </div>
      ),
    });
    setOpenModal("exportFHIR");
  };

  const handleSupportChat = () => {
    setModalData({
      title: "Start Support Chat",
      content: (
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-sm font-medium text-green-700 mb-2">Support Team Available</div>
            <p className="text-sm text-green-600">Our support team is currently online and ready to assist you.</p>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Contact Options:</div>
            <div className="text-sm text-gray-600">Phone: 1-800-BETTI-01</div>
            <div className="text-sm text-gray-600">Email: support@betti.com</div>
            <div className="text-sm text-gray-600">Live Chat will open in a new window</div>
          </div>
        </div>
      ),
    });
    setOpenModal("supportChat");
  };

  const handleViewMappingTable = () => {
    setModalData({
      title: "CPT Code Claims Mapping",
      content: (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-gray-600 font-medium">CPT Code</th>
                  <th className="px-3 py-2 text-left text-gray-600 font-medium">Description</th>
                  <th className="px-3 py-2 text-left text-gray-600 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-3 py-2">99457</td>
                  <td className="px-3 py-2">Remote Monitoring 16-30 min</td>
                  <td className="px-3 py-2"><span className="text-green-600 font-medium">Mapped</span></td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">99458</td>
                  <td className="px-3 py-2">Remote Monitoring 31+ min</td>
                  <td className="px-3 py-2"><span className="text-green-600 font-medium">Mapped</span></td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">99490</td>
                  <td className="px-3 py-2">Chronic Care Management</td>
                  <td className="px-3 py-2"><span className="text-red-600 font-medium">Unmapped</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ),
    });
    setOpenModal("mappingTable");
  };

  const handleOpenExportCenter = () => {
    setModalData({
      title: "RPM Billing Export Center",
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-[#5C7F39]">5</div>
              <div className="text-sm text-gray-600">Exports This Month</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-orange-500">Jan 20</div>
              <div className="text-sm text-gray-600">Next Export</div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Available Formats:</div>
            <button className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">CSV Export</button>
            <button className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">X12 EDI Format</button>
            <button className="w-full px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200">FHIR Format</button>
          </div>
        </div>
      ),
    });
    setOpenModal("exportCenter");
  };

  const handleConfigureRules = () => {
    setModalData({
      title: "Configure Prior Authorization Rules",
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            {[
              { name: "Rule 1: High Medication Cost", desc: "Triggers when cost exceeds $500" },
              { name: "Rule 2: Multiple Specialists", desc: "Triggers when more than 3 specialists billed" },
              { name: "Rule 3: Repetitive Testing", desc: "Triggers on duplicate tests within 30 days" },
            ].map((rule, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-gray-700">{rule.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{rule.desc}</div>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#5C7F39]" />
              </div>
            ))}
          </div>
        </div>
      ),
    });
    setOpenModal("configureRules");
  };

  const handleReviewLogs = () => {
    setModalData({
      title: "ADR Response Automation Logs",
      content: (
        <div className="space-y-4">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {[
              { time: "Jan 14, 10:30 AM", status: "Sent", message: "ADR response sent for claim #12345" },
              { time: "Jan 13, 2:15 PM", status: "Sent", message: "ADR response sent for claim #12344" },
              { time: "Jan 12, 9:45 AM", status: "Pending", message: "Awaiting payer response for claim #12343" },
              { time: "Jan 11, 4:20 PM", status: "Sent", message: "ADR response sent for claim #12342" },
            ].map((log, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-1">
                  <div className="text-xs font-medium text-gray-600">{log.time}</div>
                  <span className={`text-xs font-medium ${log.status === "Sent" ? "text-green-600" : "text-amber-600"}`}>
                    {log.status}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{log.message}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    });
    setOpenModal("reviewLogs");
  };

  const ToggleSwitch = ({
    checked,
    onChange,
    id,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    id: string;
  }) => (
    <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-[#5C7F39] peer-focus:ring-2 peer-focus:ring-[#5C7F39]/30 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
    </label>
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">App Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Customize your preferences</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a6a2e] transition-colors"
            >
              <Save className="h-4 w-4" />
              Save Settings
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Default
            </button>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notification Preferences */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Notification Preferences</h2>
            </div>
            <div className="space-y-4">
              {[
                { id: "medication-reminders", key: "medicationReminders", label: "Medication Reminders" },
                { id: "hydration-reminders", key: "hydrationReminders", label: "Hydration Reminders" },
                { id: "appointment-reminders", key: "appointmentReminders", label: "Appointment Reminders" },
                { id: "restroom-reminders", key: "restroomReminders", label: "Restroom Reminders" },
                { id: "shower-reminders", key: "showerReminders", label: "Shower Reminders" },
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <label htmlFor={setting.id} className="text-sm text-gray-700">{setting.label}</label>
                  <ToggleSwitch
                    id={setting.id}
                    checked={settings[setting.key as keyof typeof settings] as boolean}
                    onChange={(checked) => setSettings({ ...settings, [setting.key]: checked })}
                  />
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="silent-hours" className="text-sm text-gray-700">Silent Hours</label>
                  <ToggleSwitch
                    id="silent-hours"
                    checked={settings.silentHoursEnabled}
                    onChange={(checked) => setSettings({ ...settings, silentHoursEnabled: checked })}
                  />
                </div>
                {settings.silentHoursEnabled && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">Start Time</label>
                      <select
                        value={settings.silentStart}
                        onChange={(e) => setSettings({ ...settings, silentStart: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] bg-white"
                      >
                        {["20:00", "21:00", "22:00", "23:00"].map((time) => (
                          <option key={time} value={time}>
                            {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 block mb-1">End Time</label>
                      <select
                        value={settings.silentEnd}
                        onChange={(e) => setSettings({ ...settings, silentEnd: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] bg-white"
                      >
                        {["06:00", "07:00", "08:00", "09:00"].map((time) => (
                          <option key={time} value={time}>
                            {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Voice & Interaction */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <Volume2 className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Voice & Interaction</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm text-gray-700 block mb-1">Voice Type</label>
                <select
                  value={settings.voiceType}
                  onChange={(e) => setSettings({ ...settings, voiceType: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] bg-white"
                >
                  <option value="female">Female Voice</option>
                  <option value="male">Male Voice</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-700 block mb-1">Speech Speed: {settings.speechSpeed}x</label>
                <input
                  type="range"
                  min={0.5}
                  max={2.0}
                  step={0.1}
                  value={settings.speechSpeed}
                  onChange={(e) => setSettings({ ...settings, speechSpeed: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5C7F39]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 block mb-1">Voice Volume: {settings.voiceVolume}%</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={settings.voiceVolume}
                  onChange={(e) => setSettings({ ...settings, voiceVolume: parseInt(e.target.value) })}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#5C7F39]"
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="confirmation-sounds" className="text-sm text-gray-700">Confirmation Sounds</label>
                <ToggleSwitch
                  id="confirmation-sounds"
                  checked={settings.confirmationSounds}
                  onChange={(checked) => setSettings({ ...settings, confirmationSounds: checked })}
                />
              </div>
            </div>
          </div>

          {/* Accessibility Features */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Accessibility Features</h2>
            </div>
            <div className="space-y-4">
              {[
                { id: "large-text", key: "largeText", label: "Large Text" },
                { id: "high-contrast", key: "highContrast", label: "High Contrast Mode" },
                { id: "screen-reader", key: "screenReader", label: "Screen Reader Support" },
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <label htmlFor={setting.id} className="text-sm text-gray-700">{setting.label}</label>
                  <ToggleSwitch
                    id={setting.id}
                    checked={settings[setting.key as keyof typeof settings] as boolean}
                    onChange={(checked) => setSettings({ ...settings, [setting.key]: checked })}
                  />
                </div>
              ))}
              <div>
                <label className="text-sm text-gray-700 block mb-1">Button Size</label>
                <select
                  value={settings.buttonSize}
                  onChange={(e) => setSettings({ ...settings, buttonSize: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] bg-white"
                >
                  <option value="small">Small</option>
                  <option value="normal">Normal</option>
                  <option value="large">Large</option>
                  <option value="extra-large">Extra Large</option>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy & Sharing */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Privacy & Sharing</h2>
            </div>
            <div className="space-y-4">
              {[
                { id: "share-family", key: "shareWithFamily", label: "Share Data with Family" },
                { id: "share-doctor", key: "shareWithDoctor", label: "Share Data with Doctor" },
                { id: "location-tracking", key: "locationTracking", label: "Location Tracking" },
              ].map((setting) => (
                <div key={setting.id} className="flex items-center justify-between">
                  <label htmlFor={setting.id} className="text-sm text-gray-700">{setting.label}</label>
                  <ToggleSwitch
                    id={setting.id}
                    checked={settings[setting.key as keyof typeof settings] as boolean}
                    onChange={(checked) => setSettings({ ...settings, [setting.key]: checked })}
                  />
                </div>
              ))}
              <div>
                <label className="text-sm text-gray-700 block mb-1">Data Retention Period</label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => setSettings({ ...settings, dataRetention: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] bg-white"
                >
                  <option value="3months">3 Months</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                  <option value="2years">2 Years</option>
                  <option value="indefinite">Indefinite</option>
                </select>
              </div>
            </div>
          </div>

          {/* Payer Information */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Payer Information</h2>
            </div>
            <div className="space-y-4">
              {[
                { title: "Insurance / Payer Information", lines: ["Primary: Blue Cross Blue Shield", "Member ID: XXX-XX-1234"] },
                { title: "Secondary Insurance", lines: ["None on file"] },
                { title: "Prior Authorisation Automation", lines: ["Status: Approved", "Next Review: Jan 15, 2025"] },
              ].map((item, idx) => (
                <div key={idx} className="border-l-4 border-[#5C7F39] pl-4 py-2">
                  <div className="font-medium text-gray-700">{item.title}</div>
                  {item.lines.map((line, i) => (
                    <div key={i} className="text-sm text-gray-500 mt-0.5">{line}</div>
                  ))}
                </div>
              ))}
              <button onClick={handleUpdatePayer} className="w-full rounded-lg bg-[#233E7D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors">
                Update Payer Information
              </button>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Billing Summary & Reports</h2>
            </div>
            <div className="space-y-4">
              {[
                { title: "RPM Billing Summary", lines: ["Current Month: $250.00", "Year-to-Date: $2,500.00"] },
                { title: "Monthly Billing Reports", lines: ["Remote Patient Monitoring (RPM): $200", "Chronic Care Management (CCM): $50", "Principal Care Management (PCM): $0"] },
                { title: "Last Billed", lines: ["November 1, 2024"] },
              ].map((item, idx) => (
                <div key={idx} className="border-l-4 border-[#5C7F39] pl-4 py-2">
                  <div className="font-medium text-gray-700">{item.title}</div>
                  {item.lines.map((line, i) => (
                    <div key={i} className="text-sm text-gray-500 mt-0.5">{line}</div>
                  ))}
                </div>
              ))}
              <div className="flex gap-2">
                <button onClick={handleExportCSV} className="flex-1 rounded-lg bg-[#5C7F39] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#4a6a2e] transition-colors">
                  Export CSV
                </button>
                <button onClick={handleExportFHIR} className="flex-1 rounded-lg bg-[#233E7D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors">
                  Export FHIR
                </button>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Contact Support</h2>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <div className="font-medium text-gray-700">24/7 Support Team</div>
                </div>
                <div className="text-sm text-gray-600 space-y-0.5">
                  <div>Phone: 1-800-BETTI-01</div>
                  <div>Email: support@betti.com</div>
                  <div>Live Chat Available</div>
                </div>
              </div>
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <div className="font-medium text-red-700">Emergency Services</div>
                </div>
                <div className="text-sm text-red-600">Call 911 for immediate assistance</div>
              </div>
              <button onClick={handleSupportChat} className="w-full rounded-lg bg-[#233E7D] px-4 py-3 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors inline-flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                Start Support Chat
              </button>
            </div>
          </div>

          {/* CPT Code Claims */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <Code2 className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">CPT Code Claims Mapping</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">42</div>
                  <div className="text-xs text-gray-600">Mapped</div>
                </div>
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-xs text-gray-600">Unmapped</div>
                </div>
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-center">
                  <div className="text-sm font-medium text-gray-700">Jan 14</div>
                  <div className="text-xs text-gray-600">Last Update</div>
                </div>
              </div>
              <button onClick={handleViewMappingTable} className="w-full rounded-lg bg-[#233E7D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors">
                View Mapping Table
              </button>
            </div>
          </div>

          {/* RPM Billing Export */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">RPM Billing Export</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-gray-50 border border-gray-200 p-3 text-center">
                  <div className="text-sm font-medium text-gray-700">Jan 20</div>
                  <div className="text-xs text-gray-600">Next Export</div>
                </div>
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                  <div className="text-2xl font-bold text-[#5C7F39]">5</div>
                  <div className="text-xs text-gray-600">This Month</div>
                </div>
              </div>
              <div className="border-l-4 border-[#5C7F39] pl-4 py-2">
                <div className="font-medium text-gray-700">Export Formats</div>
                <div className="text-sm text-gray-500 mt-0.5">CSV / X12 / FHIR</div>
              </div>
              <button onClick={handleOpenExportCenter} className="w-full rounded-lg bg-[#233E7D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors">
                Open Export Center
              </button>
            </div>
          </div>

          {/* Prior Authorization Triggers */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Prior Authorization Triggers</h2>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                  <div className="text-2xl font-bold text-[#5C7F39]">4</div>
                  <div className="text-xs text-gray-600">Active Rules</div>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                  <div className="text-2xl font-bold text-orange-500">12</div>
                  <div className="text-xs text-gray-600">This Week</div>
                </div>
                <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">3</div>
                  <div className="text-xs text-gray-600">Flagged</div>
                </div>
              </div>
              <button onClick={handleConfigureRules} className="w-full rounded-lg bg-[#233E7D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors">
                Configure Rules
              </button>
            </div>
          </div>

          {/* ADR Response Automation */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">ADR Response Automation</h2>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-[#5C7F39] pl-4 py-2">
                <div className="font-medium text-gray-700">Status</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <div className="text-sm text-gray-600">Enabled</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center">
                  <div className="text-2xl font-bold text-[#5C7F39]">18</div>
                  <div className="text-xs text-gray-600">Responses Sent</div>
                </div>
                <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
                  <div className="text-2xl font-bold text-orange-500">2</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
              </div>
              <button onClick={handleReviewLogs} className="w-full rounded-lg bg-[#233E7D] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors">
                Review Automation Logs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h3 className="font-serif text-lg font-semibold text-gray-900">{modalData.title}</h3>
              <button onClick={() => setOpenModal(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="px-6 py-5">
              {modalData.content}
              <div className="mt-6 flex gap-2 justify-end">
                <button
                  onClick={() => setOpenModal(null)}
                  className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a6a2e] transition-colors">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="text-center text-sm text-gray-400 pt-4">
        Changes are saved automatically when you click &quot;Save Settings&quot;
      </div>
    </div>
  );
}
