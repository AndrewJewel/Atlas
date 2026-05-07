"use client";
import { useState } from "react";
import { AVATARS } from "@/lib/data";
import type { User } from "@/lib/types";

interface Props {
  onComplete: (user: User) => void;
}

export function Onboarding({ onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);

  const handleUsernameNext = () => {
    if (username.trim().length < 3) {
      setUsernameError("Mínimo 3 caracteres");
      return;
    }
    setUsernameError("");
    setStep(2);
  };

  const handleFinish = () => {
    if (selectedAvatar === null) return;
    onComplete({ username: username.trim(), avatar: AVATARS[selectedAvatar] });
  };

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "linear-gradient(160deg,#090B19 0%,#0F1228 60%,#0A0F1E 100%)" }}
    >
      {/* Step 0 — Welcome */}
      {step === 0 && (
        <div className="flex flex-col flex-1 items-center px-6 pt-5 pb-4">
          <Logo />
          <div className="flex-1" />
          <span className="text-[56px] leading-none mb-4">🏆</span>
          <div className="text-center mb-3">
            <div style={{ fontFamily: "var(--font-display)" }} className="text-[38px] font-black text-atlas-text leading-tight">
              El Mundial en
            </div>
            <div style={{ fontFamily: "var(--font-display)" }} className="text-[38px] font-black text-atlas-primary leading-tight">
              tu grupo.
            </div>
          </div>
          <p className="text-[13px] text-atlas-muted text-center mb-6">
            Chat · Polla · Álbum Panini · Atlas IA
          </p>
          <div className="flex-1" />
          <button
            onClick={() => setStep(1)}
            className="w-full py-4 rounded-2xl text-white text-[20px] font-bold tracking-wide transition-opacity"
            style={{ background: "#F97316", fontFamily: "var(--font-display)" }}
          >
            Empezar →
          </button>
          <p className="text-[12px] text-atlas-dimmed mt-3 text-center">
            Sin email · Sin contraseña · 30 segundos
          </p>
        </div>
      )}

      {/* Step 1 — Username */}
      {step === 1 && (
        <div className="flex flex-col flex-1 px-6 pt-5">
          <Logo />
          <div className="h-8" />
          <StepBadge label="1 / 2" />
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[30px] font-extrabold text-atlas-text text-center mb-1.5">
            ¿Cómo te llaman?
          </h2>
          <p className="text-[14px] text-atlas-muted text-center mb-6">
            Tu nombre en el grupo. Puede ser tu apodo.
          </p>
          <input
            autoFocus
            maxLength={20}
            placeholder="ej. ElCapitan, Rodri99…"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setUsernameError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleUsernameNext()}
            className="w-full px-4 py-3.5 rounded-2xl text-atlas-text text-[16px] outline-none transition-colors"
            style={{
              background: "#181B30",
              border: `1.5px solid ${usernameError ? "#EF4444" : "rgba(255,255,255,0.1)"}`,
              fontFamily: "var(--font-sans)",
            }}
          />
          {usernameError && (
            <p className="text-[12px] text-atlas-danger mt-1">{usernameError}</p>
          )}
          <div className="h-4" />
          <button
            onClick={handleUsernameNext}
            style={{ background: "#F97316", fontFamily: "var(--font-display)", opacity: username.trim().length >= 3 ? 1 : 0.4 }}
            className="w-full py-4 rounded-2xl text-white text-[20px] font-bold tracking-wide transition-opacity"
          >
            Continuar
          </button>
        </div>
      )}

      {/* Step 2 — Avatar */}
      {step === 2 && (
        <div className="flex flex-col flex-1 px-6 pt-5">
          <Logo />
          <div className="h-8" />
          <StepBadge label="2 / 2" />
          <h2 style={{ fontFamily: "var(--font-display)" }} className="text-[30px] font-extrabold text-atlas-text text-center mb-1.5">
            Elige tu avatar
          </h2>
          <p className="text-[14px] text-atlas-muted text-center mb-5">
            Así te verán tus rivales en la polla 😈
          </p>
          <div className="grid grid-cols-5 gap-2.5 w-full">
            {AVATARS.map((av, i) => (
              <button
                key={i}
                onClick={() => setSelectedAvatar(i)}
                className="aspect-square rounded-2xl flex items-center justify-center text-[22px] transition-all"
                style={{
                  background: av.bg,
                  outline: selectedAvatar === i ? "3px solid #F97316" : "3px solid transparent",
                  outlineOffset: "2px",
                  transform: selectedAvatar === i ? "scale(1.1)" : "scale(1)",
                }}
              >
                {av.emoji}
              </button>
            ))}
          </div>
          <div className="h-5" />
          <button
            onClick={handleFinish}
            style={{ background: "#F97316", fontFamily: "var(--font-display)", opacity: selectedAvatar !== null ? 1 : 0.4 }}
            className="w-full py-4 rounded-2xl text-white text-[20px] font-bold tracking-wide transition-opacity"
          >
            Entrar al Mundial 🚀
          </button>
        </div>
      )}

      {/* Step dots */}
      <div className="flex justify-center gap-1.5 py-5 flex-shrink-0">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: step === i ? 20 : 7,
              height: 7,
              background: step === i ? "#F97316" : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2 justify-center">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="12" stroke="#F97316" strokeWidth="2.5" />
        <circle cx="14" cy="14" r="4.5" fill="#F97316" />
      </svg>
      <span style={{ fontFamily: "var(--font-display)" }} className="text-[24px] font-bold text-atlas-text tracking-tight">
        Atlas
      </span>
    </div>
  );
}

function StepBadge({ label }: { label: string }) {
  return (
    <div className="self-center mb-4 px-3.5 py-1 rounded-full text-[12px] font-bold tracking-widest text-atlas-primary"
      style={{ background: "rgba(249,115,22,0.15)" }}>
      {label}
    </div>
  );
}
