"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const TABS = [
    { href: "/partidos",  icon: "⚽", label: t("nav_partidos")  },
    { href: "/grupos",    icon: "🏆", label: t("nav_grupos")    },
    { href: "/predictor", icon: "🎯", label: t("nav_predictor") },
    { href: "/mas",       icon: "⋯",  label: t("nav_mas")       },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex"
      style={{
        background: "var(--atlas-surface)",
        borderTop: "1px solid var(--atlas-border-md)",
        paddingBottom: "env(safe-area-inset-bottom, 12px)",
      }}
    >
      {TABS.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex-1 flex flex-col items-center gap-1 py-2 transition-all"
          >
            <div
              className="w-1 h-1 rounded-full mb-0.5"
              style={{ background: active ? "#F97316" : "transparent" }}
            />
            <span className="text-[22px] leading-none">{tab.icon}</span>
            <span
              className="text-[10px] font-semibold tracking-wide"
              style={{ color: active ? "#F97316" : "#4A5178" }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
