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
  { name: "Alemania",        flag: "🇩🇪", code: "GER" },
  { name: "Arabia Saudita",  flag: "🇸🇦", code: "KSA" },
  { name: "Argelia",         flag: "🇩🇿", code: "ALG" },
  { name: "Argentina",       flag: "🇦🇷", code: "ARG" },
  { name: "Australia",       flag: "🇦🇺", code: "AUS" },
  { name: "Austria",         flag: "🇦🇹", code: "AUT" },
  { name: "Bélgica",         flag: "🇧🇪", code: "BEL" },
  { name: "Bolivia",         flag: "🇧🇴", code: "BOL" },
  { name: "Brasil",          flag: "🇧🇷", code: "BRA" },
  { name: "Camerún",         flag: "🇨🇲", code: "CMR" },
  { name: "Canadá",          flag: "🇨🇦", code: "CAN" },
  { name: "Colombia",        flag: "🇨🇴", code: "COL" },
  { name: "Congo DR",        flag: "🇨🇩", code: "COD" },
  { name: "Corea del Sur",   flag: "🇰🇷", code: "KOR" },
  { name: "Costa de Marfil", flag: "🇨🇮", code: "CIV" },
  { name: "Croacia",         flag: "🇭🇷", code: "CRO" },
  { name: "Curazao",         flag: "🇨🇼", code: "CUW" },
  { name: "Dinamarca",       flag: "🇩🇰", code: "DEN" },
  { name: "Ecuador",         flag: "🇪🇨", code: "ECU" },
  { name: "Egipto",          flag: "🇪🇬", code: "EGY" },
  { name: "España",          flag: "🇪🇸", code: "ESP" },
  { name: "Estados Unidos",  flag: "🇺🇸", code: "USA" },
  { name: "Francia",         flag: "🇫🇷", code: "FRA" },
  { name: "Ghana",           flag: "🇬🇭", code: "GHA" },
  { name: "Honduras",        flag: "🇭🇳", code: "HON" },
  { name: "Indonesia",       flag: "🇮🇩", code: "IDN" },
  { name: "Inglaterra",      flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG" },
  { name: "Irak",            flag: "🇮🇶", code: "IRQ" },
  { name: "Irán",            flag: "🇮🇷", code: "IRN" },
  { name: "Italia",          flag: "🇮🇹", code: "ITA" },
  { name: "Jamaica",         flag: "🇯🇲", code: "JAM" },
  { name: "Japón",           flag: "🇯🇵", code: "JPN" },
  { name: "Jordania",        flag: "🇯🇴", code: "JOR" },
  { name: "Marruecos",       flag: "🇲🇦", code: "MAR" },
  { name: "México",          flag: "🇲🇽", code: "MEX" },
  { name: "Nigeria",         flag: "🇳🇬", code: "NGA" },
  { name: "Nueva Zelanda",   flag: "🇳🇿", code: "NZL" },
  { name: "Países Bajos",    flag: "🇳🇱", code: "NED" },
  { name: "Panamá",          flag: "🇵🇦", code: "PAN" },
  { name: "Paraguay",        flag: "🇵🇾", code: "PAR" },
  { name: "Polonia",         flag: "🇵🇱", code: "POL" },
  { name: "Portugal",        flag: "🇵🇹", code: "POR" },
  { name: "Qatar",           flag: "🇶🇦", code: "QAT" },
  { name: "Senegal",         flag: "🇸🇳", code: "SEN" },
  { name: "Serbia",          flag: "🇷🇸", code: "SRB" },
  { name: "Sudáfrica",       flag: "🇿🇦", code: "RSA" },
  { name: "Suiza",           flag: "🇨🇭", code: "SUI" },
  { name: "Turquía",         flag: "🇹🇷", code: "TUR" },
  { name: "Uruguay",         flag: "🇺🇾", code: "URU" },
] as const;

const TBD = { name: "Por definir", flag: "⬜", code: "TBD" };

export const MATCHES: Match[] = [
  // ── JORNADA 1 ──────────────────────────────────────────────────────────────
  // Jun 11
  { id:  1, group: "A", num:  1, date: "2026-06-11", time: "13:00", home: { name: "México",        flag: "🇲🇽", code: "MEX" }, away: { name: "Sudáfrica",      flag: "🇿🇦", code: "RSA" }, venue: "Estadio Ciudad de México", city: "Cd. de México"  },
  { id:  2, group: "B", num:  2, date: "2026-06-11", time: "16:00", home: { name: "Qatar",          flag: "🇶🇦", code: "QAT" }, away: { name: "Suiza",          flag: "🇨🇭", code: "SUI" }, venue: "AT&T Stadium",             city: "Dallas"         },
  { id:  3, group: "A", num:  3, date: "2026-06-11", time: "20:00", home: { name: "Corea del Sur",  flag: "🇰🇷", code: "KOR" }, away: { name: "Polonia",        flag: "🇵🇱", code: "POL" }, venue: "Estadio Guadalajara",      city: "Guadalajara"    },
  // Jun 12
  { id:  4, group: "C", num:  4, date: "2026-06-12", time: "13:00", home: { name: "Argentina",      flag: "🇦🇷", code: "ARG" }, away: { name: "Argelia",        flag: "🇩🇿", code: "ALG" }, venue: "MetLife Stadium",          city: "Nueva York"     },
  { id:  5, group: "D", num:  5, date: "2026-06-12", time: "16:00", home: { name: "Francia",        flag: "🇫🇷", code: "FRA" }, away: { name: "Senegal",        flag: "🇸🇳", code: "SEN" }, venue: "SoFi Stadium",             city: "Los Ángeles"    },
  { id:  6, group: "B", num:  6, date: "2026-06-12", time: "20:00", home: { name: "Brasil",         flag: "🇧🇷", code: "BRA" }, away: { name: "Marruecos",      flag: "🇲🇦", code: "MAR" }, venue: "Levi's Stadium",           city: "San Francisco"  },
  // Jun 13
  { id:  7, group: "C", num:  7, date: "2026-06-13", time: "13:00", home: { name: "Austria",        flag: "🇦🇹", code: "AUT" }, away: { name: "Jordania",       flag: "🇯🇴", code: "JOR" }, venue: "Rose Bowl",                city: "Los Ángeles"    },
  { id:  8, group: "E", num:  8, date: "2026-06-13", time: "16:00", home: { name: "Alemania",       flag: "🇩🇪", code: "GER" }, away: { name: "Curazao",        flag: "🇨🇼", code: "CUW" }, venue: "Estadio Ciudad de México", city: "Cd. de México"  },
  { id:  9, group: "F", num:  9, date: "2026-06-13", time: "20:00", home: { name: "Países Bajos",   flag: "🇳🇱", code: "NED" }, away: { name: "Japón",          flag: "🇯🇵", code: "JPN" }, venue: "BC Place",                 city: "Vancouver"      },
  // Jun 14
  { id: 10, group: "D", num: 10, date: "2026-06-14", time: "13:00", home: { name: "Portugal",       flag: "🇵🇹", code: "POR" }, away: { name: "Ghana",          flag: "🇬🇭", code: "GHA" }, venue: "Gillette Stadium",         city: "Boston"         },
  { id: 11, group: "F", num: 11, date: "2026-06-14", time: "16:00", home: { name: "España",         flag: "🇪🇸", code: "ESP" }, away: { name: "Camerún",        flag: "🇨🇲", code: "CMR" }, venue: "Estadio Azteca",           city: "Cd. de México"  },
  { id: 12, group: "E", num: 12, date: "2026-06-14", time: "20:00", home: { name: "Ecuador",        flag: "🇪🇨", code: "ECU" }, away: { name: "Costa de Marfil",flag: "🇨🇮", code: "CIV" }, venue: "Arrowhead Stadium",        city: "Kansas City"    },
  // Jun 15
  { id: 13, group: "G", num: 13, date: "2026-06-15", time: "13:00", home: { name: "Estados Unidos", flag: "🇺🇸", code: "USA" }, away: { name: "Colombia",       flag: "🇨🇴", code: "COL" }, venue: "SoFi Stadium",             city: "Los Ángeles"    },
  { id: 14, group: "G", num: 14, date: "2026-06-15", time: "16:00", home: { name: "Uruguay",        flag: "🇺🇾", code: "URU" }, away: { name: "Panamá",         flag: "🇵🇦", code: "PAN" }, venue: "AT&T Stadium",             city: "Dallas"         },
  { id: 15, group: "H", num: 15, date: "2026-06-15", time: "20:00", home: { name: "Inglaterra",     flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG" }, away: { name: "Australia",      flag: "🇦🇺", code: "AUS" }, venue: "MetLife Stadium",          city: "Nueva York"     },
  // Jun 16
  { id: 16, group: "H", num: 16, date: "2026-06-16", time: "13:00", home: { name: "Nigeria",        flag: "🇳🇬", code: "NGA" }, away: { name: "Jamaica",        flag: "🇯🇲", code: "JAM" }, venue: "Rose Bowl",                city: "Los Ángeles"    },
  { id: 17, group: "I", num: 17, date: "2026-06-16", time: "16:00", home: { name: "Italia",         flag: "🇮🇹", code: "ITA" }, away: { name: "Canadá",         flag: "🇨🇦", code: "CAN" }, venue: "Hard Rock Stadium",        city: "Miami"          },
  { id: 18, group: "I", num: 18, date: "2026-06-16", time: "20:00", home: { name: "Honduras",       flag: "🇭🇳", code: "HON" }, away: { name: "Arabia Saudita", flag: "🇸🇦", code: "KSA" }, venue: "Arrowhead Stadium",        city: "Kansas City"    },
  // Jun 17
  { id: 19, group: "J", num: 19, date: "2026-06-17", time: "13:00", home: { name: "Bélgica",        flag: "🇧🇪", code: "BEL" }, away: { name: "Croacia",        flag: "🇭🇷", code: "CRO" }, venue: "Levi's Stadium",           city: "San Francisco"  },
  { id: 20, group: "J", num: 20, date: "2026-06-17", time: "16:00", home: { name: "Irán",           flag: "🇮🇷", code: "IRN" }, away: { name: "Indonesia",      flag: "🇮🇩", code: "IDN" }, venue: "BC Place",                 city: "Vancouver"      },
  { id: 21, group: "K", num: 21, date: "2026-06-17", time: "20:00", home: { name: "Turquía",        flag: "🇹🇷", code: "TUR" }, away: { name: "Serbia",         flag: "🇷🇸", code: "SRB" }, venue: "Estadio Azteca",           city: "Cd. de México"  },
  // Jun 18
  { id: 22, group: "K", num: 22, date: "2026-06-18", time: "13:00", home: { name: "Egipto",         flag: "🇪🇬", code: "EGY" }, away: { name: "Irak",           flag: "🇮🇶", code: "IRQ" }, venue: "Estadio Guadalajara",      city: "Guadalajara"    },
  { id: 23, group: "L", num: 23, date: "2026-06-18", time: "16:00", home: { name: "Dinamarca",      flag: "🇩🇰", code: "DEN" }, away: { name: "Paraguay",       flag: "🇵🇾", code: "PAR" }, venue: "AT&T Stadium",             city: "Dallas"         },
  { id: 24, group: "L", num: 24, date: "2026-06-18", time: "20:00", home: { name: "Congo DR",       flag: "🇨🇩", code: "COD" }, away: { name: "Nueva Zelanda",  flag: "🇳🇿", code: "NZL" }, venue: "BMO Field",                city: "Toronto"        },

  // ── JORNADA 2 ──────────────────────────────────────────────────────────────
  // Jun 19
  { id: 25, group: "A", num: 25, date: "2026-06-19", time: "13:00", home: { name: "México",         flag: "🇲🇽", code: "MEX" }, away: { name: "Corea del Sur",  flag: "🇰🇷", code: "KOR" }, venue: "Estadio Azteca",           city: "Cd. de México"  },
  { id: 26, group: "A", num: 26, date: "2026-06-19", time: "16:00", home: { name: "Sudáfrica",      flag: "🇿🇦", code: "RSA" }, away: { name: "Polonia",        flag: "🇵🇱", code: "POL" }, venue: "Estadio Ciudad de México", city: "Cd. de México"  },
  { id: 27, group: "B", num: 27, date: "2026-06-19", time: "20:00", home: { name: "Brasil",         flag: "🇧🇷", code: "BRA" }, away: { name: "Qatar",          flag: "🇶🇦", code: "QAT" }, venue: "MetLife Stadium",          city: "Nueva York"     },
  // Jun 20
  { id: 28, group: "B", num: 28, date: "2026-06-20", time: "13:00", home: { name: "Marruecos",      flag: "🇲🇦", code: "MAR" }, away: { name: "Suiza",          flag: "🇨🇭", code: "SUI" }, venue: "SoFi Stadium",             city: "Los Ángeles"    },
  { id: 29, group: "C", num: 29, date: "2026-06-20", time: "16:00", home: { name: "Argentina",      flag: "🇦🇷", code: "ARG" }, away: { name: "Austria",        flag: "🇦🇹", code: "AUT" }, venue: "Gillette Stadium",         city: "Boston"         },
  { id: 30, group: "C", num: 30, date: "2026-06-20", time: "20:00", home: { name: "Argelia",        flag: "🇩🇿", code: "ALG" }, away: { name: "Jordania",       flag: "🇯🇴", code: "JOR" }, venue: "AT&T Stadium",             city: "Dallas"         },
  // Jun 21
  { id: 31, group: "D", num: 31, date: "2026-06-21", time: "13:00", home: { name: "Francia",        flag: "🇫🇷", code: "FRA" }, away: { name: "Portugal",       flag: "🇵🇹", code: "POR" }, venue: "MetLife Stadium",          city: "Nueva York"     },
  { id: 32, group: "D", num: 32, date: "2026-06-21", time: "16:00", home: { name: "Senegal",        flag: "🇸🇳", code: "SEN" }, away: { name: "Ghana",          flag: "🇬🇭", code: "GHA" }, venue: "Arrowhead Stadium",        city: "Kansas City"    },
  { id: 33, group: "E", num: 33, date: "2026-06-21", time: "20:00", home: { name: "Alemania",       flag: "🇩🇪", code: "GER" }, away: { name: "Ecuador",        flag: "🇪🇨", code: "ECU" }, venue: "BC Place",                 city: "Vancouver"      },
  // Jun 22
  { id: 34, group: "E", num: 34, date: "2026-06-22", time: "13:00", home: { name: "Curazao",        flag: "🇨🇼", code: "CUW" }, away: { name: "Costa de Marfil",flag: "🇨🇮", code: "CIV" }, venue: "Rose Bowl",                city: "Los Ángeles"    },
  { id: 35, group: "F", num: 35, date: "2026-06-22", time: "16:00", home: { name: "Países Bajos",   flag: "🇳🇱", code: "NED" }, away: { name: "España",         flag: "🇪🇸", code: "ESP" }, venue: "Levi's Stadium",           city: "San Francisco"  },
  { id: 36, group: "F", num: 36, date: "2026-06-22", time: "20:00", home: { name: "Japón",          flag: "🇯🇵", code: "JPN" }, away: { name: "Camerún",        flag: "🇨🇲", code: "CMR" }, venue: "Estadio Guadalajara",      city: "Guadalajara"    },
  // Jun 23
  { id: 37, group: "G", num: 37, date: "2026-06-23", time: "13:00", home: { name: "Estados Unidos", flag: "🇺🇸", code: "USA" }, away: { name: "Uruguay",        flag: "🇺🇾", code: "URU" }, venue: "SoFi Stadium",             city: "Los Ángeles"    },
  { id: 38, group: "G", num: 38, date: "2026-06-23", time: "16:00", home: { name: "Colombia",       flag: "🇨🇴", code: "COL" }, away: { name: "Panamá",         flag: "🇵🇦", code: "PAN" }, venue: "AT&T Stadium",             city: "Dallas"         },
  { id: 39, group: "H", num: 39, date: "2026-06-23", time: "20:00", home: { name: "Inglaterra",     flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG" }, away: { name: "Nigeria",        flag: "🇳🇬", code: "NGA" }, venue: "MetLife Stadium",          city: "Nueva York"     },
  // Jun 24
  { id: 40, group: "H", num: 40, date: "2026-06-24", time: "13:00", home: { name: "Australia",      flag: "🇦🇺", code: "AUS" }, away: { name: "Jamaica",        flag: "🇯🇲", code: "JAM" }, venue: "Hard Rock Stadium",        city: "Miami"          },
  { id: 41, group: "I", num: 41, date: "2026-06-24", time: "16:00", home: { name: "Italia",         flag: "🇮🇹", code: "ITA" }, away: { name: "Honduras",       flag: "🇭🇳", code: "HON" }, venue: "Levi's Stadium",           city: "San Francisco"  },
  { id: 42, group: "I", num: 42, date: "2026-06-24", time: "20:00", home: { name: "Canadá",         flag: "🇨🇦", code: "CAN" }, away: { name: "Arabia Saudita", flag: "🇸🇦", code: "KSA" }, venue: "BC Place",                 city: "Vancouver"      },
  // Jun 25
  { id: 43, group: "J", num: 43, date: "2026-06-25", time: "13:00", home: { name: "Bélgica",        flag: "🇧🇪", code: "BEL" }, away: { name: "Irán",           flag: "🇮🇷", code: "IRN" }, venue: "AT&T Stadium",             city: "Dallas"         },
  { id: 44, group: "J", num: 44, date: "2026-06-25", time: "16:00", home: { name: "Croacia",        flag: "🇭🇷", code: "CRO" }, away: { name: "Indonesia",      flag: "🇮🇩", code: "IDN" }, venue: "Arrowhead Stadium",        city: "Kansas City"    },
  { id: 45, group: "K", num: 45, date: "2026-06-25", time: "20:00", home: { name: "Turquía",        flag: "🇹🇷", code: "TUR" }, away: { name: "Egipto",         flag: "🇪🇬", code: "EGY" }, venue: "Estadio Azteca",           city: "Cd. de México"  },
  // Jun 26
  { id: 46, group: "K", num: 46, date: "2026-06-26", time: "13:00", home: { name: "Serbia",         flag: "🇷🇸", code: "SRB" }, away: { name: "Irak",           flag: "🇮🇶", code: "IRQ" }, venue: "Estadio Ciudad de México", city: "Cd. de México"  },
  { id: 47, group: "L", num: 47, date: "2026-06-26", time: "16:00", home: { name: "Dinamarca",      flag: "🇩🇰", code: "DEN" }, away: { name: "Congo DR",       flag: "🇨🇩", code: "COD" }, venue: "MetLife Stadium",          city: "Nueva York"     },
  { id: 48, group: "L", num: 48, date: "2026-06-26", time: "20:00", home: { name: "Paraguay",       flag: "🇵🇾", code: "PAR" }, away: { name: "Nueva Zelanda",  flag: "🇳🇿", code: "NZL" }, venue: "SoFi Stadium",             city: "Los Ángeles"    },

  // ── JORNADA 3 (simultánea por grupo) ───────────────────────────────────────
  // Jun 28 — Grupos A y B
  { id: 49, group: "A", num: 49, date: "2026-06-28", time: "16:00", home: { name: "México",         flag: "🇲🇽", code: "MEX" }, away: { name: "Polonia",        flag: "🇵🇱", code: "POL" }, venue: "Estadio Azteca",           city: "Cd. de México"  },
  { id: 50, group: "A", num: 50, date: "2026-06-28", time: "16:00", home: { name: "Sudáfrica",      flag: "🇿🇦", code: "RSA" }, away: { name: "Corea del Sur",  flag: "🇰🇷", code: "KOR" }, venue: "Estadio Ciudad de México", city: "Cd. de México"  },
  { id: 51, group: "B", num: 51, date: "2026-06-28", time: "20:00", home: { name: "Brasil",         flag: "🇧🇷", code: "BRA" }, away: { name: "Suiza",          flag: "🇨🇭", code: "SUI" }, venue: "MetLife Stadium",          city: "Nueva York"     },
  { id: 52, group: "B", num: 52, date: "2026-06-28", time: "20:00", home: { name: "Qatar",          flag: "🇶🇦", code: "QAT" }, away: { name: "Marruecos",      flag: "🇲🇦", code: "MAR" }, venue: "AT&T Stadium",             city: "Dallas"         },
  // Jun 29 — Grupos C y D
  { id: 53, group: "C", num: 53, date: "2026-06-29", time: "16:00", home: { name: "Argentina",      flag: "🇦🇷", code: "ARG" }, away: { name: "Jordania",       flag: "🇯🇴", code: "JOR" }, venue: "SoFi Stadium",             city: "Los Ángeles"    },
  { id: 54, group: "C", num: 54, date: "2026-06-29", time: "16:00", home: { name: "Austria",        flag: "🇦🇹", code: "AUT" }, away: { name: "Argelia",        flag: "🇩🇿", code: "ALG" }, venue: "Gillette Stadium",         city: "Boston"         },
  { id: 55, group: "D", num: 55, date: "2026-06-29", time: "20:00", home: { name: "Francia",        flag: "🇫🇷", code: "FRA" }, away: { name: "Ghana",          flag: "🇬🇭", code: "GHA" }, venue: "Levi's Stadium",           city: "San Francisco"  },
  { id: 56, group: "D", num: 56, date: "2026-06-29", time: "20:00", home: { name: "Portugal",       flag: "🇵🇹", code: "POR" }, away: { name: "Senegal",        flag: "🇸🇳", code: "SEN" }, venue: "BC Place",                 city: "Vancouver"      },
  // Jun 30 — Grupos E y F
  { id: 57, group: "E", num: 57, date: "2026-06-30", time: "16:00", home: { name: "Alemania",       flag: "🇩🇪", code: "GER" }, away: { name: "Costa de Marfil",flag: "🇨🇮", code: "CIV" }, venue: "Estadio Guadalajara",      city: "Guadalajara"    },
  { id: 58, group: "E", num: 58, date: "2026-06-30", time: "16:00", home: { name: "Ecuador",        flag: "🇪🇨", code: "ECU" }, away: { name: "Curazao",        flag: "🇨🇼", code: "CUW" }, venue: "Arrowhead Stadium",        city: "Kansas City"    },
  { id: 59, group: "F", num: 59, date: "2026-06-30", time: "20:00", home: { name: "Países Bajos",   flag: "🇳🇱", code: "NED" }, away: { name: "Camerún",        flag: "🇨🇲", code: "CMR" }, venue: "Rose Bowl",                city: "Los Ángeles"    },
  { id: 60, group: "F", num: 60, date: "2026-06-30", time: "20:00", home: { name: "España",         flag: "🇪🇸", code: "ESP" }, away: { name: "Japón",          flag: "🇯🇵", code: "JPN" }, venue: "Hard Rock Stadium",        city: "Miami"          },
  // Jul 1 — Grupos G y H
  { id: 61, group: "G", num: 61, date: "2026-07-01", time: "16:00", home: { name: "Estados Unidos", flag: "🇺🇸", code: "USA" }, away: { name: "Panamá",         flag: "🇵🇦", code: "PAN" }, venue: "AT&T Stadium",             city: "Dallas"         },
  { id: 62, group: "G", num: 62, date: "2026-07-01", time: "16:00", home: { name: "Colombia",       flag: "🇨🇴", code: "COL" }, away: { name: "Uruguay",        flag: "🇺🇾", code: "URU" }, venue: "SoFi Stadium",             city: "Los Ángeles"    },
  { id: 63, group: "H", num: 63, date: "2026-07-01", time: "20:00", home: { name: "Inglaterra",     flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", code: "ENG" }, away: { name: "Jamaica",        flag: "🇯🇲", code: "JAM" }, venue: "MetLife Stadium",          city: "Nueva York"     },
  { id: 64, group: "H", num: 64, date: "2026-07-01", time: "20:00", home: { name: "Australia",      flag: "🇦🇺", code: "AUS" }, away: { name: "Nigeria",        flag: "🇳🇬", code: "NGA" }, venue: "BC Place",                 city: "Vancouver"      },
  // Jul 2 — Grupos I y J
  { id: 65, group: "I", num: 65, date: "2026-07-02", time: "16:00", home: { name: "Italia",         flag: "🇮🇹", code: "ITA" }, away: { name: "Arabia Saudita", flag: "🇸🇦", code: "KSA" }, venue: "Estadio Azteca",           city: "Cd. de México"  },
  { id: 66, group: "I", num: 66, date: "2026-07-02", time: "16:00", home: { name: "Canadá",         flag: "🇨🇦", code: "CAN" }, away: { name: "Honduras",       flag: "🇭🇳", code: "HON" }, venue: "Gillette Stadium",         city: "Boston"         },
  { id: 67, group: "J", num: 67, date: "2026-07-02", time: "20:00", home: { name: "Bélgica",        flag: "🇧🇪", code: "BEL" }, away: { name: "Indonesia",      flag: "🇮🇩", code: "IDN" }, venue: "AT&T Stadium",             city: "Dallas"         },
  { id: 68, group: "J", num: 68, date: "2026-07-02", time: "20:00", home: { name: "Croacia",        flag: "🇭🇷", code: "CRO" }, away: { name: "Irán",           flag: "🇮🇷", code: "IRN" }, venue: "Levi's Stadium",           city: "San Francisco"  },
  // Jul 3 — Grupos K y L
  { id: 69, group: "K", num: 69, date: "2026-07-03", time: "16:00", home: { name: "Turquía",        flag: "🇹🇷", code: "TUR" }, away: { name: "Irak",           flag: "🇮🇶", code: "IRQ" }, venue: "Estadio Ciudad de México", city: "Cd. de México"  },
  { id: 70, group: "K", num: 70, date: "2026-07-03", time: "16:00", home: { name: "Serbia",         flag: "🇷🇸", code: "SRB" }, away: { name: "Egipto",         flag: "🇪🇬", code: "EGY" }, venue: "Rose Bowl",                city: "Los Ángeles"    },
  { id: 71, group: "L", num: 71, date: "2026-07-03", time: "20:00", home: { name: "Dinamarca",      flag: "🇩🇰", code: "DEN" }, away: { name: "Nueva Zelanda",  flag: "🇳🇿", code: "NZL" }, venue: "BC Place",                 city: "Vancouver"      },
  { id: 72, group: "L", num: 72, date: "2026-07-03", time: "20:00", home: { name: "Paraguay",       flag: "🇵🇾", code: "PAR" }, away: { name: "Congo DR",       flag: "🇨🇩", code: "COD" }, venue: "Arrowhead Stadium",        city: "Kansas City"    },

  // ── OCTAVOS DE FINAL ───────────────────────────────────────────────────────
  { id: 73,  group: "R32", num: 73,  date: "2026-07-05", time: "13:00", home: TBD, away: TBD, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id: 74,  group: "R32", num: 74,  date: "2026-07-05", time: "20:00", home: TBD, away: TBD, venue: "SoFi Stadium",             city: "Los Ángeles"   },
  { id: 75,  group: "R32", num: 75,  date: "2026-07-06", time: "13:00", home: TBD, away: TBD, venue: "AT&T Stadium",             city: "Dallas"        },
  { id: 76,  group: "R32", num: 76,  date: "2026-07-06", time: "20:00", home: TBD, away: TBD, venue: "Estadio Azteca",           city: "Cd. de México" },
  { id: 77,  group: "R32", num: 77,  date: "2026-07-07", time: "13:00", home: TBD, away: TBD, venue: "Gillette Stadium",         city: "Boston"        },
  { id: 78,  group: "R32", num: 78,  date: "2026-07-07", time: "20:00", home: TBD, away: TBD, venue: "BC Place",                 city: "Vancouver"     },
  { id: 79,  group: "R32", num: 79,  date: "2026-07-08", time: "13:00", home: TBD, away: TBD, venue: "Levi's Stadium",           city: "San Francisco" },
  { id: 80,  group: "R32", num: 80,  date: "2026-07-08", time: "20:00", home: TBD, away: TBD, venue: "Rose Bowl",                city: "Los Ángeles"   },
  { id: 81,  group: "R32", num: 81,  date: "2026-07-09", time: "13:00", home: TBD, away: TBD, venue: "Arrowhead Stadium",        city: "Kansas City"   },
  { id: 82,  group: "R32", num: 82,  date: "2026-07-09", time: "20:00", home: TBD, away: TBD, venue: "Hard Rock Stadium",        city: "Miami"         },
  { id: 83,  group: "R32", num: 83,  date: "2026-07-10", time: "13:00", home: TBD, away: TBD, venue: "Estadio Ciudad de México", city: "Cd. de México" },
  { id: 84,  group: "R32", num: 84,  date: "2026-07-10", time: "20:00", home: TBD, away: TBD, venue: "Estadio Guadalajara",      city: "Guadalajara"   },
  { id: 85,  group: "R32", num: 85,  date: "2026-07-11", time: "13:00", home: TBD, away: TBD, venue: "BMO Field",                city: "Toronto"       },
  { id: 86,  group: "R32", num: 86,  date: "2026-07-11", time: "20:00", home: TBD, away: TBD, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id: 87,  group: "R32", num: 87,  date: "2026-07-12", time: "13:00", home: TBD, away: TBD, venue: "AT&T Stadium",             city: "Dallas"        },
  { id: 88,  group: "R32", num: 88,  date: "2026-07-12", time: "20:00", home: TBD, away: TBD, venue: "SoFi Stadium",             city: "Los Ángeles"   },

  // ── CUARTOS DE FINAL ───────────────────────────────────────────────────────
  { id: 89,  group: "QF",  num: 89,  date: "2026-07-14", time: "13:00", home: TBD, away: TBD, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id: 90,  group: "QF",  num: 90,  date: "2026-07-14", time: "20:00", home: TBD, away: TBD, venue: "AT&T Stadium",             city: "Dallas"        },
  { id: 91,  group: "QF",  num: 91,  date: "2026-07-15", time: "13:00", home: TBD, away: TBD, venue: "SoFi Stadium",             city: "Los Ángeles"   },
  { id: 92,  group: "QF",  num: 92,  date: "2026-07-15", time: "20:00", home: TBD, away: TBD, venue: "Estadio Azteca",           city: "Cd. de México" },

  // ── SEMIFINALES ────────────────────────────────────────────────────────────
  { id: 93,  group: "SF",  num: 93,  date: "2026-07-17", time: "20:00", home: TBD, away: TBD, venue: "MetLife Stadium",          city: "Nueva York"    },
  { id: 94,  group: "SF",  num: 94,  date: "2026-07-18", time: "20:00", home: TBD, away: TBD, venue: "AT&T Stadium",             city: "Dallas"        },

  // ── TERCER PUESTO ──────────────────────────────────────────────────────────
  { id: 95,  group: "3P",  num: 95,  date: "2026-07-21", time: "20:00", home: TBD, away: TBD, venue: "Estadio Azteca",           city: "Cd. de México" },

  // ── FINAL ──────────────────────────────────────────────────────────────────
  { id: 96,  group: "FINAL", num: 96, date: "2026-07-22", time: "20:00", home: TBD, away: TBD, venue: "MetLife Stadium",         city: "Nueva York"    },
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
  { date: "2026-06-24", label: "24 Jun" },
  { date: "2026-06-25", label: "25 Jun" },
  { date: "2026-06-26", label: "26 Jun" },
  // Jornada 3
  { date: "2026-06-28", label: "28 Jun" },
  { date: "2026-06-29", label: "29 Jun" },
  { date: "2026-06-30", label: "30 Jun" },
  { date: "2026-07-01", label: "1 Jul"  },
  { date: "2026-07-02", label: "2 Jul"  },
  { date: "2026-07-03", label: "3 Jul"  },
  // Octavos
  { date: "2026-07-05", label: "5 Jul"  },
  { date: "2026-07-06", label: "6 Jul"  },
  { date: "2026-07-07", label: "7 Jul"  },
  { date: "2026-07-08", label: "8 Jul"  },
  { date: "2026-07-09", label: "9 Jul"  },
  { date: "2026-07-10", label: "10 Jul" },
  { date: "2026-07-11", label: "11 Jul" },
  { date: "2026-07-12", label: "12 Jul" },
  // Cuartos
  { date: "2026-07-14", label: "14 Jul" },
  { date: "2026-07-15", label: "15 Jul" },
  // Semis
  { date: "2026-07-17", label: "17 Jul" },
  { date: "2026-07-18", label: "18 Jul" },
  // Final
  { date: "2026-07-21", label: "21 Jul" },
  { date: "2026-07-22", label: "22 Jul" },
];

export const WC_GROUPS: Record<string, TeamStanding[]> = {
  A: [
    { name: "México",        flag: "🇲🇽", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Sudáfrica",     flag: "🇿🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Corea del Sur", flag: "🇰🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Polonia",       flag: "🇵🇱", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  B: [
    { name: "Brasil",    flag: "🇧🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Qatar",     flag: "🇶🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Marruecos", flag: "🇲🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Suiza",     flag: "🇨🇭", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  C: [
    { name: "Argentina", flag: "🇦🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Austria",   flag: "🇦🇹", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Argelia",   flag: "🇩🇿", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Jordania",  flag: "🇯🇴", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  D: [
    { name: "Francia",   flag: "🇫🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Portugal",  flag: "🇵🇹", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Senegal",   flag: "🇸🇳", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Ghana",     flag: "🇬🇭", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  E: [
    { name: "Alemania",        flag: "🇩🇪", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Ecuador",         flag: "🇪🇨", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Curazao",         flag: "🇨🇼", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Costa de Marfil", flag: "🇨🇮", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  F: [
    { name: "Países Bajos", flag: "🇳🇱", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Japón",        flag: "🇯🇵", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "España",       flag: "🇪🇸", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Camerún",      flag: "🇨🇲", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  G: [
    { name: "Estados Unidos", flag: "🇺🇸", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Colombia",       flag: "🇨🇴", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Uruguay",        flag: "🇺🇾", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Panamá",         flag: "🇵🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  H: [
    { name: "Inglaterra", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Australia",  flag: "🇦🇺",    pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Nigeria",    flag: "🇳🇬",    pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Jamaica",    flag: "🇯🇲",    pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  I: [
    { name: "Italia",         flag: "🇮🇹", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Canadá",         flag: "🇨🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Honduras",       flag: "🇭🇳", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Arabia Saudita", flag: "🇸🇦", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  J: [
    { name: "Bélgica",   flag: "🇧🇪", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Croacia",   flag: "🇭🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Irán",      flag: "🇮🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Indonesia", flag: "🇮🇩", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  K: [
    { name: "Turquía", flag: "🇹🇷", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Serbia",  flag: "🇷🇸", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Egipto",  flag: "🇪🇬", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Irak",    flag: "🇮🇶", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  L: [
    { name: "Dinamarca",     flag: "🇩🇰", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Paraguay",      flag: "🇵🇾", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Congo DR",      flag: "🇨🇩", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Nueva Zelanda", flag: "🇳🇿", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
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
  { id: 2, user: "Atlas IA", avatar: { emoji: "🤖", bg: "#F97316" }, content: "¡35 días exactos! Argentina llega como campeona defensora 🏆 ¿Quieren que analice a sus rivales del Grupo C?",                        time: "14:29", type: "atlas" as const },
  { id: 3, user: "Caro",     avatar: { emoji: "🌟", bg: "#3B82F6" }, content: "A ver Atlas, ¿quién gana el mundial?",                                                                                                   time: "14:31", type: "user" as const },
  { id: 4, user: "Atlas IA", avatar: { emoji: "🤖", bg: "#F97316" }, content: "Si te digo que Brasil, me creen. Si te digo Argentina, hay lío. Mi análisis: Francia tiene el mejor plantel pero México tiene el corazón 🔥", time: "14:31", type: "atlas" as const },
  { id: 5, user: "Javi",     avatar: { emoji: "⚡", bg: "#EF4444" }, content: "México va a reventar ese Estadio Azteca 🇲🇽🇲🇽🇲🇽",                                                                                    time: "14:33", type: "user" as const },
];
