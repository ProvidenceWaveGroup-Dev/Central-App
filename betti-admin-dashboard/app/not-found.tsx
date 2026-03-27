import Link from "next/link";
import Image from "next/image";
import { FileSearch, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
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
            <div className="p-6 rounded-full bg-muted">
              <FileSearch className="h-14 w-14 text-muted-foreground" />
            </div>
          </div>
          <p className="text-8xl font-black text-muted-foreground/30 leading-none select-none">
            404
          </p>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved. Check the URL or navigate back to the dashboard.
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

        {/* Footer note */}
        <p className="text-xs text-muted-foreground/60">
          Betti Admin Dashboard &mdash; Error 404
        </p>
      </div>
    </div>
  );
}
