"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// TODO: re-enable auth when backend is available
// Authentication bypassed for frontend preview — redirect directly to dashboard
// Original login form with full auth flow is commented out below

// import { useState } from "react";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Checkbox } from "@/components/ui/checkbox";
// import Image from "next/image";
// import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

// export default function LoginPage() {
//   const router = useRouter();
//   // const apiUrl = process.env.NEXT_PUBLIC_BETTI_API_URL || "http://localhost:8000";
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);
//     // try {
//     //   const response = await fetch(`${apiUrl}/api/auth/login`, {
//     //     method: "POST",
//     //     headers: { "Content-Type": "application/json" },
//     //     body: JSON.stringify({ identifier: email, password }),
//     //   });
//     //   const payload = await response.json().catch(() => ({}));
//     //   if (!response.ok) {
//     //     setError(payload?.detail || "Invalid email or password. Please try again.");
//     //     return;
//     //   }
//     //   if (payload?.role !== "admin") {
//     //     setError("This account does not have admin access.");
//     //     return;
//     //   }
//     //   if (typeof window !== "undefined") {
//     //     localStorage.setItem("betti_token", payload.access_token || "");
//     //     localStorage.setItem("betti_user_id", String(payload.user_id || ""));
//     //     localStorage.setItem("betti_user_role", payload.role || "");
//     //     localStorage.setItem("betti_user_email", payload.email || email);
//     //     localStorage.setItem("betti_user_first_name", payload.first_name || "");
//     //     localStorage.setItem("betti_user_last_name", payload.last_name || "");
//     //     sessionStorage.setItem("betti_admin_authenticated", "true");
//     //     sessionStorage.setItem("betti_admin_email", email);
//     //   }
//     //   router.push("/admin-dashboard");
//     // } catch {
//     //   setError("Unable to reach API. Check backend connectivity and try again.");
//     // } finally {
//     //   setIsLoading(false);
//     // }
//   };

//   return ( ... login form JSX ... );
// }

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin-dashboard");
  }, [router]);

  return null;
}
