export type AspectRatio = '2.39:1' | '1.85:1' | '16:9' | '4:3' | '9:16';

export type LUTFilter =
  | 'lut-natural'
  | 'lut-teal-orange'
  | 'lut-noir'
  | 'lut-bleach-bypass'
  | 'lut-cyberpunk'
  | 'lut-golden-hour'
  | 'lut-vintage-5219';

export type ShotType =
  | 'Extreme Wide Shot'
  | 'Wide Shot'
  | 'Full Shot'
  | 'Medium Shot'
  | 'Medium Close-Up'
  | 'Close-Up'
  | 'Extreme Close-Up'
  | 'POV'
  | 'Over the Shoulder'
  | 'Dutch Angle'
  | 'Low Angle'
  | 'Bird\'s Eye View';

export type CameraMovement =
  | 'Static'
  | 'Pan Right'
  | 'Pan Left'
  | 'Tilt Up'
  | 'Tilt Down'
  | 'Dolly In / Push'
  | 'Dolly Out / Pull'
  | 'Tracking Shot'
  | 'Crane / Jib'
  | 'Handheld Shaky'
  | 'Whip Pan'
  | 'Steadicam Glide';

export interface Shot {
  id: string;
  shotNumber: string;
  shotType: ShotType;
  cameraMovement: CameraMovement;
  lens: string;
  lightingMood: string;
  visualDescription: string;
  dialogue?: string;
  soundCue?: string;
  durationSeconds: number;
  imageUrl?: string; // Concept art or canvas sketch data URL
  sceneId: string;
  notes?: string;
}

export interface ScreenplayLine {
  id: string;
  type: 'slugline' | 'action' | 'character' | 'parenthetical' | 'dialogue' | 'transition';
  text: string;
}

export interface Scene {
  id: string;
  sceneNumber: number;
  slugline: string; // e.g. "INT. CONTROL ROOM - NIGHT"
  location: string;
  timeOfDay: 'DAY' | 'NIGHT' | 'DUSK' | 'DAWN' | 'CONTINUOUS';
  setting: 'INT.' | 'EXT.' | 'INT./EXT.';
  content: string; // Raw fountain/screenplay text
  summary: string;
  characters: string[];
  estimatedMinutes: number;
  shotsCount?: number;
}

export interface Character {
  id: string;
  name: string;
  role: 'Protagonist' | 'Antagonist' | 'Supporting' | 'Cameo';
  age: string;
  archetype: string;
  coreMotivation: string;
  fatalFlaw: string;
  wardrobeLook: string;
  voiceCadence: string;
  keyQuote: string;
  castingReference: string;
  avatarColor?: string;
}

export interface ProductionBreakdown {
  locations: string[];
  props: string[];
  wardrobe: string[];
  specialEffects: string[];
  stunts: string[];
  soundDesign: string[];
}

export interface CallSheet {
  shootDay: number;
  totalDays: number;
  date: string;
  crewCallTime: string;
  shootingCallTime: string;
  locationName: string;
  locationAddress: string;
  parkingNotes: string;
  nearestHospital: string;
  weatherNotes: string;
  scenesToShoot: string;
  specialInstructions: string;
}

export interface FilmProject {
  id: string;
  title: string;
  logline: string;
  genre: string;
  tone: string;
  director: string;
  writer: string;
  productionCompany: string;
  aspectRatio: AspectRatio;
  colorGrade: LUTFilter;
  screenplayText: string;
  scenes: Scene[];
  shots: Shot[];
  characters: Character[];
  production: ProductionBreakdown;
  callSheet: CallSheet;
  createdAt: string;
  updatedAt: string;
}
