export interface BirthData {
  name: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  lat: number;
  lng: number;
  timezone: string;
  placeName: string;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  symbol: string;
  degree: number;
  absoluteDegree: number;
  house: number;
  retrograde: boolean;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type:
    | "conjunction"
    | "sextile"
    | "square"
    | "trine"
    | "opposition";
  orb: number;
}

export interface AnglePoint {
  sign: string;
  degree: number;
  absoluteDegree: number;
}

export interface HouseData {
  number: number;
  sign: string;
  degree: number;
  absoluteDegree: number;
}

export interface ChartData {
  planets: PlanetPosition[];
  aspects: Aspect[];

  ascendant: AnglePoint;
  midheaven: AnglePoint;

  houses: HouseData[];
}

export interface ReadingSection {
  title: string;
  content: string;
}

export interface ShareCard {
  title: string;
  text: string;
}

export interface ReadingResponse {
  summary: string;
  sections: ReadingSection[];
  nextMonth: string;
  shareCard: ShareCard;
}