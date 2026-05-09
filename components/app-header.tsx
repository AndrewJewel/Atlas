import Image from "next/image";

export function AppHeader({ title }: { title?: string }) {
  return (
    <header
      className="flex items-center gap-2.5 px-4 pt-3 pb-3 flex-shrink-0 z-10"
      style={{
        background: "var(--atlas-surface)",
        borderBottom: "1px solid var(--atlas-border)",
      }}
    >
      <Image
        src="/atlas-favicon.png"
        alt="Atlas"
        width={26}
        height={26}
        priority
      />
      {title ? (
        <span
          style={{ fontFamily: "var(--font-display)" }}
          className="text-[20px] font-bold text-atlas-text tracking-tight"
        >
          {title}
        </span>
      ) : (
        <span
          style={{ fontFamily: "var(--font-display)" }}
          className="text-[22px] font-bold text-atlas-text tracking-tight leading-none"
        >
          Atlas<span className="text-atlas-primary">.</span>
        </span>
      )}
    </header>
  );
}
