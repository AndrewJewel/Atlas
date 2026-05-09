"use client";
export const dynamic = "force-dynamic";
import Link from "next/link";
import { useUser } from "@/hooks/use-user";
import { AppHeader } from "@/components/app-header";

const MENU_ITEMS = [
  { icon: "🏆", label: "Campeones históricos", sub: "Todos los ganadores del Mundial", href: "/mas/campeones" },
  { icon: "📒", label: "Álbum Panini",          sub: "287 / 640 láminas completadas",  href: "/mas/panini" },
  { icon: "🌍", label: "Idioma",                sub: "Español",                         href: null },
  { icon: "🌙", label: "Modo oscuro",           sub: "Activo",                          href: null },
];

export default function MasPage() {
  const { user } = useUser();

  return (
    <div className="flex flex-col flex-1">
      <AppHeader title="Más" />
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-4">
        {/* Profile Card */}
        <div
          className="flex items-center gap-4 p-4 rounded-[18px] mb-5"
          style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div
            className="w-16 h-16 rounded-[18px] flex items-center justify-center flex-shrink-0"
            style={{ background: user?.avatar.bg ?? "#F97316" }}
          >
            <span className="text-[36px]">{user?.avatar.emoji ?? "⭐"}</span>
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)" }} className="text-[24px] font-bold text-atlas-text tracking-tight">
              {user?.username ?? "..."}
            </div>
            <div className="text-[13px] font-semibold text-atlas-primary">⚡ Aficionado · 0 puntos</div>
          </div>
        </div>

        {/* Menu Items */}
        {MENU_ITEMS.map((item, i) => {
          const Inner = (
            <div
              key={i}
              className="flex items-center gap-3.5 p-4 rounded-2xl mb-2 w-full text-left"
              style={{ background: "#0F1228", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span className="text-[22px] flex-shrink-0">{item.icon}</span>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-atlas-text">{item.label}</div>
                <div className="text-[12px] text-atlas-dimmed mt-0.5">{item.sub}</div>
              </div>
              {item.href && <span className="text-[22px] text-atlas-dimmed">›</span>}
            </div>
          );
          return item.href ? (
            <Link key={i} href={item.href}>{Inner}</Link>
          ) : (
            <button key={i} className="w-full cursor-default">{Inner}</button>
          );
        })}
      </div>
    </div>
  );
}
