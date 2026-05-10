"use client";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Status = "idle" | "thinking" | "speaking" | "success" | "error";

interface ColorPalette {
  base: string;
  mid: string;
  glow: string;
  rim: string;
  light: string;
}

const COLORS: Record<string, ColorPalette> = {
  midnightBlue: { base: "#000B1E", mid: "#003080", glow: "#0055cc", rim: "#007AFF", light: "#4da6ff" },
  emerald:      { base: "#001a0f", mid: "#065f46", glow: "#059669", rim: "#34d399", light: "#6ee7b7" },
  coral:        { base: "#1a0505", mid: "#7f1d1d", glow: "#dc2626", rim: "#f87171", light: "#fca5a5" },
  idle:         { base: "#000B1E", mid: "#003080", glow: "#0055cc", rim: "#007AFF", light: "#4da6ff" },
};

const STATE_CONFIG = {
  idle: {
    color: COLORS.idle,
    glowScale: 1, glowOpacity: 0.55,
    glowPulse: { duration: 3.5, ease: "easeInOut" },
    sphereScale: 1,
  },
  thinking: {
    color: COLORS.midnightBlue,
    glowScale: 1.15, glowOpacity: 0.9,
    glowPulse: { duration: 0.85, ease: "easeInOut" },
    sphereScale: 1,
  },
  speaking: {
    color: COLORS.idle,
    glowScale: 1.1, glowOpacity: 0.65,
    glowPulse: { duration: 1.8, ease: "easeInOut" },
    sphereScale: 1,
  },
  success: {
    color: COLORS.emerald,
    glowScale: 1.2, glowOpacity: 0.9,
    glowPulse: { duration: 0.5, ease: "easeOut" },
    sphereScale: 1.04,
  },
  error: {
    color: COLORS.coral,
    glowScale: 1.08, glowOpacity: 0.75,
    glowPulse: { duration: 1.2, ease: "easeInOut" },
    sphereScale: 1,
  },
};

function EyeCapsule({ x, y, height = 1, opacity = 1 }: {
  x: number; y: number; height?: number; opacity?: number;
}) {
  const w = 11;
  const h = 28 * height;
  const r = w / 2;
  return (
    <motion.rect
      x={x - w / 2} y={y - h / 2}
      width={w} height={h}
      rx={r} ry={r}
      fill="white"
      opacity={opacity}
      style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9)) drop-shadow(0 0 20px rgba(255,255,255,0.6))" }}
    />
  );
}

function useBlinkAnimation(status: Status) {
  const [blinkScale, setBlinkScale] = useState(1);

  useEffect(() => {
    if (status !== "idle" && status !== "speaking") return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const scheduleNextBlink = () => {
      const delay = 2500 + Math.random() * 4000;
      timeoutId = setTimeout(() => {
        setBlinkScale(0.05);
        setTimeout(() => setBlinkScale(1), 120);
        scheduleNextBlink();
      }, delay);
    };
    scheduleNextBlink();
    return () => clearTimeout(timeoutId);
  }, [status]);

  useEffect(() => {
    if (status !== "success") return;
    setBlinkScale(0.05);
    setTimeout(() => {
      setBlinkScale(1);
      setTimeout(() => {
        setBlinkScale(0.05);
        setTimeout(() => setBlinkScale(1), 100);
      }, 200);
    }, 100);
  }, [status]);

  return blinkScale;
}

function GearRing({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: ColorPalette }) {
  const teeth = 16;
  const path = useMemo(() => {
    const valleyR = r + 2;
    const outerR = r + 11;
    const toothHalf = (Math.PI * 2 / teeth) * 0.38;
    const pts: string[] = [];
    for (let i = 0; i < teeth; i++) {
      const mid = (i / teeth) * Math.PI * 2 - Math.PI / 2;
      const a0 = mid - toothHalf * 1.0;
      const a1 = mid - toothHalf * 0.42;
      const a2 = mid - toothHalf * 0.28;
      const a3 = mid + toothHalf * 0.28;
      const a4 = mid + toothHalf * 0.42;
      const a5 = mid + toothHalf * 1.0;
      pts.push(`${(cx + Math.cos(a0) * valleyR).toFixed(2)},${(cy + Math.sin(a0) * valleyR).toFixed(2)}`);
      pts.push(`${(cx + Math.cos(a1) * outerR).toFixed(2)},${(cy + Math.sin(a1) * outerR).toFixed(2)}`);
      pts.push(`${(cx + Math.cos(a2) * outerR).toFixed(2)},${(cy + Math.sin(a2) * outerR).toFixed(2)}`);
      pts.push(`${(cx + Math.cos(a3) * outerR).toFixed(2)},${(cy + Math.sin(a3) * outerR).toFixed(2)}`);
      pts.push(`${(cx + Math.cos(a4) * outerR).toFixed(2)},${(cy + Math.sin(a4) * outerR).toFixed(2)}`);
      pts.push(`${(cx + Math.cos(a5) * valleyR).toFixed(2)},${(cy + Math.sin(a5) * valleyR).toFixed(2)}`);
    }
    return "M " + pts.join(" L ") + " Z";
  }, [cx, cy, r]);

  const innerPath = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push(`${(cx + Math.cos(a) * (r + 2)).toFixed(2)},${(cy + Math.sin(a) * (r + 2)).toFixed(2)}`);
    }
    return "M " + pts.join(" L ") + " Z";
  }, [cx, cy, r]);

  return (
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <path d={path} fill={color.glow} fillOpacity="0.08" />
      <path d={path} fill="none" stroke={color.rim} strokeWidth="1.2" strokeOpacity="0.7" strokeLinejoin="round" />
      <path d={innerPath} fill="none" stroke={color.light} strokeWidth="0.6" strokeOpacity="0.25" />
    </motion.g>
  );
}

interface Bar { id: number; born: number; heightFactor: number; side: number; }

function Capsule({ cx, cy, w, h, opacity, glowRadius }: {
  cx: number; cy: number; w: number; h: number; opacity: number; glowRadius: number;
}) {
  return (
    <rect
      x={cx - w / 2} y={cy - h / 2}
      width={w} height={h}
      rx={w / 2} ry={w / 2}
      fill="white"
      opacity={opacity}
      style={{ filter: `drop-shadow(0 0 ${glowRadius}px rgba(255,255,255,0.95)) drop-shadow(0 0 ${glowRadius * 2}px rgba(255,255,255,0.5))` }}
    />
  );
}

function SpeakingEyes({ leftX, rightX, eyeY, amplitude, blinkScale }: {
  leftX: number; rightX: number; eyeY: number; amplitude: number; blinkScale: number;
}) {
  const ampRef = useRef(amplitude);
  const frameRef = useRef<number | null>(null);
  const keyRef = useRef(0);

  useEffect(() => { ampRef.current = amplitude; }, [amplitude]);

  const [stretch, setStretch] = useState(1);
  const stretchRef = useRef(1);
  const stretchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const amplitudeStep = Math.round(amplitude * 10);

  useEffect(() => {
    if (amplitude > 0.08 && stretchRef.current === 1) {
      stretchRef.current = 1.45;
      setStretch(1.45);
      if (stretchTimer.current) clearTimeout(stretchTimer.current);
      stretchTimer.current = setTimeout(() => {
        stretchRef.current = 1;
        setStretch(1);
      }, 160);
    }
    // intentionally depend on quantized amplitude step, not raw value
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitudeStep]);

  const [bars, setBars] = useState<Bar[]>([]);
  const lastEmit = useRef(0);

  useEffect(() => {
    const tick = (t: number) => {
      const amp = ampRef.current;
      const interval = amp > 0.06 ? Math.max(80, 320 - amp * 260) : 9999;
      if (t - lastEmit.current > interval && amp > 0.06) {
        const id = keyRef.current++;
        const heightFactor = 0.4 + amp * (0.5 + Math.random() * 0.5);
        setBars(bs => [...bs.slice(-14), { id, born: t, heightFactor, side: id % 2 === 0 ? 1 : -1 }]);
        lastEmit.current = t;
      }
      setBars(bs => bs.filter(b => t - b.born < 750));
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, []);

  const [now, setNow] = useState(0);
  useEffect(() => {
    let id: number;
    const loop = (t: number) => { setNow(t); id = requestAnimationFrame(loop); };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  const CAPSULE_W = 11;
  const CAPSULE_H = 28;
  const MAX_TRAVEL = 38;

  const renderBars = (eyeCX: number) => bars.map(b => {
    const age = (now - b.born) / 750;
    if (age > 1 || age < 0) return null;
    const dir = eyeCX < (leftX + rightX) / 2 ? -1 : 1;
    const travel = age * MAX_TRAVEL * dir;
    const opacity = (1 - age) * 0.88;
    const barH = CAPSULE_H * b.heightFactor;
    const barW = CAPSULE_W * 0.85;
    const glow = 5 + amplitude * 10;
    return (
      <Capsule key={`${eyeCX}_${b.id}`} cx={eyeCX + travel} cy={eyeY} w={barW} h={barH} opacity={opacity} glowRadius={glow} />
    );
  });

  const eyeGlow = 8 + amplitude * 12;

  return (
    <g style={{ pointerEvents: "none" }}>
      {renderBars(leftX)}
      {renderBars(rightX)}
      <motion.g
        animate={{ scaleY: stretch * blinkScale }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        style={{ transformOrigin: `${leftX}px ${eyeY}px` }}
      >
        <Capsule cx={leftX} cy={eyeY} w={CAPSULE_W} h={CAPSULE_H} opacity={1} glowRadius={eyeGlow} />
      </motion.g>
      <motion.g
        animate={{ scaleY: stretch * blinkScale }}
        transition={{ type: "spring", stiffness: 280, damping: 18 }}
        style={{ transformOrigin: `${rightX}px ${eyeY}px` }}
      >
        <Capsule cx={rightX} cy={eyeY} w={CAPSULE_W} h={CAPSULE_H} opacity={1} glowRadius={eyeGlow} />
      </motion.g>
    </g>
  );
}

interface AgentAvatarProps {
  status?: Status;
  audioAmplitude?: number;
  mousePosition?: { x: number; y: number } | null;
  size?: number;
  name?: string;
}

export default function AgentAvatar({
  status = "idle",
  audioAmplitude = 0,
  mousePosition = null,
  size = 200,
  name = "Agent",
}: AgentAvatarProps) {
  const cfg = STATE_CONFIG[status] ?? STATE_CONFIG.idle;
  const { color } = cfg;
  const blinkScale = useBlinkAnimation(status);
  const containerRef = useRef<HTMLDivElement>(null);

  const [lookAt, setLookAt] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    setLookAt({ x: Math.max(-8, Math.min(8, dx * 16)), y: Math.max(-6, Math.min(6, dy * 12)) });
    setTilt({ rx: -dy * 12, ry: dx * 12 });
  }, []);

  useEffect(() => {
    if (mousePosition) {
      const dx = (mousePosition.x - 0.5) * 2;
      const dy = (mousePosition.y - 0.5) * 2;
      setLookAt({ x: dx * 12, y: dy * 8 });
      setTilt({ rx: -dy * 12, ry: dx * 12 });
    }
  }, [mousePosition]);

  const motionAnim = status === "error"
    ? { x: [0, -8, 8, -6, 6, -3, 3, 0], transition: { duration: 0.6, repeat: Infinity, repeatDelay: 2 } }
    : {};

  const glowExtra = status === "speaking" ? audioAmplitude * 0.55 : 0;
  const baseGlow = cfg.glowScale + glowExtra;

  const breatheAnim = status === "idle"
    ? { y: [0, -6, 0], transition: { duration: 3.8, repeat: Infinity, ease: "easeInOut" } }
    : { y: 0 };

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.40;

  const leftEyeX = cx - size * 0.115 + lookAt.x;
  const rightEyeX = cx + size * 0.115 + lookAt.x;
  const eyeY = cy + size * 0.03 + lookAt.y;
  const eyeScale = blinkScale;

  const shadowScaleX = 1 + (status === "speaking" ? audioAmplitude * 0.3 : 0);
  const uid = `av_${name.replace(/[\s-]/g, "_")}`;

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ position: "relative", width: size, height: size + size * 0.18, display: "flex", flexDirection: "column", alignItems: "center", userSelect: "none" }}
      animate={motionAnim}
    >
      <motion.div animate={breatheAnim} style={{ position: "relative", width: size, height: size }}>
        {/* Bloom glow */}
        <motion.div
          animate={{
            scale: status === "thinking"
              ? [baseGlow * 0.75, baseGlow * 1.22, baseGlow * 0.75]
              : [baseGlow, baseGlow * 1.08, baseGlow],
            opacity: status === "thinking"
              ? [0.15, cfg.glowOpacity, 0.15]
              : [cfg.glowOpacity * 0.7, cfg.glowOpacity, cfg.glowOpacity * 0.7],
          }}
          transition={{ duration: cfg.glowPulse.duration, repeat: Infinity, ease: cfg.glowPulse.ease }}
          style={{ position: "absolute", inset: 0, borderRadius: "50%", background: color.glow, filter: "blur(22px)", mixBlendMode: "screen", transformOrigin: "center", pointerEvents: "none" }}
        />

        {/* 3D tilt container */}
        <motion.div
          animate={{ rotateX: tilt.rx, rotateY: tilt.ry, scale: cfg.sphereScale }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ width: "100%", height: "100%", transformStyle: "preserve-3d", perspective: 800 }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible", display: "block" }}>
            <defs>
              <radialGradient id={`${uid}_sphere`} cx="40%" cy="42%" r="66%" fx="40%" fy="42%">
                <stop offset="0%" stopColor={color.rim} stopOpacity="1" />
                <stop offset="45%" stopColor={color.mid} stopOpacity="1" />
                <stop offset="80%" stopColor={color.base} stopOpacity="1" />
                <stop offset="100%" stopColor="#000308" stopOpacity="1" />
              </radialGradient>
              <radialGradient id={`${uid}_keyLight`} cx="22%" cy="14%" r="70%">
                <stop offset="0%"   stopColor="rgba(200,225,255,0.82)" />
                <stop offset="18%"  stopColor="rgba(160,200,255,0.48)" />
                <stop offset="42%"  stopColor="rgba(110,165,255,0.18)" />
                <stop offset="68%"  stopColor="rgba(70,130,255,0.04)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <radialGradient id={`${uid}_fillLight`} cx="88%" cy="36%" r="34%">
                <stop offset="0%"   stopColor="rgba(120,175,255,0.42)" />
                <stop offset="55%"  stopColor="rgba(80,140,255,0.10)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <radialGradient id={`${uid}_refract`} cx="50%" cy="100%" r="60%">
                <stop offset="0%"   stopColor="rgba(130,200,255,0.88)" />
                <stop offset="25%"  stopColor="rgba(95,170,255,0.50)" />
                <stop offset="52%"  stopColor="rgba(60,130,255,0.15)" />
                <stop offset="100%" stopColor="rgba(0,0,0,0)" />
              </radialGradient>
              <radialGradient id={`${uid}_fresnel`} cx="50%" cy="50%" r="50%">
                <stop offset="0%"  stopColor="rgba(0,0,0,0)" />
                <stop offset="64%" stopColor="rgba(0,0,0,0)" />
                <stop offset="82%" stopColor={color.rim} stopOpacity="0.18" />
                <stop offset="93%" stopColor={color.light} stopOpacity="0.65" />
                <stop offset="100%" stopColor={color.light} stopOpacity="0.82" />
              </radialGradient>
              <radialGradient id={`${uid}_gloss`} cx="30%" cy="20%" r="44%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
                <stop offset="35%"  stopColor="rgba(255,255,255,0.18)" />
                <stop offset="70%"  stopColor="rgba(255,255,255,0.04)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </radialGradient>
              <clipPath id={`${uid}_clip`}>
                <circle cx={cx} cy={cy} r={r} />
              </clipPath>
            </defs>

            {/* 1. Sphere base */}
            <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}_sphere)`} />

            {/* 2-5. Light layers */}
            <g clipPath={`url(#${uid}_clip)`} style={{ mixBlendMode: "screen" }}>
              <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}_refract)`} />
            </g>
            <g clipPath={`url(#${uid}_clip)`} style={{ mixBlendMode: "screen" }}>
              <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}_fillLight)`} />
            </g>
            <g clipPath={`url(#${uid}_clip)`} style={{ mixBlendMode: "screen" }}>
              <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}_fresnel)`} />
            </g>
            <g clipPath={`url(#${uid}_clip)`} style={{ mixBlendMode: "screen" }}>
              <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}_keyLight)`} />
            </g>

            {/* 6. Gloss */}
            <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}_gloss)`} />

            {/* 7. Crystal border */}
            <circle cx={cx} cy={cy} r={r - 0.5} fill="none" stroke={color.light} strokeOpacity="0.15" strokeWidth="1" />

            {/* Thinking luminosity pulse */}
            <AnimatePresence>
              {status === "thinking" && (
                <motion.circle
                  key="think-lum"
                  cx={cx} cy={cy} r={r}
                  fill={color.light}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.22, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>

            {/* Eyes */}
            <g clipPath={`url(#${uid}_clip)`}>
              <AnimatePresence mode="wait">
                {status === "speaking" ? (
                  <motion.g key="speaking-eyes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <SpeakingEyes leftX={leftEyeX} rightX={rightEyeX} eyeY={eyeY} amplitude={audioAmplitude} blinkScale={eyeScale} />
                  </motion.g>
                ) : (
                  <motion.g key="normal-eyes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <motion.g animate={{ scaleY: eyeScale }} style={{ transformOrigin: `${leftEyeX}px ${eyeY}px` }} transition={{ duration: 0.08 }}>
                      <EyeCapsule x={leftEyeX} y={eyeY} height={status === "success" ? 1.1 : 1} />
                    </motion.g>
                    <motion.g animate={{ scaleY: eyeScale }} style={{ transformOrigin: `${rightEyeX}px ${eyeY}px` }} transition={{ duration: 0.08 }}>
                      <EyeCapsule x={rightEyeX} y={eyeY} height={status === "success" ? 1.1 : 1} />
                    </motion.g>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>

            {/* Thinking: gear ring */}
            <AnimatePresence>
              {status === "thinking" && (
                <motion.g key="gear-ring" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
                  <GearRing cx={cx} cy={cy} r={r} color={color} />
                </motion.g>
              )}
            </AnimatePresence>

            {/* Speaking: pulse ring */}
            {status === "speaking" && (
              <motion.circle
                cx={cx} cy={cy} r={r + 4}
                fill="none"
                stroke={COLORS.idle.rim}
                strokeWidth="1.5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25 }}
                style={{ transformOrigin: `${cx}px ${cy}px`, animation: "speakRingPulse 1.4s ease-in-out infinite" }}
              />
            )}

            {/* Success: flash ring */}
            <AnimatePresence>
              {status === "success" && (
                <motion.circle
                  key="success-ring"
                  cx={cx} cy={cy} r={r + 4}
                  fill="none"
                  stroke={COLORS.emerald.rim}
                  strokeWidth="3"
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: [0.9, 1.18, 1.05], opacity: [0, 0.9, 0] }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  style={{ transformOrigin: `${cx}px ${cy}px` }}
                />
              )}
            </AnimatePresence>
          </svg>
        </motion.div>
      </motion.div>

      {/* Ground shadow */}
      <motion.div
        animate={{ scaleX: shadowScaleX, opacity: status === "error" ? 0.4 : 0.9 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        style={{
          width: size * 0.85,
          height: size * 0.10,
          borderRadius: "50%",
          marginTop: -size * 0.02,
          background: `radial-gradient(ellipse at center, ${color.light}60 0%, ${color.glow}40 35%, transparent 72%)`,
          filter: "blur(14px)",
          transformOrigin: "center",
        }}
      />
    </motion.div>
  );
}
