export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[3000]"
      style={{
        background: "rgba(9, 16, 32, 0.35)",
        backdropFilter: "blur(3px)",
        WebkitBackdropFilter: "blur(3px)",
      }}
    >
      <div className="w-[120px] h-[120px] flex items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/betti-logo.png"
          alt=""
          width={90}
          height={90}
          style={{ width: 90, height: "auto", animation: "betti-loader-pulse 1.2s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}
