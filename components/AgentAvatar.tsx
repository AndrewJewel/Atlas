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
  soccer:       { base: "#3d1100", mid: "#C2410C", glow: "#F97316", rim: "#FB923C", light: "#FED7AA" },
};

const STATE_CONFIG = {
  idle:     { color: COLORS.idle,         glowScale: 1,    glowOpacity: 0.55, glowPulse: { duration: 3.5,  ease: "easeInOut" }, sphereScale: 1    },
  thinking: { color: COLORS.midnightBlue, glowScale: 1.15, glowOpacity: 0.9,  glowPulse: { duration: 0.85, ease: "easeInOut" }, sphereScale: 1    },
  speaking: { color: COLORS.idle,         glowScale: 1.1,  glowOpacity: 0.65, glowPulse: { duration: 1.8,  ease: "easeInOut" }, sphereScale: 1    },
  success:  { color: COLORS.emerald,      glowScale: 1.2,  glowOpacity: 0.9,  glowPulse: { duration: 0.5,  ease: "easeOut"   }, sphereScale: 1.04 },
  error:    { color: COLORS.coral,        glowScale: 1.08, glowOpacity: 0.75, glowPulse: { duration: 1.2,  ease: "easeInOut" }, sphereScale: 1    },
};

// Eye dimensions scale with size (calibrated at size=200: w=11, h=28)
function eyeW(size: number) { return size * 0.055; }
function eyeH(size: number, height = 1) { return size * 0.14 * height; }

function EyeCapsule({ x, y, height = 1, opacity = 1, size }: {
  x: number; y: number; height?: number; opacity?: number; size: number;
}) {
  const w = eyeW(size);
  const h = eyeH(size, height);
  const r = w / 2;
  return (
    <rect
      x={x - w / 2} y={y - h / 2}
      width={w} height={h}
      rx={r} ry={r}
      fill="white"
      opacity={opacity}
      style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.9)) drop-shadow(0 0 10px rgba(255,255,255,0.6))" }}
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
        setTimeout(() => setBlinkScale(1), 100);
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
      setTimeout(() => { setBlinkScale(0.05); setTimeout(() => setBlinkScale(1), 100); }, 200);
    }, 100);
  }, [status]);

  return blinkScale;
}

function GearRing({ cx, cy, r, color }: { cx: number; cy: number; r: number; color: ColorPalette }) {
  const teeth = 16;
  const path = useMemo(() => {
    const valleyR = r + 2;
    const outerR = r + Math.max(6, r * 0.2);
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

function SoccerPattern({ cx, cy, r, uid }: { cx: number; cy: number; r: number; uid: string }) {
  // Stylized soccer ball pattern: 1 central pentagon + 5 surrounding partial pentagons + connecting seams
  const pentagonPoints = (centerX: number, centerY: number, size: number, rotation = -Math.PI / 2) => {
    const pts: string[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = rotation + (i * 2 * Math.PI) / 5;
      pts.push(`${(centerX + size * Math.cos(angle)).toFixed(2)},${(centerY + size * Math.sin(angle)).toFixed(2)}`);
    }
    return pts.join(" ");
  };

  const centerSize = r * 0.30;
  const sideSize = r * 0.26;
  const sideDist = r * 0.62;
  const PANEL = "#0A0A0A";
  const SEAM = "#1a0500";

  return (
    <g clipPath={`url(#${uid}_clip)`} style={{ pointerEvents: "none" }}>
      {/* Seams between center and sides */}
      {[0, 1, 2, 3, 4].map(i => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const x = cx + Math.cos(angle) * sideDist;
        const y = cy + Math.sin(angle) * sideDist;
        return (
          <line key={`seam-${i}`}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke={SEAM} strokeWidth={Math.max(1.2, r * 0.025)} strokeOpacity="0.55" strokeLinecap="round"
          />
        );
      })}
      {/* Central pentagon */}
      <polygon points={pentagonPoints(cx, cy, centerSize)} fill={PANEL} fillOpacity="0.92"
        stroke={SEAM} strokeWidth={Math.max(0.8, r * 0.018)} strokeLinejoin="round" />
      {/* Surrounding pentagons rotated outward */}
      {[0, 1, 2, 3, 4].map(i => {
        const angle = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
        const px = cx + Math.cos(angle) * sideDist;
        const py = cy + Math.sin(angle) * sideDist;
        return (
          <polygon key={`pent-${i}`}
            points={pentagonPoints(px, py, sideSize, angle + Math.PI / 2)}
            fill={PANEL} fillOpacity="0.78"
            stroke={SEAM} strokeWidth={Math.max(0.8, r * 0.018)} strokeLinejoin="round"
          />
        );
      })}
    </g>
  );
}

interface Bar { id: number; born: number; heightFactor: number; }

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

function SpeakingEyes({ leftX, rightX, eyeY, amplitude, blinkScale, size }: {
  leftX: number; rightX: number; eyeY: number; amplitude: number; blinkScale: number; size: number;
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
      stretchTimer.current = setTimeout(() => { stretchRef.current = 1; setStretch(1); }, 160);
    }
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
        setBars(bs => [...bs.slice(-14), { id, born: t, heightFactor }]);
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

  const CW = eyeW(size);
  const CH = eyeH(size);
  const MAX_TRAVEL = size * 0.19;
  const eyeGlow = 3 + amplitude * 6;
  const scaleY = stretch * blinkScale;

  const renderBars = (eyeCX: number) => bars.map(b => {
    const age = (now - b.born) / 750;
    if (age > 1 || age < 0) return null;
    const dir = eyeCX < (leftX + rightX) / 2 ? -1 : 1;
    return (
      <Capsule
        key={`${eyeCX}_${b.id}`}
        cx={eyeCX + age * MAX_TRAVEL * dir}
        cy={eyeY}
        w={CW * 0.85}
        h={CH * b.heightFactor}
        opacity={(1 - age) * 0.88}
        glowRadius={eyeGlow}
      />
    );
  });

  return (
    <g style={{ pointerEvents: "none" }}>
      {renderBars(leftX)}
      {renderBars(rightX)}
      <g style={{ transform: `scaleY(${scaleY})`, transformOrigin: `${leftX}px ${eyeY}px` }}>
        <Capsule cx={leftX} cy={eyeY} w={CW} h={CH} opacity={1} glowRadius={eyeGlow} />
      </g>
      <g style={{ transform: `scaleY(${scaleY})`, transformOrigin: `${rightX}px ${eyeY}px` }}>
        <Capsule cx={rightX} cy={eyeY} w={CW} h={CH} opacity={1} glowRadius={eyeGlow} />
      </g>
    </g>
  );
}

interface AgentAvatarProps {
  status?: Status;
  audioAmplitude?: number;
  mousePosition?: { x: number; y: number } | null;
  size?: number;
  name?: string;
  variant?: "default" | "soccer";
}

export default function AgentAvatar({
  status = "idle",
  audioAmplitude = 0,
  mousePosition = null,
  size = 200,
  name = "Agent",
  variant = "default",
}: AgentAvatarProps) {
  const cfg = STATE_CONFIG[status] ?? STATE_CONFIG.idle;
  const color = variant === "soccer" ? COLORS.soccer : cfg.color;
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

  const leftEyeX  = cx - size * 0.115 + lookAt.x;
  const rightEyeX = cx + size * 0.115 + lookAt.x;
  const eyeY = cy + size * 0.03 + lookAt.y;

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
        {/* Bloom */}
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

        {/* 3D tilt */}
        <motion.div
          animate={{ rotateX: tilt.rx, rotateY: tilt.ry, scale: cfg.sphereScale }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          style={{ width: "100%", height: "100%", transformStyle: "preserve-3d", perspective: 800 }}
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible", display: "block" }}>
            <defs>
              <radialGradient id={`${uid}_sphere`} cx="40%" cy="42%" r="66%" fx="40%" fy="42%">
                <stop offset="0%"   stopColor={color.rim}  stopOpacity="1" />
                <stop offset="45%"  stopColor={color.mid}  stopOpacity="1" />
                <stop offset="80%"  stopColor={color.base} stopOpacity="1" />
                <stop offset="100%" stopColor="#000308"     stopOpacity="1" />
              </radialGradient>
              <radialGradient id={`${uid}_keyLight`} cx="22%" cy="14%" r="70%">
                <stop offset="0%"   stopColor="rgba(200,225,255,0.82)" />
                <stop offset="18%"  stopColor="rgba(160,200,255,0.48)" />
                <stop offset="42%"  stopColor="rgba(110,165,255,0.18)" />
                <stop offset="68%"  stopColor="rgba(70,130,255,0.04)"  />
                <stop offset="100%" stopColor="rgba(0,0,0,0)"          />
              </radialGradient>
              <radialGradient id={`${uid}_fillLight`} cx="88%" cy="36%" r="34%">
                <stop offset="0%"   stopColor="rgba(120,175,255,0.42)" />
                <stop offset="55%"  stopColor="rgba(80,140,255,0.10)"  />
                <stop offset="100%" stopColor="rgba(0,0,0,0)"          />
              </radialGradient>
              <radialGradient id={`${uid}_refract`} cx="50%" cy="100%" r="60%">
                <stop offset="0%"   stopColor="rgba(130,200,255,0.88)" />
                <stop offset="25%"  stopColor="rgba(95,170,255,0.50)"  />
                <stop offset="52%"  stopColor="rgba(60,130,255,0.15)"  />
                <stop offset="100%" stopColor="rgba(0,0,0,0)"          />
              </radialGradient>
              <radialGradient id={`${uid}_fresnel`} cx="50%" cy="50%" r="50%">
                <stop offset="0%"   stopColor="rgba(0,0,0,0)"   />
                <stop offset="64%"  stopColor="rgba(0,0,0,0)"   />
                <stop offset="82%"  stopColor={color.rim}  stopOpacity="0.18" />
                <stop offset="93%"  stopColor={color.light} stopOpacity="0.65" />
                <stop offset="100%" stopColor={color.light} stopOpacity="0.82" />
              </radialGradient>
              <radialGradient id={`${uid}_gloss`} cx="30%" cy="20%" r="44%">
                <stop offset="0%"   stopColor="rgba(255,255,255,0.55)" />
                <stop offset="35%"  stopColor="rgba(255,255,255,0.18)" />
                <stop offset="70%"  stopColor="rgba(255,255,255,0.04)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
              </radialGradient>
              <clipPath id={`${uid}_clip`}>
                <circle cx={cx} cy={cy} r={r} />
              </clipPath>
            </defs>

            {/* Sphere layers */}
            <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}_sphere)`} />
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
            <circle cx={cx} cy={cy} r={r} fill={`url(#${uid}_gloss)`} />
            <circle cx={cx} cy={cy} r={r - 0.5} fill="none" stroke={color.light} strokeOpacity="0.15" strokeWidth="1" />

            {/* Soccer ball pattern overlay */}
            {variant === "soccer" && (
              <SoccerPattern cx={cx} cy={cy} r={r} uid={uid} />
            )}

            {/* Thinking pulse overlay */}
            <AnimatePresence>
              {status === "thinking" && (
                <motion.circle key="think-lum" cx={cx} cy={cy} r={r} fill={color.light}
                  initial={{ opacity: 0 }} animate={{ opacity: [0, 0.22, 0] }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
                />
              )}
            </AnimatePresence>

            {/* Eyes — blink via direct CSS transform (no framer-motion interpolation) */}
            <g clipPath={`url(#${uid}_clip)`}>
              <AnimatePresence mode="wait">
                {status === "speaking" ? (
                  <motion.g key="speaking-eyes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                    <SpeakingEyes leftX={leftEyeX} rightX={rightEyeX} eyeY={eyeY} amplitude={audioAmplitude} blinkScale={blinkScale} size={size} />
                  </motion.g>
                ) : (
                  <motion.g key="normal-eyes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    {/* CSS scaleY para parpadeo instantáneo y visible */}
                    <g style={{ transform: `scaleY(${blinkScale})`, transformOrigin: `${leftEyeX}px ${eyeY}px` }}>
                      <EyeCapsule x={leftEyeX} y={eyeY} height={status === "success" ? 1.1 : 1} size={size} />
                    </g>
                    <g style={{ transform: `scaleY(${blinkScale})`, transformOrigin: `${rightEyeX}px ${eyeY}px` }}>
                      <EyeCapsule x={rightEyeX} y={eyeY} height={status === "success" ? 1.1 : 1} size={size} />
                    </g>
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
                fill="none" stroke={COLORS.idle.rim} strokeWidth="1.5"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}
                style={{ transformOrigin: `${cx}px ${cy}px`, animation: "speakRingPulse 1.4s ease-in-out infinite" }}
              />
            )}

            {/* Success: flash ring */}
            <AnimatePresence>
              {status === "success" && (
                <motion.circle key="success-ring" cx={cx} cy={cy} r={r + 4}
                  fill="none" stroke={COLORS.emerald.rim} strokeWidth="3"
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
          width: size * 0.85, height: size * 0.10, borderRadius: "50%", marginTop: -size * 0.02,
          background: `radial-gradient(ellipse at center, ${color.light}60 0%, ${color.glow}40 35%, transparent 72%)`,
          filter: "blur(14px)", transformOrigin: "center",
        }}
      />
    </motion.div>
  );
}
