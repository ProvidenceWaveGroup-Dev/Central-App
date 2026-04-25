"use client";

import { useState } from "react";
import {
  User,
  Phone,
  MapPin,
  Users,
  Heart,
  Edit,
  Save,
  X,
} from "lucide-react";
import { DisclaimerBar } from "@/components/disclaimer-bar";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Margaret Johnson",
    dateOfBirth: "1945-03-15",
    phone: "(555) 123-4567",
    email: "margaret.johnson@email.com",
    address: "123 Oak Street, Springfield, IL 62701",
    emergencyContact1: "Sarah Johnson (Daughter) - (555) 987-6543",
    emergencyContact2: "Michael Johnson (Son) - (555) 456-7890",
    emergencyContact3: "Dr. Smith (Primary Care) - (555) 234-5678",
    medicalConditions: "Hypertension, Type 2 Diabetes",
    allergies: "Penicillin, Shellfish",
    medications: "Metformin 500mg twice daily, Lisinopril 10mg once daily",
    notes: "Prefers morning appointments. Uses walker for mobility assistance.",
  });

  const handleSave = () => {
    setIsEditing(false);
    console.log("Profile saved:", profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-900">
              Profile Information
            </h1>
            <p className="text-sm text-gray-500 mt-1">Manage your personal details</p>
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#5C7F39] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a6a2e] transition-colors"
                >
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#233E7D] px-4 py-2 text-sm font-medium text-white hover:bg-[#1c3266] transition-colors"
              >
                <Edit className="h-4 w-4" />
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Profile Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <User className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-gray-600 block mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent"
                  />
                ) : (
                  <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">{profileData.name}</div>
                )}
              </div>
              <div>
                <label htmlFor="dob" className="text-sm font-medium text-gray-600 block mb-1">Date of Birth</label>
                {isEditing ? (
                  <input
                    id="dob"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent"
                  />
                ) : (
                  <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                    {new Date(profileData.dateOfBirth).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Contact Details</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="text-sm font-medium text-gray-600 block mb-1">Phone Number</label>
                {isEditing ? (
                  <input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent"
                  />
                ) : (
                  <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">{profileData.phone}</div>
                )}
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-600 block mb-1">Email Address</label>
                {isEditing ? (
                  <input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent"
                  />
                ) : (
                  <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">{profileData.email}</div>
                )}
              </div>
            </div>
          </div>

          {/* Address - Full Width */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Address</h2>
            </div>
            <div>
              <label htmlFor="address" className="text-sm font-medium text-gray-600 block mb-1">Home Address</label>
              {isEditing ? (
                <textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent resize-none"
                  rows={2}
                />
              ) : (
                <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">{profileData.address}</div>
              )}
            </div>
          </div>

          {/* Emergency Contacts - Full Width */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Users className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Emergency Contacts</h2>
            </div>
            <div className="space-y-4">
              {[
                { id: "emergency1", key: "emergencyContact1", label: "Primary Emergency Contact" },
                { id: "emergency2", key: "emergencyContact2", label: "Secondary Emergency Contact" },
                { id: "emergency3", key: "emergencyContact3", label: "Medical Emergency Contact" },
              ].map((contact) => (
                <div key={contact.id}>
                  <label htmlFor={contact.id} className="text-sm font-medium text-gray-600 block mb-1">
                    {contact.label}
                  </label>
                  {isEditing ? (
                    <input
                      id={contact.id}
                      value={profileData[contact.key as keyof typeof profileData]}
                      onChange={(e) => setProfileData({ ...profileData, [contact.key]: e.target.value })}
                      className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent"
                    />
                  ) : (
                    <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                      {profileData[contact.key as keyof typeof profileData]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Health Information - Full Width */}
          <div className="rounded-xl border border-gray-200 bg-white p-5 lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Heart className="h-5 w-5 text-[#233E7D]" />
              <h2 className="font-serif text-lg font-semibold text-gray-900">Support Profile</h2>
            </div>
            <div className="space-y-4">
              {[
                { id: "conditions", key: "medicalConditions", label: "Noted Conditions", type: "textarea" },
                { id: "allergies", key: "allergies", label: "Allergies", type: "input" },
                { id: "medications", key: "medications", label: "Current Medications", type: "textarea" },
                { id: "notes", key: "notes", label: "Additional Notes", type: "textarea" },
              ].map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="text-sm font-medium text-gray-600 block mb-1">
                    {field.label}
                  </label>
                  {isEditing ? (
                    field.type === "textarea" ? (
                      <textarea
                        id={field.id}
                        value={profileData[field.key as keyof typeof profileData]}
                        onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent resize-none"
                        rows={2}
                      />
                    ) : (
                      <input
                        id={field.id}
                        value={profileData[field.key as keyof typeof profileData]}
                        onChange={(e) => setProfileData({ ...profileData, [field.key]: e.target.value })}
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#233E7D] focus:border-transparent"
                      />
                    )
                  ) : (
                    <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
                      {profileData[field.key as keyof typeof profileData]}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-400 pt-2">
          Keep your profile information up to date for emergency situations
        </div>
      </div>
      <DisclaimerBar />
    </div>
  );
}
