import type { Avatar, Match, TeamStanding, Champion } from "./types";

export const KICKOFF = new Date("2026-06-11T13:00:00-06:00");

export const AVATARS: Avatar[] = [
  { emoji: "⚡", bg: "#F59E0B" }, { emoji: "🔥", bg: "#EF4444" }, { emoji: "🎯", bg: "#3B82F6" },
  { emoji: "🦅", bg: "#8B5CF6" }, { emoji: "🦁", bg: "#F97316" }, { emoji: "🐺", bg: "#6B7280" },
  { emoji: "⭐", bg: "#EAB308" }, { emoji: "🏆", bg: "#10B981" }, { emoji: "💥", bg: "#EC4899" },
  { emoji: "🚀", bg: "#06B6D4" }, { emoji: "🌟", bg: "#F97316" }, { emoji: "👑", bg: "#84CC16" },
  { emoji: "🦊", bg: "#F97316" }, { emoji: "🎭", bg: "#A855F7" }, { emoji: "🏅", bg: "#14B8A6" },
];

export const WC_TEAMS = [
  { name: "Arabia Saudita",        flag: "🇸🇦", code: "KSA" },
  { name: "Alemania",              flag: "🇩🇪", code: "GER" },
  { name: "Argelia",               flag: "🇩🇿", code: "ALG" },
  { name: "Argentina",             flag: "🇦🇷", code: "ARG" },
  { name: "Australia",             flag: "🇦🇺", code: "AUS" },
  { name: "Austria",               flag: "🇦🇹", code: "AUT" },
  { name: "Bélgica",               flag: "🇧🇪", code: "BEL" },
  { name: "Bosnia y Herzegovina",  flag: "🇧🇦", code: "BIH" },
  { name: "Brasil",                flag: "🇧🇷", code: "BRA" },
  { name: "Cabo Verde",            flag: "🇨🇻", code: "CPV" },
  { name: "Canadá",                flag: "🇨🇦", code: "CAN" },
  { name: "Chequia",               flag: "🇨🇿", code: "CZE" },
  { name: "Colombia",              flag: "🇨🇴", code: "COL" },
  { name: "Congo DR",              flag: "🇨🇩", code: "COD" },
  { name: "Corea del Sur",         flag: "🇰🇷", code: "KOR" },
  { name: "Costa de Marfil",       flag: "🇨🇮", code: "CIV" },
  { name: "Croacia",               flag: "🇭🇷", code: "CRO" },
  { name: "Curazao",               flag: "🇨🇼", code: "CUW" },
  { name: "Ecuador",               flag: "🇪🇨", code: "ECU" },
  { name: "Egipto",                flag: "🇪🇬", code: "EGY" },
  { name: "Escocia",               flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", code: "SCO" },
  { name: "España",                flag: "🇪🇸", code: "ESP" },
  { name: "Estados Unidos",        flag: "🇺🇸", code: "USA" },
  { name: "Francia",               flag: "🇫🇷", code: "FRA" },
  { name: "Ghana",                 flag: "🇬🇭", code: "GHA" },
  { name: "Haití",                 flag: "🇭🇹", code: "HAI" },
  { name: "Inglaterra",            flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG" },
  { name: "Irak",                  flag: "🇮🇶", code: "IRQ" },
  { name: "Irán",                  flag: "🇮🇷", code: "IRN" },
  { name: "Japón",                 flag: "🇯🇵", code: "JPN" },
  { name: "Jordania",              flag: "🇯🇴", code: "JOR" },
  { name: "Marruecos",             flag: "🇲🇦", code: "MAR" },
  { name: "México",                flag: "🇲🇽", code: "MEX" },
  { name: "Noruega",               flag: "🇳🇴", code: "NOR" },
  { name: "Nueva Zelanda",         flag: "🇳🇿", code: "NZL" },
  { name: "Países Bajos",          flag: "🇳🇱", code: "NED" },
  { name: "Panamá",                flag: "🇵🇦", code: "PAN" },
  { name: "Paraguay",              flag: "🇵🇾", code: "PAR" },
  { name: "Portugal",              flag: "🇵🇹", code: "POR" },
  { name: "Qatar",                 flag: "🇶🇦", code: "QAT" },
  { name: "Senegal",               flag: "🇸🇳", code: "SEN" },
  { name: "Sudáfrica",             flag: "🇿🇦", code: "RSA" },
  { name: "Suecia",                flag: "🇸🇪", code: "SWE" },
  { name: "Suiza",                 flag: "🇨🇭", code: "SUI" },
  { name: "Túnez",                 flag: "🇹🇳", code: "TUN" },
  { name: "Turquía",               flag: "🇹🇷", code: "TUR" },
  { name: "Uruguay",               flag: "🇺🇾", code: "URU" },
  { name: "Uzbekistán",            flag: "🇺🇿", code: "UZB" },
] as const;

const TBD = { name: "Por definir", flag: "⬜", code: "TBD" };

export const MATCHES: Match[] = [
  // ── JORNADA 1 ──────────────────────────────────────────────────────────────
  // Jun 11 — Grupo A
  { id:  1, group: "A", num:  1, date: "2026-06-11", time: "15:00", home: { name: "México",              flag: "🇲🇽", code: "MEX" }, away: { name: "Sudáfrica",          flag: "🇿🇦", code: "RSA" }, venue: "Estadio Ciudad de México", city: "Cd. de México" },
  { id:  2, group: "A", num:  2, date: "2026-06-11", time: "22:00", home: { name: "Corea del Sur",       flag: "🇰🇷", code: "KOR" }, away: { name: "Chequia",            flag: "🇨🇿", code: "CZE" }, venue: "Estadio Akron",            city: "Guadalajara"   },
  // Jun 12 — Grupos B y D
  { id:  3, group: "B", num:  3, date: "2026-06-12", time: "15:00", home: { name: "Canadá",              flag: "🇨🇦", code: "CAN" }, away: { name: "Bosnia y Herzegovina",flag: "🇧🇦", code: "BIH" }, venue: "BMO Field",                city: "Toronto"       },
  { id:  4, group: "D", num:  4, date: "2026-06-12", time: "21:00", home: { name: "Estados Unidos",      flag: "🇺🇸", code: "USA" }, away: { name: "Paraguay",           flag: "🇵🇾", code: "PAR" }, venue: "SoFi Stadium",             city: "Los Ángeles"   },
  // Jun 13 — Grupos B, C y D
  { id:  5, group: "B", num:  5, date: "2026-06-13", time: "15:00", home: { name: "Qatar",               flag: "🇶🇦", code: "QAT" }, away: { name: "Suiza",              flag: "🇨🇭", code: "SUI" }, venue: "Levi's Stadium",           city: "Santa Clara"   },
  { id:  6, group: "C", num:  6, date: "2026-06-13", time: "18:00", home: { name: "Brasil",              flag: "🇧🇷", code: "BRA" }, away: { name: "Marruecos",          flag: "🇲🇦", code: "MAR" }, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id:  7, group: "C", num:  7, date: "2026-06-13", time: "21:00", home: { name: "Haití",               flag: "🇭🇹", code: "HAI" }, away: { name: "Escocia",            flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", code: "SCO" }, venue: "Gillette Stadium",         city: "Boston"        },
  // Jun 14 — Grupos D, E y F
  { id:  8, group: "D", num:  8, date: "2026-06-14", time: "00:00", home: { name: "Australia",           flag: "🇦🇺", code: "AUS" }, away: { name: "Turquía",            flag: "🇹🇷", code: "TUR" }, venue: "BC Place",                 city: "Vancouver"     },
  { id:  9, group: "E", num:  9, date: "2026-06-14", time: "13:00", home: { name: "Alemania",            flag: "🇩🇪", code: "GER" }, away: { name: "Curazao",            flag: "🇨🇼", code: "CUW" }, venue: "NRG Stadium",              city: "Houston"       },
  { id: 10, group: "E", num: 10, date: "2026-06-14", time: "19:00", home: { name: "Costa de Marfil",     flag: "🇨🇮", code: "CIV" }, away: { name: "Ecuador",            flag: "🇪🇨", code: "ECU" }, venue: "Lincoln Financial Field",  city: "Filadelfia"    },
  { id: 11, group: "F", num: 11, date: "2026-06-14", time: "16:00", home: { name: "Países Bajos",        flag: "🇳🇱", code: "NED" }, away: { name: "Japón",              flag: "🇯🇵", code: "JPN" }, venue: "AT&T Stadium",             city: "Dallas"        },
  { id: 12, group: "F", num: 12, date: "2026-06-14", time: "22:00", home: { name: "Suecia",              flag: "🇸🇪", code: "SWE" }, away: { name: "Túnez",              flag: "🇹🇳", code: "TUN" }, venue: "Estadio BBVA",             city: "Monterrey"     },
  // Jun 15 — Grupos G y H
  { id: 13, group: "G", num: 13, date: "2026-06-15", time: "15:00", home: { name: "Bélgica",             flag: "🇧🇪", code: "BEL" }, away: { name: "Egipto",             flag: "🇪🇬", code: "EGY" }, venue: "Lumen Field",              city: "Seattle"       },
  { id: 14, group: "G", num: 14, date: "2026-06-15", time: "21:00", home: { name: "Irán",                flag: "🇮🇷", code: "IRN" }, away: { name: "Nueva Zelanda",      flag: "🇳🇿", code: "NZL" }, venue: "SoFi Stadium",             city: "Los Ángeles"   },
  { id: 15, group: "H", num: 15, date: "2026-06-15", time: "12:00", home: { name: "España",              flag: "🇪🇸", code: "ESP" }, away: { name: "Cabo Verde",         flag: "🇨🇻", code: "CPV" }, venue: "Mercedes-Benz Stadium",    city: "Atlanta"       },
  { id: 16, group: "H", num: 16, date: "2026-06-15", time: "18:00", home: { name: "Arabia Saudita",      flag: "🇸🇦", code: "KSA" }, away: { name: "Uruguay",            flag: "🇺🇾", code: "URU" }, venue: "Hard Rock Stadium",        city: "Miami"         },
  // Jun 16 — Grupos I y J (parte)
  { id: 17, group: "I", num: 17, date: "2026-06-16", time: "15:00", home: { name: "Francia",             flag: "🇫🇷", code: "FRA" }, away: { name: "Senegal",            flag: "🇸🇳", code: "SEN" }, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id: 18, group: "I", num: 18, date: "2026-06-16", time: "18:00", home: { name: "Irak",                flag: "🇮🇶", code: "IRQ" }, away: { name: "Noruega",            flag: "🇳🇴", code: "NOR" }, venue: "Gillette Stadium",         city: "Boston"        },
  { id: 19, group: "J", num: 19, date: "2026-06-16", time: "21:00", home: { name: "Argentina",           flag: "🇦🇷", code: "ARG" }, away: { name: "Argelia",            flag: "🇩🇿", code: "ALG" }, venue: "Arrowhead Stadium",        city: "Kansas City"   },
  // Jun 17 — Grupos J, K y L
  { id: 20, group: "J", num: 20, date: "2026-06-17", time: "00:00", home: { name: "Austria",             flag: "🇦🇹", code: "AUT" }, away: { name: "Jordania",           flag: "🇯🇴", code: "JOR" }, venue: "Levi's Stadium",           city: "Santa Clara"   },
  { id: 21, group: "K", num: 21, date: "2026-06-17", time: "13:00", home: { name: "Portugal",            flag: "🇵🇹", code: "POR" }, away: { name: "Congo DR",           flag: "🇨🇩", code: "COD" }, venue: "NRG Stadium",              city: "Houston"       },
  { id: 22, group: "K", num: 22, date: "2026-06-17", time: "22:00", home: { name: "Uzbekistán",          flag: "🇺🇿", code: "UZB" }, away: { name: "Colombia",           flag: "🇨🇴", code: "COL" }, venue: "Estadio Ciudad de México", city: "Cd. de México" },
  { id: 23, group: "L", num: 23, date: "2026-06-17", time: "16:00", home: { name: "Inglaterra",          flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG" }, away: { name: "Croacia",            flag: "🇭🇷", code: "CRO" }, venue: "AT&T Stadium",             city: "Dallas"        },
  { id: 24, group: "L", num: 24, date: "2026-06-17", time: "19:00", home: { name: "Ghana",               flag: "🇬🇭", code: "GHA" }, away: { name: "Panamá",             flag: "🇵🇦", code: "PAN" }, venue: "BMO Field",                city: "Toronto"       },

  // ── JORNADA 2 ──────────────────────────────────────────────────────────────
  // Jun 18 — Grupo A y B
  { id: 25, group: "A", num: 25, date: "2026-06-18", time: "12:00", home: { name: "Chequia",             flag: "🇨🇿", code: "CZE" }, away: { name: "Sudáfrica",          flag: "🇿🇦", code: "RSA" }, venue: "Mercedes-Benz Stadium",    city: "Atlanta"       },
  { id: 26, group: "A", num: 26, date: "2026-06-18", time: "21:00", home: { name: "México",              flag: "🇲🇽", code: "MEX" }, away: { name: "Corea del Sur",      flag: "🇰🇷", code: "KOR" }, venue: "Estadio Akron",            city: "Guadalajara"   },
  { id: 27, group: "B", num: 27, date: "2026-06-18", time: "15:00", home: { name: "Suiza",               flag: "🇨🇭", code: "SUI" }, away: { name: "Bosnia y Herzegovina",flag: "🇧🇦", code: "BIH" }, venue: "SoFi Stadium",             city: "Los Ángeles"   },
  { id: 28, group: "B", num: 28, date: "2026-06-18", time: "18:00", home: { name: "Canadá",              flag: "🇨🇦", code: "CAN" }, away: { name: "Qatar",              flag: "🇶🇦", code: "QAT" }, venue: "BC Place",                 city: "Vancouver"     },
  // Jun 19 — Grupos C y D
  { id: 29, group: "C", num: 29, date: "2026-06-19", time: "18:00", home: { name: "Escocia",             flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", code: "SCO" }, away: { name: "Marruecos",          flag: "🇲🇦", code: "MAR" }, venue: "Gillette Stadium",         city: "Boston"        },
  { id: 30, group: "C", num: 30, date: "2026-06-19", time: "21:00", home: { name: "Brasil",              flag: "🇧🇷", code: "BRA" }, away: { name: "Haití",              flag: "🇭🇹", code: "HAI" }, venue: "Lincoln Financial Field",  city: "Filadelfia"    },
  { id: 31, group: "D", num: 31, date: "2026-06-19", time: "15:00", home: { name: "Estados Unidos",      flag: "🇺🇸", code: "USA" }, away: { name: "Australia",          flag: "🇦🇺", code: "AUS" }, venue: "Lumen Field",              city: "Seattle"       },
  { id: 32, group: "D", num: 32, date: "2026-06-20", time: "00:00", home: { name: "Turquía",             flag: "🇹🇷", code: "TUR" }, away: { name: "Paraguay",           flag: "🇵🇾", code: "PAR" }, venue: "Levi's Stadium",           city: "Santa Clara"   },
  // Jun 20 — Grupos E y F
  { id: 33, group: "E", num: 33, date: "2026-06-20", time: "16:00", home: { name: "Alemania",            flag: "🇩🇪", code: "GER" }, away: { name: "Costa de Marfil",    flag: "🇨🇮", code: "CIV" }, venue: "BMO Field",                city: "Toronto"       },
  { id: 34, group: "E", num: 34, date: "2026-06-20", time: "22:00", home: { name: "Ecuador",             flag: "🇪🇨", code: "ECU" }, away: { name: "Curazao",            flag: "🇨🇼", code: "CUW" }, venue: "Arrowhead Stadium",        city: "Kansas City"   },
  { id: 35, group: "F", num: 35, date: "2026-06-20", time: "13:00", home: { name: "Países Bajos",        flag: "🇳🇱", code: "NED" }, away: { name: "Suecia",             flag: "🇸🇪", code: "SWE" }, venue: "NRG Stadium",              city: "Houston"       },
  { id: 36, group: "F", num: 36, date: "2026-06-21", time: "00:00", home: { name: "Túnez",               flag: "🇹🇳", code: "TUN" }, away: { name: "Japón",              flag: "🇯🇵", code: "JPN" }, venue: "Estadio BBVA",             city: "Monterrey"     },
  // Jun 21 — Grupos G y H
  { id: 37, group: "G", num: 37, date: "2026-06-21", time: "15:00", home: { name: "Bélgica",             flag: "🇧🇪", code: "BEL" }, away: { name: "Irán",               flag: "🇮🇷", code: "IRN" }, venue: "SoFi Stadium",             city: "Los Ángeles"   },
  { id: 38, group: "G", num: 38, date: "2026-06-21", time: "21:00", home: { name: "Nueva Zelanda",       flag: "🇳🇿", code: "NZL" }, away: { name: "Egipto",             flag: "🇪🇬", code: "EGY" }, venue: "BC Place",                 city: "Vancouver"     },
  { id: 39, group: "H", num: 39, date: "2026-06-21", time: "12:00", home: { name: "España",              flag: "🇪🇸", code: "ESP" }, away: { name: "Arabia Saudita",     flag: "🇸🇦", code: "KSA" }, venue: "Mercedes-Benz Stadium",    city: "Atlanta"       },
  { id: 40, group: "H", num: 40, date: "2026-06-21", time: "18:00", home: { name: "Uruguay",             flag: "🇺🇾", code: "URU" }, away: { name: "Cabo Verde",         flag: "🇨🇻", code: "CPV" }, venue: "Hard Rock Stadium",        city: "Miami"         },
  // Jun 22 — Grupos I y J
  { id: 41, group: "I", num: 41, date: "2026-06-22", time: "17:00", home: { name: "Francia",             flag: "🇫🇷", code: "FRA" }, away: { name: "Irak",               flag: "🇮🇶", code: "IRQ" }, venue: "Lincoln Financial Field",  city: "Filadelfia"    },
  { id: 42, group: "I", num: 42, date: "2026-06-22", time: "20:00", home: { name: "Noruega",             flag: "🇳🇴", code: "NOR" }, away: { name: "Senegal",            flag: "🇸🇳", code: "SEN" }, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id: 43, group: "J", num: 43, date: "2026-06-22", time: "13:00", home: { name: "Argentina",           flag: "🇦🇷", code: "ARG" }, away: { name: "Austria",            flag: "🇦🇹", code: "AUT" }, venue: "AT&T Stadium",             city: "Dallas"        },
  { id: 44, group: "J", num: 44, date: "2026-06-22", time: "23:00", home: { name: "Jordania",            flag: "🇯🇴", code: "JOR" }, away: { name: "Argelia",            flag: "🇩🇿", code: "ALG" }, venue: "Levi's Stadium",           city: "Santa Clara"   },
  // Jun 23 — Grupos K y L
  { id: 45, group: "K", num: 45, date: "2026-06-23", time: "13:00", home: { name: "Portugal",            flag: "🇵🇹", code: "POR" }, away: { name: "Uzbekistán",         flag: "🇺🇿", code: "UZB" }, venue: "NRG Stadium",              city: "Houston"       },
  { id: 46, group: "K", num: 46, date: "2026-06-23", time: "22:00", home: { name: "Colombia",            flag: "🇨🇴", code: "COL" }, away: { name: "Congo DR",           flag: "🇨🇩", code: "COD" }, venue: "Estadio Akron",            city: "Guadalajara"   },
  { id: 47, group: "L", num: 47, date: "2026-06-23", time: "16:00", home: { name: "Inglaterra",          flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG" }, away: { name: "Ghana",              flag: "🇬🇭", code: "GHA" }, venue: "Gillette Stadium",         city: "Boston"        },
  { id: 48, group: "L", num: 48, date: "2026-06-23", time: "19:00", home: { name: "Panamá",              flag: "🇵🇦", code: "PAN" }, away: { name: "Croacia",            flag: "🇭🇷", code: "CRO" }, venue: "BMO Field",                city: "Toronto"       },

  // ── JORNADA 3 (simultánea por grupo) ───────────────────────────────────────
  // Jun 24 — Grupos A y B
  { id: 49, group: "A", num: 49, date: "2026-06-24", time: "21:00", home: { name: "Chequia",             flag: "🇨🇿", code: "CZE" }, away: { name: "México",             flag: "🇲🇽", code: "MEX" }, venue: "Estadio Ciudad de México", city: "Cd. de México" },
  { id: 50, group: "A", num: 50, date: "2026-06-24", time: "21:00", home: { name: "Sudáfrica",           flag: "🇿🇦", code: "RSA" }, away: { name: "Corea del Sur",      flag: "🇰🇷", code: "KOR" }, venue: "Estadio BBVA",             city: "Monterrey"     },
  { id: 51, group: "B", num: 51, date: "2026-06-24", time: "15:00", home: { name: "Suiza",               flag: "🇨🇭", code: "SUI" }, away: { name: "Canadá",             flag: "🇨🇦", code: "CAN" }, venue: "BC Place",                 city: "Vancouver"     },
  { id: 52, group: "B", num: 52, date: "2026-06-24", time: "15:00", home: { name: "Bosnia y Herzegovina",flag: "🇧🇦", code: "BIH" }, away: { name: "Qatar",              flag: "🇶🇦", code: "QAT" }, venue: "Lumen Field",              city: "Seattle"       },
  // Jun 24/25 — Grupos C y D
  { id: 53, group: "C", num: 53, date: "2026-06-24", time: "18:00", home: { name: "Escocia",             flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", code: "SCO" }, away: { name: "Brasil",             flag: "🇧🇷", code: "BRA" }, venue: "Hard Rock Stadium",        city: "Miami"         },
  { id: 54, group: "C", num: 54, date: "2026-06-24", time: "18:00", home: { name: "Marruecos",           flag: "🇲🇦", code: "MAR" }, away: { name: "Haití",              flag: "🇭🇹", code: "HAI" }, venue: "Mercedes-Benz Stadium",    city: "Atlanta"       },
  { id: 55, group: "D", num: 55, date: "2026-06-25", time: "22:00", home: { name: "Turquía",             flag: "🇹🇷", code: "TUR" }, away: { name: "Estados Unidos",     flag: "🇺🇸", code: "USA" }, venue: "SoFi Stadium",             city: "Los Ángeles"   },
  { id: 56, group: "D", num: 56, date: "2026-06-25", time: "22:00", home: { name: "Paraguay",            flag: "🇵🇾", code: "PAR" }, away: { name: "Australia",          flag: "🇦🇺", code: "AUS" }, venue: "Levi's Stadium",           city: "Santa Clara"   },
  // Jun 25 — Grupos E y F
  { id: 57, group: "E", num: 57, date: "2026-06-25", time: "16:00", home: { name: "Ecuador",             flag: "🇪🇨", code: "ECU" }, away: { name: "Alemania",           flag: "🇩🇪", code: "GER" }, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id: 58, group: "E", num: 58, date: "2026-06-25", time: "16:00", home: { name: "Curazao",             flag: "🇨🇼", code: "CUW" }, away: { name: "Costa de Marfil",    flag: "🇨🇮", code: "CIV" }, venue: "Lincoln Financial Field",  city: "Filadelfia"    },
  { id: 59, group: "F", num: 59, date: "2026-06-25", time: "19:00", home: { name: "Japón",               flag: "🇯🇵", code: "JPN" }, away: { name: "Suecia",             flag: "🇸🇪", code: "SWE" }, venue: "AT&T Stadium",             city: "Dallas"        },
  { id: 60, group: "F", num: 60, date: "2026-06-25", time: "19:00", home: { name: "Túnez",               flag: "🇹🇳", code: "TUN" }, away: { name: "Países Bajos",       flag: "🇳🇱", code: "NED" }, venue: "Arrowhead Stadium",        city: "Kansas City"   },
  // Jun 26 — Grupos G y H
  { id: 61, group: "G", num: 61, date: "2026-06-26", time: "23:00", home: { name: "Egipto",              flag: "🇪🇬", code: "EGY" }, away: { name: "Irán",               flag: "🇮🇷", code: "IRN" }, venue: "Lumen Field",              city: "Seattle"       },
  { id: 62, group: "G", num: 62, date: "2026-06-26", time: "23:00", home: { name: "Nueva Zelanda",       flag: "🇳🇿", code: "NZL" }, away: { name: "Bélgica",            flag: "🇧🇪", code: "BEL" }, venue: "BC Place",                 city: "Vancouver"     },
  { id: 63, group: "H", num: 63, date: "2026-06-26", time: "20:00", home: { name: "Cabo Verde",          flag: "🇨🇻", code: "CPV" }, away: { name: "Arabia Saudita",     flag: "🇸🇦", code: "KSA" }, venue: "NRG Stadium",              city: "Houston"       },
  { id: 64, group: "H", num: 64, date: "2026-06-26", time: "20:00", home: { name: "Uruguay",             flag: "🇺🇾", code: "URU" }, away: { name: "España",             flag: "🇪🇸", code: "ESP" }, venue: "Estadio Akron",            city: "Guadalajara"   },
  // Jun 26 — Grupos I y J
  { id: 65, group: "I", num: 65, date: "2026-06-26", time: "15:00", home: { name: "Noruega",             flag: "🇳🇴", code: "NOR" }, away: { name: "Francia",            flag: "🇫🇷", code: "FRA" }, venue: "Gillette Stadium",         city: "Boston"        },
  { id: 66, group: "I", num: 66, date: "2026-06-26", time: "15:00", home: { name: "Senegal",             flag: "🇸🇳", code: "SEN" }, away: { name: "Irak",               flag: "🇮🇶", code: "IRQ" }, venue: "BMO Field",                city: "Toronto"       },
  // Jun 27 — Grupos J, K y L
  { id: 67, group: "J", num: 67, date: "2026-06-27", time: "22:00", home: { name: "Argelia",             flag: "🇩🇿", code: "ALG" }, away: { name: "Austria",            flag: "🇦🇹", code: "AUT" }, venue: "Arrowhead Stadium",        city: "Kansas City"   },
  { id: 68, group: "J", num: 68, date: "2026-06-27", time: "22:00", home: { name: "Jordania",            flag: "🇯🇴", code: "JOR" }, away: { name: "Argentina",          flag: "🇦🇷", code: "ARG" }, venue: "AT&T Stadium",             city: "Dallas"        },
  { id: 69, group: "K", num: 69, date: "2026-06-27", time: "19:30", home: { name: "Colombia",            flag: "🇨🇴", code: "COL" }, away: { name: "Portugal",           flag: "🇵🇹", code: "POR" }, venue: "Hard Rock Stadium",        city: "Miami"         },
  { id: 70, group: "K", num: 70, date: "2026-06-27", time: "19:30", home: { name: "Congo DR",            flag: "🇨🇩", code: "COD" }, away: { name: "Uzbekistán",         flag: "🇺🇿", code: "UZB" }, venue: "Mercedes-Benz Stadium",    city: "Atlanta"       },
  { id: 71, group: "L", num: 71, date: "2026-06-27", time: "17:00", home: { name: "Panamá",              flag: "🇵🇦", code: "PAN" }, away: { name: "Inglaterra",         flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG" }, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id: 72, group: "L", num: 72, date: "2026-06-27", time: "17:00", home: { name: "Croacia",             flag: "🇭🇷", code: "CRO" }, away: { name: "Ghana",              flag: "🇬🇭", code: "GHA" }, venue: "Lincoln Financial Field",  city: "Filadelfia"    },

  // ── RONDA DE 32 ────────────────────────────────────────────────────────────
  // Jun 28
  { id:  73, group: "R32", num:  73, date: "2026-06-28", time: "20:00", home: TBD, away: TBD, venue: "SoFi Stadium",             city: "Los Ángeles"   },
  // Jun 29
  { id:  74, group: "R32", num:  74, date: "2026-06-29", time: "14:00", home: TBD, away: TBD, venue: "Gillette Stadium",         city: "Boston"        },
  { id:  75, group: "R32", num:  75, date: "2026-06-29", time: "18:00", home: TBD, away: TBD, venue: "Estadio BBVA",             city: "Monterrey"     },
  { id:  76, group: "R32", num:  76, date: "2026-06-29", time: "22:00", home: TBD, away: TBD, venue: "NRG Stadium",              city: "Houston"       },
  // Jun 30
  { id:  77, group: "R32", num:  77, date: "2026-06-30", time: "14:00", home: TBD, away: TBD, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id:  78, group: "R32", num:  78, date: "2026-06-30", time: "18:00", home: TBD, away: TBD, venue: "AT&T Stadium",             city: "Dallas"        },
  { id:  79, group: "R32", num:  79, date: "2026-06-30", time: "22:00", home: TBD, away: TBD, venue: "Estadio Ciudad de México", city: "Cd. de México" },
  // Jul 1
  { id:  80, group: "R32", num:  80, date: "2026-07-01", time: "14:00", home: TBD, away: TBD, venue: "Mercedes-Benz Stadium",    city: "Atlanta"       },
  { id:  81, group: "R32", num:  81, date: "2026-07-01", time: "18:00", home: TBD, away: TBD, venue: "Levi's Stadium",           city: "Santa Clara"   },
  { id:  82, group: "R32", num:  82, date: "2026-07-01", time: "22:00", home: TBD, away: TBD, venue: "Lumen Field",              city: "Seattle"       },
  // Jul 2
  { id:  83, group: "R32", num:  83, date: "2026-07-02", time: "14:00", home: TBD, away: TBD, venue: "BMO Field",                city: "Toronto"       },
  { id:  84, group: "R32", num:  84, date: "2026-07-02", time: "18:00", home: TBD, away: TBD, venue: "SoFi Stadium",             city: "Los Ángeles"   },
  { id:  85, group: "R32", num:  85, date: "2026-07-02", time: "22:00", home: TBD, away: TBD, venue: "BC Place",                 city: "Vancouver"     },
  // Jul 3
  { id:  86, group: "R32", num:  86, date: "2026-07-03", time: "14:00", home: TBD, away: TBD, venue: "Hard Rock Stadium",        city: "Miami"         },
  { id:  87, group: "R32", num:  87, date: "2026-07-03", time: "18:00", home: TBD, away: TBD, venue: "Arrowhead Stadium",        city: "Kansas City"   },
  { id:  88, group: "R32", num:  88, date: "2026-07-03", time: "22:00", home: TBD, away: TBD, venue: "AT&T Stadium",             city: "Dallas"        },

  // ── OCTAVOS DE FINAL ───────────────────────────────────────────────────────
  // Jul 4
  { id:  89, group: "R16", num:  89, date: "2026-07-04", time: "15:00", home: TBD, away: TBD, venue: "Lincoln Financial Field",  city: "Filadelfia"    },
  { id:  90, group: "R16", num:  90, date: "2026-07-04", time: "19:00", home: TBD, away: TBD, venue: "NRG Stadium",              city: "Houston"       },
  // Jul 5
  { id:  91, group: "R16", num:  91, date: "2026-07-05", time: "15:00", home: TBD, away: TBD, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id:  92, group: "R16", num:  92, date: "2026-07-05", time: "19:00", home: TBD, away: TBD, venue: "Estadio Ciudad de México", city: "Cd. de México" },
  // Jul 6
  { id:  93, group: "R16", num:  93, date: "2026-07-06", time: "15:00", home: TBD, away: TBD, venue: "AT&T Stadium",             city: "Dallas"        },
  { id:  94, group: "R16", num:  94, date: "2026-07-06", time: "19:00", home: TBD, away: TBD, venue: "Lumen Field",              city: "Seattle"       },
  // Jul 7
  { id:  95, group: "R16", num:  95, date: "2026-07-07", time: "15:00", home: TBD, away: TBD, venue: "Mercedes-Benz Stadium",    city: "Atlanta"       },
  { id:  96, group: "R16", num:  96, date: "2026-07-07", time: "19:00", home: TBD, away: TBD, venue: "BC Place",                 city: "Vancouver"     },

  // ── CUARTOS DE FINAL ───────────────────────────────────────────────────────
  { id:  97, group: "QF",  num:  97, date: "2026-07-09", time: "16:00", home: TBD, away: TBD, venue: "Gillette Stadium",         city: "Boston"        },
  { id:  98, group: "QF",  num:  98, date: "2026-07-10", time: "16:00", home: TBD, away: TBD, venue: "SoFi Stadium",             city: "Los Ángeles"   },
  { id:  99, group: "QF",  num:  99, date: "2026-07-11", time: "15:00", home: TBD, away: TBD, venue: "Hard Rock Stadium",        city: "Miami"         },
  { id: 100, group: "QF",  num: 100, date: "2026-07-11", time: "19:00", home: TBD, away: TBD, venue: "Arrowhead Stadium",        city: "Kansas City"   },

  // ── SEMIFINALES ────────────────────────────────────────────────────────────
  { id: 101, group: "SF",  num: 101, date: "2026-07-14", time: "20:00", home: TBD, away: TBD, venue: "AT&T Stadium",             city: "Dallas"        },
  { id: 102, group: "SF",  num: 102, date: "2026-07-15", time: "20:00", home: TBD, away: TBD, venue: "Mercedes-Benz Stadium",    city: "Atlanta"       },

  // ── TERCER PUESTO ──────────────────────────────────────────────────────────
  { id: 103, group: "3P",  num: 103, date: "2026-07-18", time: "16:00", home: TBD, away: TBD, venue: "Hard Rock Stadium",        city: "Miami"         },

  // ── FINAL ──────────────────────────────────────────────────────────────────
  { id: 104, group: "FINAL", num: 104, date: "2026-07-19", time: "16:00", home: TBD, away: TBD, venue: "MetLife Stadium",        city: "Nueva York"    },
];

export const MATCH_DAYS = [
  // Jornada 1
  { date: "2026-06-11", label: "11 Jun" },
  { date: "2026-06-12", label: "12 Jun" },
  { date: "2026-06-13", label: "13 Jun" },
  { date: "2026-06-14", label: "14 Jun" },
  { date: "2026-06-15", label: "15 Jun" },
  { date: "2026-06-16", label: "16 Jun" },
  { date: "2026-06-17", label: "17 Jun" },
  { date: "2026-06-18", label: "18 Jun" },
  // Jornada 2
  { date: "2026-06-19", label: "19 Jun" },
  { date: "2026-06-20", label: "20 Jun" },
  { date: "2026-06-21", label: "21 Jun" },
  { date: "2026-06-22", label: "22 Jun" },
  { date: "2026-06-23", label: "23 Jun" },
  // Jornada 3
  { date: "2026-06-24", label: "24 Jun" },
  { date: "2026-06-25", label: "25 Jun" },
  { date: "2026-06-26", label: "26 Jun" },
  { date: "2026-06-27", label: "27 Jun" },
  // Ronda de 32
  { date: "2026-06-28", label: "28 Jun" },
  { date: "2026-06-29", label: "29 Jun" },
  { date: "2026-06-30", label: "30 Jun" },
  { date: "2026-07-01", label: "1 Jul"  },
  { date: "2026-07-02", label: "2 Jul"  },
  { date: "2026-07-03", label: "3 Jul"  },
  // Octavos de final
  { date: "2026-07-04", label: "4 Jul"  },
  { date: "2026-07-05", label: "5 Jul"  },
  { date: "2026-07-06", label: "6 Jul"  },
  { date: "2026-07-07", label: "7 Jul"  },
  // Cuartos de final
  { date: "2026-07-09", label: "9 Jul"  },
  { date: "2026-07-10", label: "10 Jul" },
  { date: "2026-07-11", label: "11 Jul" },
  // Semis
  { date: "2026-07-14", label: "14 Jul" },
  { date: "2026-07-15", label: "15 Jul" },
  // Tercer puesto y Final
  { date: "2026-07-18", label: "18 Jul" },
  { date: "2026-07-19", label: "19 Jul" },
];

export const WC_GROUPS: Record<string, TeamStanding[]> = {
  A: [
    { name: "México",        flag: "🇲🇽", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Sudáfrica",     flag: "🇿🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Corea del Sur", flag: "🇰🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Chequia",       flag: "🇨🇿", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  B: [
    { name: "Canadá",              flag: "🇨🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Bosnia y Herzegovina",flag: "🇧🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Suiza",               flag: "🇨🇭", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Qatar",               flag: "🇶🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  C: [
    { name: "Brasil",    flag: "🇧🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Marruecos", flag: "🇲🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Haití",     flag: "🇭🇹", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Escocia",   flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  D: [
    { name: "Estados Unidos", flag: "🇺🇸", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Paraguay",       flag: "🇵🇾", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Australia",      flag: "🇦🇺", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Turquía",        flag: "🇹🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  E: [
    { name: "Alemania",        flag: "🇩🇪", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Curazao",         flag: "🇨🇼", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Costa de Marfil", flag: "🇨🇮", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Ecuador",         flag: "🇪🇨", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  F: [
    { name: "Países Bajos", flag: "🇳🇱", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Japón",        flag: "🇯🇵", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Suecia",       flag: "🇸🇪", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Túnez",        flag: "🇹🇳", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  G: [
    { name: "Bélgica",      flag: "🇧🇪", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Egipto",       flag: "🇪🇬", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Irán",         flag: "🇮🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Nueva Zelanda",flag: "🇳🇿", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  H: [
    { name: "España",        flag: "🇪🇸", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Cabo Verde",    flag: "🇨🇻", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Arabia Saudita",flag: "🇸🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Uruguay",       flag: "🇺🇾", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  I: [
    { name: "Francia",  flag: "🇫🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Senegal",  flag: "🇸🇳", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Irak",     flag: "🇮🇶", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Noruega",  flag: "🇳🇴", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  J: [
    { name: "Argentina", flag: "🇦🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Argelia",   flag: "🇩🇿", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Austria",   flag: "🇦🇹", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Jordania",  flag: "🇯🇴", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  K: [
    { name: "Portugal",   flag: "🇵🇹", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Congo DR",   flag: "🇨🇩", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Uzbekistán", flag: "🇺🇿", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Colombia",   flag: "🇨🇴", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  L: [
    { name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Croacia",    flag: "🇭🇷",    pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Ghana",      flag: "🇬🇭",    pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Panamá",     flag: "🇵🇦",    pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
};

export const CHAMPIONS: Champion[] = [
  { year: 2022, host: "Qatar",       winner: { name: "Argentina",  flag: "🇦🇷" }, runnerUp: "Francia",      score: "3-3 (4-2 pen.)" },
  { year: 2018, host: "Rusia",       winner: { name: "Francia",    flag: "🇫🇷" }, runnerUp: "Croacia",       score: "4-2" },
  { year: 2014, host: "Brasil",      winner: { name: "Alemania",   flag: "🇩🇪" }, runnerUp: "Argentina",     score: "1-0 t.e." },
  { year: 2010, host: "Sudáfrica",   winner: { name: "España",     flag: "🇪🇸" }, runnerUp: "Países Bajos",  score: "1-0 t.e." },
  { year: 2006, host: "Alemania",    winner: { name: "Italia",     flag: "🇮🇹" }, runnerUp: "Francia",       score: "1-1 (5-3 pen.)" },
  { year: 2002, host: "Corea/Japón", winner: { name: "Brasil",     flag: "🇧🇷" }, runnerUp: "Alemania",      score: "2-0" },
  { year: 1998, host: "Francia",     winner: { name: "Francia",    flag: "🇫🇷" }, runnerUp: "Brasil",        score: "3-0" },
  { year: 1994, host: "EE. UU.",     winner: { name: "Brasil",     flag: "🇧🇷" }, runnerUp: "Italia",        score: "0-0 (3-2 pen.)" },
];

export const PALMARES = [
  { flag: "🇧🇷", name: "Brasil",      titles: 5 },
  { flag: "🇩🇪", name: "Alemania",    titles: 4 },
  { flag: "🇮🇹", name: "Italia",      titles: 4 },
  { flag: "🇦🇷", name: "Argentina",   titles: 3 },
  { flag: "🇫🇷", name: "Francia",     titles: 2 },
  { flag: "🇺🇾", name: "Uruguay",     titles: 2 },
  { flag: "🇪🇸", name: "España",      titles: 1 },
  { flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", name: "Inglaterra",  titles: 1 },
];

export const DEMO_MESSAGES = [
  { id: 1, user: "Rodri",    avatar: { emoji: "🦁", bg: "#F97316" }, content: "¡Ya quiero que empiece el mundial! Faltan 35 días",                                                                                  time: "14:28", type: "user" as const },
  { id: 2, user: "Atlas IA", avatar: { emoji: "🤖", bg: "#F97316" }, content: "¡35 días exactos! Argentina llega como campeona defensora 🏆 ¿Quieren que analice a sus rivales del Grupo J?",                        time: "14:29", type: "atlas" as const },
  { id: 3, user: "Caro",     avatar: { emoji: "🌟", bg: "#3B82F6" }, content: "A ver Atlas, ¿quién gana el mundial?",                                                                                                   time: "14:31", type: "user" as const },
  { id: 4, user: "Atlas IA", avatar: { emoji: "🤖", bg: "#F97316" }, content: "Si te digo que Brasil, me creen. Si te digo Argentina, hay lío. Mi análisis: Francia tiene el mejor plantel pero México tiene el corazón 🔥", time: "14:31", type: "atlas" as const },
  { id: 5, user: "Javi",     avatar: { emoji: "⚡", bg: "#EF4444" }, content: "México va a reventar ese Estadio Azteca 🇲🇽🇲🇽🇲🇽",                                                                                    time: "14:33", type: "user" as const },
];
