"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type RoleOption = "senior" | "caregiver" | "security" | "fire_service" | "ems" | "facility_operator";
type LocationChoice = "facility" | "home" | "multi";

const stepLabels = [
  "Account",
  "Location",
  "Role Details",
  "Access",
  "Verification",
];

const roleLabels: Record<RoleOption, string> = {
  senior: "Senior",
  caregiver: "Caregiver",
  security: "Security",
  fire_service: "Fire Service",
  ems: "EMS",
  facility_operator: "Facility Operator",
};

export default function SignUpForm() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<RoleOption>("senior");
  const [locationChoice, setLocationChoice] =
    useState<LocationChoice>("facility");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    facilityName: "",
    facilityAddress: "",
    homeAddress: "",
    roomUnit: "",
    coveredFacilities: "",
    facilitySearch: "",
    dob: "",
    gender: "",
    primaryLanguage: "",
    preferredHospital: "",
    emergencyNotes: "",
    caregiverType: "",
    patientLink: "",
    primaryCaregiver: false,
    securityFacility: "",
    shiftType: "",
    badgeId: "",
    departmentName: "",
    emsLicenseNumber: "",
    emsLicenseState: "",
    emsYears: "",
    operatorFacility: "",
    operatorRole: "",
    operatorContact: "",
    accessAcknowledge: false,
    verifyEmail: false,
    verifySms: false,
    adminApproval: false,
  });

  const addressSuggestions = [
    "123 Wellness Ave, Tampa, FL",
    "456 Care Blvd, Dallas, TX",
    "789 Harbor Way, Miami, FL",
    "900 Sunset Dr, Los Angeles, CA",
    "210 Maple St, Chicago, IL",
  ];

  const passwordRules = [
    {
      label: "7-16 characters",
      test: (value: string) => value.length >= 7 && value.length <= 16,
    },
    {
      label: "One uppercase letter",
      test: (value: string) => /[A-Z]/.test(value),
    },
    {
      label: "One lowercase letter",
      test: (value: string) => /[a-z]/.test(value),
    },
    {
      label: "One number",
      test: (value: string) => /\d/.test(value),
    },
    {
      label: "One special character",
      test: (value: string) => /[^A-Za-z0-9]/.test(value),
    },
  ];

  const updateField = (
    key: keyof typeof formData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const filterNumbersOnly = (value: string) => value.replace(/\D/g, "");
  const filterTextOnly = (value: string) =>
    value.replace(/[^a-zA-Z\s'-]/g, "");

  const stepProgress = useMemo(
    () => `${((activeStep + 1) / stepLabels.length) * 100}%`,
    [activeStep],
  );

  const isStepValid = useMemo(() => {
    if (activeStep === 0) {
      const passwordValid = passwordRules.every((rule) =>
        rule.test(formData.password),
      );
      return (
        formData.firstName.trim() &&
        formData.lastName.trim() &&
        formData.email.trim() &&
        formData.password.trim() &&
        formData.confirmPassword.trim() &&
        formData.password === formData.confirmPassword &&
        passwordValid
      );
    }

    if (activeStep === 1) {
      if (locationChoice === "facility") {
        return formData.facilityName.trim() && formData.facilityAddress.trim();
      }
      if (locationChoice === "home") {
        return formData.homeAddress.trim();
      }
      return formData.coveredFacilities.trim();
    }

    if (activeStep === 2) {
      if (!selectedRole) {
        return false;
      }
      if (selectedRole === "senior") {
        return (
          formData.dob.trim() &&
          formData.gender.trim() &&
          formData.primaryLanguage.trim() &&
          formData.preferredHospital.trim() &&
          formData.emergencyNotes.trim()
        );
      }
      if (selectedRole === "caregiver") {
        return formData.caregiverType.trim() && formData.patientLink.trim();
      }
      if (selectedRole === "security") {
        return formData.securityFacility.trim();
      }
      if (selectedRole === "fire_service") {
        return formData.departmentName.trim() && formData.coveredFacilities.trim();
      }
      if (selectedRole === "facility_operator") {
        return formData.operatorFacility.trim() && formData.operatorRole.trim();
      }
      return (
        formData.emsLicenseNumber.trim() &&
        formData.emsLicenseState.trim() &&
        formData.emsYears.trim()
      );
    }

    if (activeStep === 3) {
      return formData.accessAcknowledge;
    }

    if (activeStep === 4) {
      const requiresAdmin =
        selectedRole === "security" ||
        selectedRole === "fire_service" ||
        selectedRole === "ems" ||
        selectedRole === "facility_operator";
      if (!formData.verifyEmail) {
        return false;
      }
      if (requiresAdmin && !formData.adminApproval) {
        return false;
      }
      return true;
    }

    return false;
  }, [activeStep, formData, locationChoice, selectedRole]);

  const goToPrevious = () =>
    setActiveStep((step) => Math.max(0, step - 1));
  const goToNext = () =>
    setActiveStep((step) => Math.min(stepLabels.length - 1, step + 1));

  const handleFinish = () => {
    if (!isStepValid) {
      return;
    }
    setShowOtp(true);
  };

  const otpRecipient = formData.verifySms ? formData.phone : formData.email;
  const otpLabel = formData.verifySms ? "phone number" : "email address";

  return (
    <div className="rounded-3xl bg-white p-8 shadow-lg sm:p-10">
      <div className="text-center">
        <div className="mb-4 flex items-center justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white">
            <Image
              src="/betti-logo.png"
              alt="Betti logo"
              width={64}
              height={64}
              priority
            />
          </div>
        </div>
        <h1 className="font-serif text-2xl font-semibold text-[#233E7D]">
          Create Your Profile
        </h1>
      </div>

      <div className="mt-8">
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-[#59595B]">
          {stepLabels.map((label, index) => (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold ${
                  index <= activeStep
                    ? "border-[#5C7F39] bg-[#5C7F39] text-white"
                    : "border-[#DADADA] bg-white text-[#59595B]"
                }`}
              >
                {index + 1}
              </div>
              <span className="mt-2 text-[11px]">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 h-1 w-full rounded-full bg-[#DADADA]">
          <div
            className="h-1 rounded-full bg-[#5C7F39] transition-all"
            style={{ width: stepProgress }}
          />
        </div>
      </div>

      <div className="mt-8 border-t border-[#DADADA] pt-6">
        <h2 className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-[#233E7D]">
          {stepLabels[activeStep]}
        </h2>
        <p className="mt-2 text-sm text-[#59595B]">
          {activeStep === 0 &&
            "Create the global identity for this Betti account."}
          {activeStep === 1 &&
            "Where will you be using Betti? Select the appropriate location."}
          {activeStep === 2 &&
            "Tell us more about your role and responsibilities."}
          {activeStep === 3 &&
            "Confirm the access and alert visibility assigned to you."}
          {activeStep === 4 &&
            "Complete verification to finish your Betti setup."}
        </p>
      </div>

      {activeStep === 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#59595B]">
              First Name *
            </label>
            <input
              className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
              placeholder="Casey"
              value={formData.firstName}
              onChange={(event) =>
                updateField("firstName", filterTextOnly(event.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#59595B]">
              Last Name *
            </label>
            <input
              className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
              placeholder="Cupcakes"
              value={formData.lastName}
              onChange={(event) =>
                updateField("lastName", filterTextOnly(event.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#59595B]">
              Email *
            </label>
            <input
              className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
              placeholder="casey@email.com"
              type="email"
              value={formData.email}
              onChange={(event) => updateField("email", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#59595B]">
              Phone (optional)
            </label>
            <input
              className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
              placeholder="(555) 555-5555"
              inputMode="numeric"
              value={formData.phone}
              onChange={(event) =>
                updateField("phone", filterNumbersOnly(event.target.value))
              }
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-[#59595B]">
              Password *
            </label>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 pr-12 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(event) => updateField("password", event.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#233E7D]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.7 10.7a2 2 0 102.6 2.6" />
                    <path d="M9.9 5.1A10.8 10.8 0 0112 5c5.5 0 9.7 4 11 7-0.5 1.3-1.7 3.3-3.7 5.1" />
                    <path d="M6.1 6.1C4.1 7.9 2.9 9.9 2 12c1.3 3 5.5 7 10 7 1 0 2-0.1 2.9-0.3" />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            <ul className="mt-2 space-y-1 text-xs text-[#59595B]">
              {passwordRules.map((rule) => {
                const satisfied = rule.test(formData.password);
                return (
                  <li
                    key={rule.label}
                    className={satisfied ? "line-through text-[#5C7F39]" : ""}
                  >
                    {rule.label}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-[#59595B]">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 pr-12 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                placeholder="••••••••"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#233E7D]"
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.7 10.7a2 2 0 102.6 2.6" />
                    <path d="M9.9 5.1A10.8 10.8 0 0112 5c5.5 0 9.7 4 11 7-0.5 1.3-1.7 3.3-3.7 5.1" />
                    <path d="M6.1 6.1C4.1 7.9 2.9 9.9 2 12c1.3 3 5.5 7 10 7 1 0 2-0.1 2.9-0.3" />
                  </svg>
                ) : (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {formData.confirmPassword &&
            formData.password !== formData.confirmPassword ? (
              <p className="text-xs text-[#233E7D]">
                Passwords do not match.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {activeStep === 1 ? (
        <div className="mt-8 space-y-6">
          <div className="space-y-3">
            <p className="font-serif text-sm font-semibold text-[#233E7D]">
              Where will you be using Betti?
            </p>
            <div className="flex flex-wrap gap-3">
              {[
                { value: "facility", label: "Facility" },
                { value: "home", label: "Private Home" },
                { value: "multi", label: "Multiple Facilities" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() =>
                    setLocationChoice(option.value as LocationChoice)
                  }
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    locationChoice === option.value
                      ? "border-[#5C7F39] bg-[#5C7F39] text-white"
                      : "border-[#DADADA] text-[#59595B] hover:text-[#233E7D]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {locationChoice === "facility" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Facility Name *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Betti Senior Living"
                  value={formData.facilityName}
                  onChange={(event) =>
                    updateField("facilityName", event.target.value)
                  }
                  list="facility-suggestions"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Facility Address *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="123 Wellness Ave"
                  value={formData.facilityAddress}
                  onChange={(event) =>
                    updateField("facilityAddress", event.target.value)
                  }
                  list="address-suggestions"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Optional Room / Unit
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Room 210B"
                  value={formData.roomUnit}
                  onChange={(event) => updateField("roomUnit", event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {locationChoice === "home" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Home Address *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="456 Home Lane"
                  value={formData.homeAddress}
                  onChange={(event) =>
                    updateField("homeAddress", event.target.value)
                  }
                  list="address-suggestions"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Optional Room / Unit
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Bedroom 2"
                  value={formData.roomUnit}
                  onChange={(event) => updateField("roomUnit", event.target.value)}
                />
              </div>
            </div>
          ) : null}

          {locationChoice === "multi" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Covered Facilities *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Add facility names or IDs"
                  value={formData.coveredFacilities}
                  onChange={(event) =>
                    updateField("coveredFacilities", event.target.value)
                  }
                  list="facility-suggestions"
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {activeStep === 2 ? (
        <div className="mt-8 space-y-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold text-[#59595B]">
              Role *
            </label>
            <select
              className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
              value={selectedRole}
              onChange={(event) =>
                setSelectedRole(event.target.value as RoleOption)
              }
            >
              {Object.entries(roleLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {selectedRole === "senior" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Date of Birth *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  type="date"
                  value={formData.dob}
                  onChange={(event) => updateField("dob", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Gender *
                </label>
                <select
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  value={formData.gender}
                  onChange={(event) => updateField("gender", event.target.value)}
                >
                  <option value="">Select</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Primary Language *
                </label>
                <select
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  value={formData.primaryLanguage}
                  onChange={(event) =>
                    updateField("primaryLanguage", event.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="English">English</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Preferred Hospital *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="St. Mary's"
                  value={formData.preferredHospital}
                  onChange={(event) =>
                    updateField(
                      "preferredHospital",
                      filterTextOnly(event.target.value),
                    )
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Emergency Notes *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Allergies, care directives, notes"
                  value={formData.emergencyNotes}
                  onChange={(event) =>
                    updateField(
                      "emergencyNotes",
                      filterTextOnly(event.target.value),
                    )
                  }
                />
              </div>
            </div>
          ) : null}

          {selectedRole === "caregiver" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Caregiver Type *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Family / Professional"
                  value={formData.caregiverType}
                  onChange={(event) =>
                    updateField("caregiverType", filterTextOnly(event.target.value))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Link to Patient *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Patient code or search"
                  value={formData.patientLink}
                  onChange={(event) =>
                    updateField("patientLink", event.target.value)
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#59595B]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#DADADA] accent-[#5C7F39]"
                  checked={formData.primaryCaregiver}
                  onChange={(event) =>
                    updateField("primaryCaregiver", event.target.checked)
                  }
                />
                Primary Caregiver
              </label>
            </div>
          ) : null}

          {selectedRole === "security" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Facility Assignment *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Facility name or ID"
                  value={formData.securityFacility}
                  onChange={(event) =>
                    updateField("securityFacility", event.target.value)
                  }
                  list="facility-suggestions"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Shift Type (optional)
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Day / Night"
                  value={formData.shiftType}
                  onChange={(event) =>
                    updateField("shiftType", filterTextOnly(event.target.value))
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Badge ID (optional)
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Badge 2045"
                  value={formData.badgeId}
                  onChange={(event) =>
                    updateField("badgeId", filterNumbersOnly(event.target.value))
                  }
                  inputMode="numeric"
                />
              </div>
            </div>
          ) : null}

          {selectedRole === "fire_service" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Department Name *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Fire Department"
                  value={formData.departmentName}
                  onChange={(event) =>
                    updateField(
                      "departmentName",
                      filterTextOnly(event.target.value),
                    )
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Covered Facilities *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Facility names or IDs"
                  value={formData.coveredFacilities}
                  onChange={(event) =>
                    updateField("coveredFacilities", event.target.value)
                  }
                  list="facility-suggestions"
                />
              </div>
            </div>
          ) : null}

          {selectedRole === "facility_operator" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Facility Name *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="Betti Senior Living"
                  value={formData.operatorFacility}
                  onChange={(event) =>
                    updateField("operatorFacility", event.target.value)
                  }
                  list="facility-suggestions"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Operator Role *
                </label>
                <select
                  className="w-full rounded-lg border border-[#DADADA] px-3 py-2 text-sm text-[#59595B] bg-white focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  value={formData.operatorRole}
                  onChange={(event) =>
                    updateField("operatorRole", event.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="manager">Facility Manager</option>
                  <option value="director">Director of Operations</option>
                  <option value="admin">Administrator</option>
                  <option value="maintenance">Maintenance Lead</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Contact Number (optional)
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="(555) 555-5555"
                  inputMode="numeric"
                  value={formData.operatorContact}
                  onChange={(event) =>
                    updateField("operatorContact", filterNumbersOnly(event.target.value))
                  }
                />
              </div>
            </div>
          ) : null}

          {selectedRole === "ems" ? (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  License Number *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="EMS-5528"
                  value={formData.emsLicenseNumber}
                  onChange={(event) =>
                    updateField("emsLicenseNumber", event.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  License State *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="CA"
                  value={formData.emsLicenseState}
                  onChange={(event) =>
                    updateField(
                      "emsLicenseState",
                      filterTextOnly(event.target.value.toUpperCase()),
                    )
                  }
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  Years of Experience *
                </label>
                <input
                  className="w-full rounded-lg border border-[#DADADA] bg-white px-3 py-2 text-sm text-[#59595B] focus:border-[#5C7F39] focus:outline-none focus:ring-2 focus:ring-[#5C7F39]/30"
                  placeholder="5"
                  value={formData.emsYears}
                  onChange={(event) =>
                    updateField("emsYears", filterNumbersOnly(event.target.value))
                  }
                  inputMode="numeric"
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {activeStep === 3 ? (
        <div className="mt-8 space-y-6">
          <div className="rounded-2xl border border-[#DADADA] bg-[#DADADA]/40 p-4">
            <p className="font-serif text-sm font-semibold text-[#233E7D]">
              Assigned Role
            </p>
            <p className="text-sm text-[#59595B]">{roleLabels[selectedRole]}</p>
          </div>
          <div className="rounded-2xl border border-[#DADADA] bg-[#DADADA]/40 p-4">
            <p className="font-serif text-sm font-semibold text-[#233E7D]">
              Facilities / Patients
            </p>
            <p className="text-sm text-[#59595B]">
              {locationChoice === "home"
                ? "Private home access"
                : formData.facilityName || formData.coveredFacilities || "Pending"}
            </p>
          </div>
          <div className="rounded-2xl border border-[#DADADA] bg-[#DADADA]/40 p-4">
            <p className="font-serif text-sm font-semibold text-[#233E7D]">
              Alert Visibility Level
            </p>
            <p className="text-sm text-[#59595B]">Summary + Critical alerts</p>
          </div>
          <div className="rounded-2xl border border-[#DADADA] bg-[#DADADA]/40 p-4">
            <p className="font-serif text-sm font-semibold text-[#233E7D]">
              Emergency Access Rules
            </p>
            <p className="text-sm text-[#59595B]">
              Access granted during verified incidents only.
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold text-[#59595B]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[#DADADA] accent-[#5C7F39]"
              checked={formData.accessAcknowledge}
              onChange={(event) =>
                updateField("accessAcknowledge", event.target.checked)
              }
            />
            I acknowledge and accept access responsibilities.
          </label>
        </div>
      ) : null}

      {activeStep === 4 ? (
        <div className="mt-8 space-y-4">
          {showOtp ? (
            <div className="rounded-2xl border border-[#DADADA] bg-[#DADADA]/40 p-4">
              <p className="font-serif text-sm font-semibold text-[#233E7D]">
                Setup complete
              </p>
              <p className="mt-1 text-sm text-[#59595B]">
                Please input the OTP sent to your {otpLabel} ({otpRecipient}).
              </p>
              <div className="mt-4 space-y-2">
                <label className="text-xs font-semibold text-[#59595B]">
                  One-Time Passcode
                </label>
                <input
                  className="w-full rounded-lg border border-[#5C7F39] px-3 py-2 text-sm text-[#59595B]"
                  placeholder="Enter OTP"
                  value={otpValue}
                  onChange={(event) =>
                    setOtpValue(filterNumbersOnly(event.target.value))
                  }
                  inputMode="numeric"
                />
              </div>
            </div>
          ) : null}
          <div className="rounded-2xl border border-[#DADADA] bg-[#DADADA]/40 p-4">
            <p className="font-serif text-sm font-semibold text-[#233E7D]">
              Verification Methods
            </p>
            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#59595B]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#DADADA] accent-[#5C7F39]"
                  checked={formData.verifyEmail}
                  onChange={(event) =>
                    updateField("verifyEmail", event.target.checked)
                  }
                />
                Email verification completed
              </label>
              <label className="flex items-center gap-2 text-xs font-semibold text-[#59595B]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#DADADA] accent-[#5C7F39]"
                  checked={formData.verifySms}
                  onChange={(event) =>
                    updateField("verifySms", event.target.checked)
                  }
                />
                SMS OTP verified (optional)
              </label>
              {(selectedRole === "security" ||
                selectedRole === "fire_service" ||
                selectedRole === "ems" ||
                selectedRole === "facility_operator") && (
                <label className="flex items-center gap-2 text-xs font-semibold text-[#59595B]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-[#DADADA] accent-[#5C7F39]"
                    checked={formData.adminApproval}
                    onChange={(event) =>
                      updateField("adminApproval", event.target.checked)
                    }
                  />
                  Admin approval received
                </label>
              )}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
        <button
          type="button"
          onClick={goToPrevious}
          className="text-sm font-semibold text-[#5C7F39] transition hover:text-[#4f6b32]"
          disabled={activeStep === 0}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={
            activeStep === stepLabels.length - 1 ? handleFinish : goToNext
          }
          className={`inline-flex items-center gap-2 rounded-lg px-6 py-2 text-sm font-semibold text-white shadow-sm transition ${
            isStepValid
              ? "bg-[#5C7F39] hover:bg-[#4f6b32]"
              : "cursor-not-allowed bg-[#DADADA] text-[#59595B]"
          }`}
          disabled={!isStepValid}
        >
          {activeStep === stepLabels.length - 1 ? "Finish Setup" : "Next"}
        </button>
      </div>

      <datalist id="address-suggestions">
        {addressSuggestions.map((address) => (
          <option key={address} value={address} />
        ))}
      </datalist>
      <datalist id="facility-suggestions">
        <option value="Betti Senior Living" />
        <option value="Betti Assisted Care" />
        <option value="Betti Private Home" />
      </datalist>
    </div>
  );
}
