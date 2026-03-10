import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <div className="heartbeat flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-sm">
        <Image
          src="/betti-logo.png"
          alt="Betti logo"
          width={64}
          height={64}
          priority
        />
      </div>
      <p className="text-sm font-medium text-muted-foreground">Loading...</p>
    </div>
  );
}
