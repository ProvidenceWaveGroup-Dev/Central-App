import Link from "next/link";
import Image from "next/image";

export default function Unauthorized() {
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
            401
          </p>
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-amber-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">Session Expired</h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Your session has expired or you are not currently signed in. Please
            sign in with your Betti credentials to continue.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors"
            style={{ backgroundColor: "#233e7d" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1a2e5e")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#233e7d")}
          >
            Sign In at Central Hub
          </Link>
          <a
            href="https://betti.providencewavegroup.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border text-sm font-medium transition-colors"
            style={{ borderColor: "#233e7d", color: "#233e7d" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#f0f4ff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            Visit Betti Website
          </a>
        </div>

        <p className="text-xs text-slate-400">
          Betti Central Hub &mdash; Error 401
        </p>
      </div>
    </div>
  );
}
