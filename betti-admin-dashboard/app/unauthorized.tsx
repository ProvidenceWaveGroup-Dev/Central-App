import Link from "next/link";
import Image from "next/image";
import { LockKeyhole, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
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
            <div className="p-6 rounded-full bg-amber-100 dark:bg-amber-900/30">
              <LockKeyhole className="h-14 w-14 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <p className="text-8xl font-black text-muted-foreground/30 leading-none select-none">
            401
          </p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Session Expired</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Your session has expired or you are not currently signed in. Please
            sign in with your Betti credentials to continue.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="gap-2">
            <Link href="/login">
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </div>

        {/* Support note */}
        <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 p-4 text-left space-y-1">
          <p className="text-xs font-medium text-amber-800 dark:text-amber-300">
            Having trouble signing in?
          </p>
          <p className="text-xs text-amber-700 dark:text-amber-400">
            Contact your facility administrator or reach Betti support at{" "}
            <span className="font-medium">support@betti.com</span>
          </p>
        </div>

        <p className="text-xs text-muted-foreground/60">
          Betti Admin Dashboard &mdash; Error 401
        </p>
      </div>
    </div>
  );
}
