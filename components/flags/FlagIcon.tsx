"use client"

import Image from 'next/image'
import type { FlagIconProps, FlagSize, FlagShape } from './types'
import { CONFEDERATION_META, getFlagUrl } from './data'

const SIZE_PX: Record<FlagSize, number> = {
  xs:  32,
  sm:  48,
  md:  64,
  lg:  80,
  xl:  96,
  '2xl': 128,
}

const IMG_RES: Record<FlagSize, 40 | 80 | 160 | 320> = {
  xs:    40,
  sm:    80,
  md:   160,
  lg:   160,
  xl:   160,
  '2xl': 320,
}

const SHAPE_RADIUS: Record<FlagShape, string> = {
  circle:  '50%',
  rounded: '24%',
  square:  '8px',
}

const BADGE_PX: Record<FlagSize, number> = {
  xs:  12,
  sm:  14,
  md:  18,
  lg:  20,
  xl:  22,
  '2xl': 28,
}

export function FlagIcon({
  team,
  size          = 'md',
  showLabel     = false,
  locale        = 'es',
  shape         = 'circle',
  borderRadius,
  showHostBadge = true,
  showConfRing  = false,
  className     = '',
  onClick,
}: FlagIconProps) {
  const px        = SIZE_PX[size]
  const imgRes    = IMG_RES[size]
  const radius    = borderRadius ?? SHAPE_RADIUS[shape]
  const confColor = CONFEDERATION_META[team.confederation]?.color ?? '#F97316'
  const badgePx   = BADGE_PX[size]
  const label     = team.names[locale]

  const wrapStyle: React.CSSProperties = {
    width:        px,
    height:       px,
    position:     'relative',
    flexShrink:   0,
    cursor:       onClick ? 'pointer' : 'default',
    ...(showConfRing && {
      outline:       `2.5px solid ${confColor}`,
      outlineOffset: '3px',
      borderRadius:  radius,
    }),
  }

  const sphereStyle: React.CSSProperties = {
    width:        '100%',
    height:       '100%',
    borderRadius: radius,
    overflow:     'hidden',
    position:     'relative',
    boxShadow: [
      '0 6px 20px rgba(0,0,0,0.55)',
      '0 2px 6px rgba(0,0,0,0.35)',
    ].join(', '),
  }

  const rimStyle: React.CSSProperties = {
    position:       'absolute',
    inset:          0,
    borderRadius:   radius,
    pointerEvents:  'none',
    zIndex:         2,
    boxShadow: [
      'inset 0 0 24px rgba(0,0,0,0.38)',
      'inset 0 0 0 1.5px rgba(255,255,255,0.10)',
    ].join(', '),
  }

  const glossStyle: React.CSSProperties = {
    position:      'absolute',
    inset:         0,
    borderRadius:  radius,
    pointerEvents: 'none',
    zIndex:        3,
    background: [
      'radial-gradient(circle at 33% 27%, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.28) 18%, rgba(255,255,255,0.04) 38%, transparent 56%)',
      'radial-gradient(circle at 68% 76%, rgba(0,0,0,0.22) 0%, transparent 46%)',
    ].join(', '),
  }

  return (
    <div
      className={['flex flex-col items-center', className].filter(Boolean).join(' ')}
      style={{ gap: showLabel ? 8 : 0 }}
    >
      <div
        style={wrapStyle}
        onClick={onClick ? () => onClick(team) : undefined}
        title={label}
        className="transition-[transform,filter] duration-[220ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-[3px] hover:scale-[1.07] active:scale-[0.97]"
      >
        <div style={sphereStyle}>
          <Image
            src={getFlagUrl(team.code, imgRes)}
            alt={label}
            width={px}
            height={px}
            unoptimized
            style={{
              width:          '100%',
              height:         '100%',
              objectFit:      'cover',
              objectPosition: 'center',
              transform:      'scale(1.06)',
              display:        'block',
            }}
          />
          <div style={rimStyle} aria-hidden />
          <div style={glossStyle} aria-hidden />
        </div>

        {showHostBadge && team.isHost && (
          <div
            aria-label="Sede"
            style={{
              position:       'absolute',
              top:            -2,
              right:          -2,
              width:          badgePx,
              height:         badgePx,
              background:     '#F97316',
              borderRadius:   '50%',
              border:         '2px solid #090B19',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontSize:       badgePx * 0.5,
              zIndex:         10,
            }}
          >
            ⭐
          </div>
        )}
      </div>

      {showLabel && (
        <div
          className="text-center leading-tight"
          style={{ maxWidth: px + 16 }}
        >
          <p className="text-[11px] font-semibold text-[#EDF0FF] truncate" title={label}>
            {label}
          </p>
          <p className="text-[9px] font-mono tracking-widest text-[#4A5178] uppercase mt-0.5">
            {team.fifa}
          </p>
        </div>
      )}
    </div>
  )
}

export default FlagIcon
