import Image from "next/image";
import { Construction, Phone } from "lucide-react";

export const metadata = {
  title: "System Maintenance | Betti",
  description: "The Betti system is currently undergoing scheduled maintenance.",
};

export default function MaintenancePage() {
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
            <div className="p-6 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Construction className="h-14 w-14 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <p className="text-8xl font-black text-muted-foreground/30 leading-none select-none">
            503
          </p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">
            System Temporarily Unavailable
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The Betti monitoring system is currently undergoing scheduled
            maintenance. We&apos;ll be back online shortly. We apologize for
            any inconvenience.
          </p>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
          </span>
          <span className="text-sm text-muted-foreground">
            Maintenance in progress
          </span>
        </div>

        {/* Emergency contacts — critical for healthcare */}
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10 p-5 text-left space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              Emergency Contacts
            </p>
          </div>
          <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
            If you require immediate access to patient monitoring data during
            this outage, please contact your facility&apos;s on-call coordinator
            or use your facility&apos;s backup procedures.
          </p>
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs">
              <span className="text-red-700 dark:text-red-400 font-medium">
                Betti Emergency Support
              </span>
              <span className="font-mono font-semibold text-red-800 dark:text-red-300">
                1-800-BETTI-911
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-red-700 dark:text-red-400 font-medium">
                Technical Support
              </span>
              <span className="font-mono font-semibold text-red-800 dark:text-red-300">
                support@betti.com
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/60">
          Betti Admin Dashboard &mdash; Error 503
        </p>
      </div>
    </div>
  );
}
