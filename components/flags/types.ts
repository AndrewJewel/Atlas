export type Confederation =
  | 'UEFA'
  | 'CONMEBOL'
  | 'CONCACAF'
  | 'CAF'
  | 'AFC'
  | 'OFC'

export type FlagSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export type Locale = 'es' | 'en' | 'pt'

export type FlagShape = 'circle' | 'rounded' | 'square'

export interface WC2026Team {
  code: string        // ISO 3166-1 alpha-2 (flagcdn.com key). 'gb-eng', 'gb-sct' for England/Scotland
  names: Record<Locale, string>
  fifa: string        // FIFA 3-letter code
  confederation: Confederation
  isHost?: boolean
  group?: string
}

export interface FlagIconProps {
  team: WC2026Team
  size?: FlagSize
  showLabel?: boolean
  locale?: Locale
  shape?: FlagShape
  borderRadius?: string
  showHostBadge?: boolean
  showConfRing?: boolean
  className?: string
  onClick?: (team: WC2026Team) => void
}

export interface FlagGridProps {
  teams?: WC2026Team[]
  groupBy?: 'confederation' | 'none'
  size?: FlagSize
  showLabels?: boolean
  locale?: Locale
  shape?: FlagShape
  showHostBadge?: boolean
  showConfRing?: boolean
  className?: string
  onTeamClick?: (team: WC2026Team) => void
}

export interface ConfederationMeta {
  id: Confederation
  name: string
  fullName: string
  color: string
  slots: number
}
