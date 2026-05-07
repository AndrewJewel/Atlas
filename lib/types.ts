export interface Avatar {
  emoji: string;
  bg: string;
}

export interface User {
  username: string;
  avatar: Avatar;
}

export interface Team {
  name: string;
  flag: string;
  code: string;
}

export interface TeamStanding {
  name: string;
  flag: string;
  pj: number;
  g: number;
  e: number;
  p: number;
  gf: number;
  gc: number;
  dg: number;
  pts: number;
}

export interface Match {
  id: number;
  group: string;
  num: number;
  date: string;
  time: string;
  home: Team;
  away: Team;
  venue: string;
  city: string;
}

export interface Champion {
  year: number;
  host: string;
  winner: { name: string; flag: string };
  runnerUp: string;
  score: string;
}

export type PredictionResult = "home" | "away" | "draw" | null;

export interface Prediction {
  matchId: number;
  winner: PredictionResult;
  homeScore?: number;
  awayScore?: number;
}

export interface Message {
  id: number | string;
  user: string;
  avatar: Avatar;
  content: string;
  time: string;
  type: "user" | "me" | "atlas";
}
