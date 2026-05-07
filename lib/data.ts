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

export const MATCHES: Match[] = [
  { id: 1,  group: "A", num: 1,  date: "2026-06-11", time: "13:00", home: { name: "México",       flag: "🇲🇽", code: "MEX" }, away: { name: "Sudáfrica",     flag: "🇿🇦", code: "RSA" }, venue: "Estadio Ciudad de México", city: "Cd. de México" },
  { id: 2,  group: "B", num: 2,  date: "2026-06-11", time: "16:00", home: { name: "Qatar",         flag: "🇶🇦", code: "QAT" }, away: { name: "Suiza",          flag: "🇨🇭", code: "SUI" }, venue: "AT&T Stadium",              city: "Dallas" },
  { id: 3,  group: "A", num: 3,  date: "2026-06-11", time: "20:00", home: { name: "Corea del Sur", flag: "🇰🇷", code: "KOR" }, away: { name: "Polonia",        flag: "🇵🇱", code: "POL" }, venue: "Estadio Guadalajara",       city: "Guadalajara" },
  { id: 4,  group: "C", num: 4,  date: "2026-06-12", time: "13:00", home: { name: "Argentina",     flag: "🇦🇷", code: "ARG" }, away: { name: "Argelia",        flag: "🇩🇿", code: "ALG" }, venue: "MetLife Stadium",            city: "Nueva York" },
  { id: 5,  group: "D", num: 5,  date: "2026-06-12", time: "16:00", home: { name: "Francia",       flag: "🇫🇷", code: "FRA" }, away: { name: "Senegal",        flag: "🇸🇳", code: "SEN" }, venue: "SoFi Stadium",              city: "Los Ángeles" },
  { id: 6,  group: "B", num: 6,  date: "2026-06-12", time: "20:00", home: { name: "Brasil",        flag: "🇧🇷", code: "BRA" }, away: { name: "Marruecos",      flag: "🇲🇦", code: "MAR" }, venue: "Levi's Stadium",            city: "San Francisco" },
  { id: 7,  group: "C", num: 7,  date: "2026-06-13", time: "13:00", home: { name: "Austria",       flag: "🇦🇹", code: "AUT" }, away: { name: "Jordania",       flag: "🇯🇴", code: "JOR" }, venue: "Rose Bowl",                 city: "Los Ángeles" },
  { id: 8,  group: "E", num: 8,  date: "2026-06-13", time: "16:00", home: { name: "Alemania",      flag: "🇩🇪", code: "GER" }, away: { name: "Curazao",        flag: "🇨🇼", code: "CUW" }, venue: "Estadio Ciudad de México",  city: "Cd. de México" },
  { id: 9,  group: "F", num: 9,  date: "2026-06-13", time: "20:00", home: { name: "Países Bajos",  flag: "🇳🇱", code: "NED" }, away: { name: "Japón",          flag: "🇯🇵", code: "JPN" }, venue: "BC Place",                  city: "Vancouver" },
  { id: 10, group: "D", num: 10, date: "2026-06-14", time: "13:00", home: { name: "Portugal",      flag: "🇵🇹", code: "POR" }, away: { name: "Ghana",          flag: "🇬🇭", code: "GHA" }, venue: "Gillette Stadium",          city: "Boston" },
  { id: 11, group: "G", num: 11, date: "2026-06-14", time: "16:00", home: { name: "España",        flag: "🇪🇸", code: "ESP" }, away: { name: "Camerún",        flag: "🇨🇲", code: "CMR" }, venue: "Estadio Azteca",            city: "Cd. de México" },
  { id: 12, group: "E", num: 12, date: "2026-06-14", time: "20:00", home: { name: "Ecuador",       flag: "🇪🇨", code: "ECU" }, away: { name: "Costa de Marfil",flag: "🇨🇮", code: "CIV" }, venue: "Arrowhead Stadium",         city: "Kansas City" },
];

export const MATCH_DAYS = [
  { date: "2026-06-11", label: "Jue 11" },
  { date: "2026-06-12", label: "Vie 12" },
  { date: "2026-06-13", label: "Sáb 13" },
  { date: "2026-06-14", label: "Dom 14" },
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
    { name: "Alemania",          flag: "🇩🇪", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Ecuador",           flag: "🇪🇨", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Curazao",           flag: "🇨🇼", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Costa de Marfil",   flag: "🇨🇮", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
  ],
  F: [
    { name: "Países Bajos", flag: "🇳🇱", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Japón",        flag: "🇯🇵", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "España",       flag: "🇪🇸", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
    { name: "Camerún",      flag: "🇨🇲", pj: 0, g: 0, e: 0, p: 0, gf: 0, gc: 0, dg: 0, pts: 0 },
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
