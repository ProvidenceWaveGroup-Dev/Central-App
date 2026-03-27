import Link from "next/link";
import Image from "next/image";

export default function Forbidden() {
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
            403
          </p>
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-red-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Access Denied</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            You don&apos;t have permission to access this area. This section is
            restricted to authorized roles only.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#233e7d] hover:bg-[#1a2e5e] text-white text-sm font-medium transition-colors"
          >
            Back to Central Hub
          </Link>
          <a
            href="https://betti.providencewavegroup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#233e7d] text-[#233e7d] hover:bg-[#f0f4ff] text-sm font-medium transition-colors"
          >
            Visit Betti Website
          </a>
        </div>

        <p className="text-xs text-slate-400">
          Betti Central Hub &mdash; Error 403
        </p>
      </div>
    </div>
  );
}
