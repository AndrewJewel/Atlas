"use client"

import { WC2026_TEAMS } from './data'
import type { FlagSize, FlagShape } from './types'

interface TeamFlagProps {
  code: string  // FIFA 3-letter code e.g. "MEX"
  size?: FlagSize
  shape?: FlagShape  // accepted for API compatibility (unused)
  showLabel?: boolean
  showHostBadge?: boolean
}

const SIZE_PX: Record<FlagSize, { w: number; h: number; res: 40 | 80 | 160 | 320 }> = {
  xs:    { w: 32,  h: 22, res: 40  },
  sm:    { w: 44,  h: 30, res: 80  },
  md:    { w: 60,  h: 41, res: 80  },
  lg:    { w: 80,  h: 55, res: 160 },
  xl:    { w: 96,  h: 66, res: 160 },
  '2xl': { w: 128, h: 88, res: 320 },
}

const BADGE_PX: Record<FlagSize, number> = {
  xs:  10,
  sm:  12,
  md:  14,
  lg:  18,
  xl:  20,
  '2xl': 24,
}

export function TeamFlag({
  code,
  size          = 'xs',
  showLabel     = false,
  showHostBadge = false,
}: TeamFlagProps) {
  const team = WC2026_TEAMS.find(t => t.fifa === code)
  if (!team) return <span className="text-[20px] opacity-30">⬜</span>

  const dims = SIZE_PX[size]
  const badgePx = BADGE_PX[size]
  const flagUrl = `https://flagcdn.com/w${dims.res}/${team.code.toLowerCase()}.png`
  const label = team.names.es

  return (
    <div className="flex flex-col items-center" style={{ gap: showLabel ? 6 : 0 }}>
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <img
          src={flagUrl}
          alt={label}
          width={dims.w}
          height={dims.h}
          className="rounded-sm object-cover"
          style={{ width: dims.w, height: dims.h, display: 'block' }}
        />
        {showHostBadge && team.isHost && (
          <div
            aria-label="Sede"
            style={{
              position:       'absolute',
              top:            -3,
              right:          -3,
              width:          badgePx,
              height:         badgePx,
              background:     '#F97316',
              borderRadius:   '50%',
              border:         '1.5px solid #090B19',
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
        <div className="text-center leading-tight" style={{ maxWidth: dims.w + 16 }}>
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

export default TeamFlag
