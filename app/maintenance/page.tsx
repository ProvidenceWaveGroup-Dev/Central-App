import Image from "next/image";

export const metadata = {
  title: "System Maintenance | Betti",
  description: "The Betti system is currently undergoing scheduled maintenance.",
};

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/betti-logo.png"
            alt="Betti"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Icon + code */}
        <div className="space-y-2">
          <p className="text-8xl font-black text-slate-200 leading-none select-none">
            503
          </p>
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-blue-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            System Temporarily Unavailable
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            The Betti monitoring system is currently undergoing scheduled
            maintenance. We&apos;ll be back online shortly.
          </p>
        </div>

        {/* Animated status */}
        <div className="flex items-center justify-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500" />
          </span>
          <span className="text-sm text-slate-500">Maintenance in progress</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://betti.providencewavegroup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#233e7d] hover:bg-[#1a2e5e] text-white text-sm font-medium transition-colors"
          >
            Visit Betti Website
          </a>
        </div>

        <p className="text-xs text-slate-400">
          Betti Central Hub &mdash; Error 503
        </p>
      </div>
    </div>
  );
}
