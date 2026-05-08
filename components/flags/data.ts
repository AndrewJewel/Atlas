import type { WC2026Team, ConfederationMeta } from './types'

export const CONFEDERATION_META: Record<string, ConfederationMeta> = {
  CONCACAF: { id: 'CONCACAF', name: 'CONCACAF', fullName: 'Norteamérica, Centroamérica y el Caribe', color: '#3B82F6', slots: 6  },
  UEFA:     { id: 'UEFA',     name: 'UEFA',     fullName: 'Unión de Asociaciones Europeas de Fútbol',  color: '#F59E0B', slots: 16 },
  CONMEBOL: { id: 'CONMEBOL', name: 'CONMEBOL', fullName: 'Confederación Sudamericana de Fútbol',      color: '#22C55E', slots: 6  },
  CAF:      { id: 'CAF',      name: 'CAF',      fullName: 'Confederación Africana de Fútbol',          color: '#EF4444', slots: 10 },
  AFC:      { id: 'AFC',      name: 'AFC',      fullName: 'Confederación Asiática de Fútbol',          color: '#8B5CF6', slots: 9  },
  OFC:      { id: 'OFC',      name: 'OFC',      fullName: 'Confederación de Fútbol de Oceanía',        color: '#06B6D4', slots: 1  },
}

export const WC2026_TEAMS: WC2026Team[] = [
  // CONCACAF (6)
  { code: 'us',     names: { es: 'Estados Unidos',       en: 'United States',      pt: 'Estados Unidos'      }, fifa: 'USA', confederation: 'CONCACAF', isHost: true },
  { code: 'mx',     names: { es: 'México',               en: 'Mexico',             pt: 'México'              }, fifa: 'MEX', confederation: 'CONCACAF', isHost: true },
  { code: 'ca',     names: { es: 'Canadá',               en: 'Canada',             pt: 'Canadá'              }, fifa: 'CAN', confederation: 'CONCACAF', isHost: true },
  { code: 'pa',     names: { es: 'Panamá',               en: 'Panama',             pt: 'Panamá'              }, fifa: 'PAN', confederation: 'CONCACAF' },
  { code: 'ht',     names: { es: 'Haití',                en: 'Haiti',              pt: 'Haiti'               }, fifa: 'HAI', confederation: 'CONCACAF' },
  { code: 'cw',     names: { es: 'Curazao',              en: 'Curaçao',            pt: 'Curaçao'             }, fifa: 'CUW', confederation: 'CONCACAF' },
  // UEFA (16)
  { code: 'de',     names: { es: 'Alemania',             en: 'Germany',            pt: 'Alemanha'            }, fifa: 'GER', confederation: 'UEFA' },
  { code: 'fr',     names: { es: 'Francia',              en: 'France',             pt: 'França'              }, fifa: 'FRA', confederation: 'UEFA' },
  { code: 'es',     names: { es: 'España',               en: 'Spain',              pt: 'Espanha'             }, fifa: 'ESP', confederation: 'UEFA' },
  { code: 'gb-eng', names: { es: 'Inglaterra',           en: 'England',            pt: 'Inglaterra'          }, fifa: 'ENG', confederation: 'UEFA' },
  { code: 'pt',     names: { es: 'Portugal',             en: 'Portugal',           pt: 'Portugal'            }, fifa: 'POR', confederation: 'UEFA' },
  { code: 'nl',     names: { es: 'Países Bajos',         en: 'Netherlands',        pt: 'Holanda'             }, fifa: 'NED', confederation: 'UEFA' },
  { code: 'be',     names: { es: 'Bélgica',              en: 'Belgium',            pt: 'Bélgica'             }, fifa: 'BEL', confederation: 'UEFA' },
  { code: 'ch',     names: { es: 'Suiza',                en: 'Switzerland',        pt: 'Suíça'               }, fifa: 'SUI', confederation: 'UEFA' },
  { code: 'hr',     names: { es: 'Croacia',              en: 'Croatia',            pt: 'Croácia'             }, fifa: 'CRO', confederation: 'UEFA' },
  { code: 'at',     names: { es: 'Austria',              en: 'Austria',            pt: 'Áustria'             }, fifa: 'AUT', confederation: 'UEFA' },
  { code: 'tr',     names: { es: 'Turquía',              en: 'Turkey',             pt: 'Turquia'             }, fifa: 'TUR', confederation: 'UEFA' },
  { code: 'gb-sct', names: { es: 'Escocia',              en: 'Scotland',           pt: 'Escócia'             }, fifa: 'SCO', confederation: 'UEFA' },
  { code: 'cz',     names: { es: 'Chequia',              en: 'Czech Republic',     pt: 'República Tcheca'    }, fifa: 'CZE', confederation: 'UEFA' },
  { code: 'no',     names: { es: 'Noruega',              en: 'Norway',             pt: 'Noruega'             }, fifa: 'NOR', confederation: 'UEFA' },
  { code: 'se',     names: { es: 'Suecia',               en: 'Sweden',             pt: 'Suécia'              }, fifa: 'SWE', confederation: 'UEFA' },
  { code: 'ba',     names: { es: 'Bosnia y Herzegovina', en: 'Bosnia & Herz.',     pt: 'Bósnia e Herzeg.'    }, fifa: 'BIH', confederation: 'UEFA' },
  // CONMEBOL (6)
  { code: 'ar',     names: { es: 'Argentina',            en: 'Argentina',          pt: 'Argentina'           }, fifa: 'ARG', confederation: 'CONMEBOL' },
  { code: 'br',     names: { es: 'Brasil',               en: 'Brazil',             pt: 'Brasil'              }, fifa: 'BRA', confederation: 'CONMEBOL' },
  { code: 'co',     names: { es: 'Colombia',             en: 'Colombia',           pt: 'Colômbia'            }, fifa: 'COL', confederation: 'CONMEBOL' },
  { code: 'uy',     names: { es: 'Uruguay',              en: 'Uruguay',            pt: 'Uruguai'             }, fifa: 'URU', confederation: 'CONMEBOL' },
  { code: 'ec',     names: { es: 'Ecuador',              en: 'Ecuador',            pt: 'Equador'             }, fifa: 'ECU', confederation: 'CONMEBOL' },
  { code: 'py',     names: { es: 'Paraguay',             en: 'Paraguay',           pt: 'Paraguai'            }, fifa: 'PAR', confederation: 'CONMEBOL' },
  // CAF (10)
  { code: 'ma',     names: { es: 'Marruecos',            en: 'Morocco',            pt: 'Marrocos'            }, fifa: 'MAR', confederation: 'CAF' },
  { code: 'sn',     names: { es: 'Senegal',              en: 'Senegal',            pt: 'Senegal'             }, fifa: 'SEN', confederation: 'CAF' },
  { code: 'eg',     names: { es: 'Egipto',               en: 'Egypt',              pt: 'Egito'               }, fifa: 'EGY', confederation: 'CAF' },
  { code: 'ci',     names: { es: 'Costa de Marfil',      en: 'Ivory Coast',        pt: 'Costa do Marfim'     }, fifa: 'CIV', confederation: 'CAF' },
  { code: 'za',     names: { es: 'Sudáfrica',            en: 'South Africa',       pt: 'África do Sul'       }, fifa: 'RSA', confederation: 'CAF' },
  { code: 'dz',     names: { es: 'Argelia',              en: 'Algeria',            pt: 'Argélia'             }, fifa: 'ALG', confederation: 'CAF' },
  { code: 'gh',     names: { es: 'Ghana',                en: 'Ghana',              pt: 'Gana'                }, fifa: 'GHA', confederation: 'CAF' },
  { code: 'cv',     names: { es: 'Cabo Verde',           en: 'Cape Verde',         pt: 'Cabo Verde'          }, fifa: 'CPV', confederation: 'CAF' },
  { code: 'cd',     names: { es: 'Congo DR',             en: 'DR Congo',           pt: 'Congo RD'            }, fifa: 'COD', confederation: 'CAF' },
  { code: 'tn',     names: { es: 'Túnez',                en: 'Tunisia',            pt: 'Tunísia'             }, fifa: 'TUN', confederation: 'CAF' },
  // AFC (9)
  { code: 'jp',     names: { es: 'Japón',                en: 'Japan',              pt: 'Japão'               }, fifa: 'JPN', confederation: 'AFC' },
  { code: 'kr',     names: { es: 'Corea del Sur',        en: 'South Korea',        pt: 'Coreia do Sul'       }, fifa: 'KOR', confederation: 'AFC' },
  { code: 'ir',     names: { es: 'Irán',                 en: 'Iran',               pt: 'Irã'                 }, fifa: 'IRN', confederation: 'AFC' },
  { code: 'au',     names: { es: 'Australia',            en: 'Australia',          pt: 'Austrália'           }, fifa: 'AUS', confederation: 'AFC' },
  { code: 'sa',     names: { es: 'Arabia Saudita',       en: 'Saudi Arabia',       pt: 'Arábia Saudita'      }, fifa: 'KSA', confederation: 'AFC' },
  { code: 'iq',     names: { es: 'Irak',                 en: 'Iraq',               pt: 'Iraque'              }, fifa: 'IRQ', confederation: 'AFC' },
  { code: 'jo',     names: { es: 'Jordania',             en: 'Jordan',             pt: 'Jordânia'            }, fifa: 'JOR', confederation: 'AFC' },
  { code: 'qa',     names: { es: 'Qatar',                en: 'Qatar',              pt: 'Catar'               }, fifa: 'QAT', confederation: 'AFC' },
  { code: 'uz',     names: { es: 'Uzbekistán',           en: 'Uzbekistan',         pt: 'Uzbequistão'         }, fifa: 'UZB', confederation: 'AFC' },
  // OFC (1)
  { code: 'nz',     names: { es: 'Nueva Zelanda',        en: 'New Zealand',        pt: 'Nova Zelândia'       }, fifa: 'NZL', confederation: 'OFC' },
]

export const getTeamsByConf = (conf: string) =>
  WC2026_TEAMS.filter(t => t.confederation === conf)

export const getTeamByFifa = (fifa: string) =>
  WC2026_TEAMS.find(t => t.fifa === fifa)

export const getTeamsByConfederation = (): Record<string, WC2026Team[]> => {
  const order = ['CONCACAF', 'UEFA', 'CONMEBOL', 'CAF', 'AFC', 'OFC']
  return Object.fromEntries(order.map(c => [c, getTeamsByConf(c)]))
}

export const getFlagUrl = (code: string, width: 40 | 80 | 160 | 320 = 160): string =>
  `https://flagcdn.com/w${width}/${code.toLowerCase()}.png`
