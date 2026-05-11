"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/language-context";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface Props {
  username: string;
  onDone: () => void;
}

export function InstallPrompt({ username, onDone }: Props) {
  const { t } = useLanguage();
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !(window as { MSStream?: unknown }).MSStream);

    type GlobalWithPrompt = typeof window & { __deferredInstallPrompt?: BeforeInstallPromptEvent };
    const existing = (window as GlobalWithPrompt).__deferredInstallPrompt;
    if (existing) setDeferred(existing);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function handleInstall() {
    if (!deferred) return;
    setInstalling(true);
    try {
      await deferred.prompt();
      await deferred.userChoice;
    } finally {
      setInstalling(false);
      type GlobalWithPrompt = typeof window & { __deferredInstallPrompt?: BeforeInstallPromptEvent };
      (window as GlobalWithPrompt).__deferredInstallPrompt = undefined;
      onDone();
    }
  }

  const canPromptNatively = !!deferred && !isIOS;
  const title = t("inst_title").replace("{name}", username);

  return (
    <div
      className="flex flex-col h-full px-6 pt-5 pb-4"
      style={{ background: "linear-gradient(160deg,#090B19 0%,#0F1228 60%,#0A0F1E 100%)" }}
    >
      <div className="flex items-center gap-2 justify-center">
        <Image src="/atlas-favicon.png" alt="Atlas" width={28} height={28} priority />
        <span
          style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}
          className="text-[24px] font-bold tracking-tight"
        >
          Atlas
        </span>
      </div>

      <div className="flex-1" />

      <div className="text-center mb-7">
        <div className="text-[64px] leading-none mb-4">📱</div>
        <h2
          style={{ fontFamily: "var(--font-display)", color: "#FFFFFF" }}
          className="text-[28px] font-extrabold leading-tight mb-2"
        >
          {title}
        </h2>
        <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.7)" }}>
          {t("inst_sub")}
        </p>
      </div>

      <div className="flex flex-col gap-2.5 mb-6">
        <Benefit emoji="🔔" text={t("inst_b1")} />
        <Benefit emoji="⚡" text={t("inst_b2")} />
        <Benefit emoji="📡" text={t("inst_b3")} />
      </div>

      <div className="flex-1" />

      {canPromptNatively && (
        <button
          onClick={handleInstall}
          disabled={installing}
          className="w-full py-4 rounded-2xl text-white text-[20px] font-bold tracking-wide transition-opacity"
          style={{
            background: "#F97316",
            fontFamily: "var(--font-display)",
            opacity: installing ? 0.6 : 1,
          }}
        >
          {installing ? "..." : t("inst_install")}
        </button>
      )}

      {isIOS && (
        <div
          className="rounded-2xl px-4 py-4 mb-1"
          style={{
            background: "rgba(249,115,22,0.10)",
            border: "1.5px solid rgba(249,115,22,0.30)",
          }}
        >
          <p
            className="text-[13px] leading-relaxed flex items-center flex-wrap gap-1"
            style={{ color: "rgba(255,255,255,0.85)" }}
          >
            {t("inst_ios_1")}
            <ShareIcon />
            {t("inst_ios_2")}
          </p>
        </div>
      )}

      <button
        onClick={onDone}
        className="w-full py-3 text-[14px] mt-3"
        style={{ color: "rgba(255,255,255,0.45)", fontFamily: "var(--font-sans)" }}
      >
        {t("inst_skip")}
      </button>
    </div>
  );
}

function Benefit({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-2xl"
      style={{ background: "rgba(255,255,255,0.04)" }}
    >
      <span className="text-[22px] leading-none">{emoji}</span>
      <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.88)" }}>
        {text}
      </span>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#F97316"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline align-middle"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}
