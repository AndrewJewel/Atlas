import Image from "next/image";

export function AtlasLogo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <Image
        src="/atlas-favicon.png"
        alt="Atlas"
        width={size}
        height={size}
        priority
      />
      <span
        style={{ fontFamily: "var(--font-display)" }}
        className="text-[22px] font-bold text-atlas-text tracking-tight leading-none"
      >
        Atlas<span className="text-atlas-primary">.</span>
      </span>
    </div>
  );
}
