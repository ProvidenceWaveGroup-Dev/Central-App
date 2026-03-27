import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
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

        {/* Icon placeholder + code */}
        <div className="space-y-2">
          <p className="text-8xl font-black text-slate-200 leading-none select-none">
            404
          </p>
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
              />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have
            been moved. Check the URL or return to the Betti Central Hub.
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
          Betti Central Hub &mdash; Error 404
        </p>
      </div>
    </div>
  );
}
