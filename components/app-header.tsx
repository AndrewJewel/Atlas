import { AtlasLogo } from "./atlas-logo";

export function AppHeader({ title }: { title?: string }) {
  return (
    <header
      className="flex items-center justify-between px-4 pb-3 flex-shrink-0 z-10"
      style={{
        background: "#0F1228",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {title ? (
        <span
          style={{ fontFamily: "var(--font-display)" }}
          className="text-[20px] font-bold text-atlas-text tracking-tight"
        >
          {title}
        </span>
      ) : (
        <AtlasLogo />
      )}
    </header>
  );
}
