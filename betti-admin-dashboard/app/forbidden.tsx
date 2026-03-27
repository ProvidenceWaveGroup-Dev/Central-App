import Link from "next/link";
import Image from "next/image";
import { ShieldOff, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Forbidden() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/betti-logo.png"
            alt="Betti"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Icon + Code */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="p-6 rounded-full bg-red-100 dark:bg-red-900/30">
              <ShieldOff className="h-14 w-14 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <p className="text-8xl font-black text-muted-foreground/30 leading-none select-none">
            403
          </p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Access Denied</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            You don&apos;t have permission to view this page. This area is
            restricted to authorized roles only.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href="javascript:history.back()">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild className="gap-2">
            <Link href="/admin-dashboard">
              <LayoutDashboard className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Info box */}
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-4 text-left space-y-1">
          <p className="text-xs font-medium text-red-800 dark:text-red-300">
            Need access to this area?
          </p>
          <p className="text-xs text-red-700 dark:text-red-400">
            Contact your facility administrator to request the appropriate role
            or permissions for your account.
          </p>
        </div>

        <p className="text-xs text-muted-foreground/60">
          Betti Admin Dashboard &mdash; Error 403
        </p>
      </div>
    </div>
  );
}
