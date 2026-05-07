export function AtlasLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="#F97316" strokeWidth="2" />
        <path d="M7 14 L14 7 L21 14 L14 21 Z" fill="#F97316" fillOpacity="0.25" />
        <circle cx="14" cy="14" r="4.5" fill="#F97316" />
      </svg>
      <span
        style={{ fontFamily: "var(--font-display)" }}
        className="text-[22px] font-bold text-atlas-text tracking-tight leading-none"
      >
        Atlas<span className="text-atlas-primary">.</span>
      </span>
    </div>
  );
}
