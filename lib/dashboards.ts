export type DashboardConfig = {
  key: "senior" | "caregiver" | "ems" | "security" | "fire";
  title: string;
  description: string;
  path: string;
  envVar: string;
  defaultUrl: string;
};

export const dashboardConfigs: DashboardConfig[] = [
  {
    key: "senior",
    title: "Betti Senior",
    description: "Betti-Senior-Dashboard web app for wellness monitoring.",
    path: "/dashboards/senior",
    envVar: "NEXT_PUBLIC_BETTI_SENIOR_URL",
    defaultUrl: "http://localhost:3001",
  },
  {
    key: "caregiver",
    title: "Betti Caregiver",
    description: "Betti-Caregiver-dashboard web app for care coordination.",
    path: "/dashboards/caregiver",
    envVar: "NEXT_PUBLIC_BETTI_CAREGIVER_URL",
    defaultUrl: "http://localhost:3002",
  },
  {
    key: "ems",
    title: "Betti Emergency Service",
    description: "Betti-EMS-dashboard web app for emergency response.",
    path: "/dashboards/ems",
    envVar: "NEXT_PUBLIC_BETTI_EMS_URL",
    defaultUrl: "http://localhost:3003",
  },
  {
    key: "security",
    title: "Betti Security",
    description: "Betti-Security-Dashboard web app for security monitoring.",
    path: "/dashboards/security",
    envVar: "NEXT_PUBLIC_BETTI_SECURITY_URL",
    defaultUrl: "http://localhost:3004",
  },
  {
    key: "fire",
    title: "Betti Fire Service",
    description: "Betti-Fire Service-dashboard web app for fire response.",
    path: "/dashboards/fire",
    envVar: "NEXT_PUBLIC_BETTI_FIRE_URL",
    defaultUrl: "http://localhost:3005",
  },
];

export const resolveDashboardUrl = (dashboard: DashboardConfig) => {
  const rawValue = process.env[dashboard.envVar];
  const normalizedValue = typeof rawValue === "string" ? rawValue.trim() : "";
  const value =
    normalizedValue.length > 0 ? normalizedValue : dashboard.defaultUrl;
  return normalizeUrl(value);
};

const normalizeUrl = (value: string) => {
  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `http://${value}`;
};

