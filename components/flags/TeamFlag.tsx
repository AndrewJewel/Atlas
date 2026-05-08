"use client"

import { WC2026_TEAMS } from './data'
import { FlagIcon } from './FlagIcon'
import type { FlagSize, FlagShape } from './types'

interface TeamFlagProps {
  code: string  // FIFA 3-letter code e.g. "MEX"
  size?: FlagSize
  shape?: FlagShape
  showLabel?: boolean
  showHostBadge?: boolean
}

export function TeamFlag({
  code,
  size          = 'xs',
  shape         = 'rounded',
  showLabel     = false,
  showHostBadge = false,
}: TeamFlagProps) {
  const team = WC2026_TEAMS.find(t => t.fifa === code)
  if (!team) return <span className="text-[20px] opacity-30">⬜</span>
  return (
    <FlagIcon
      team={team}
      size={size}
      shape={shape}
      showLabel={showLabel}
      showHostBadge={showHostBadge}
      showConfRing={false}
    />
  )
}

export default TeamFlag
