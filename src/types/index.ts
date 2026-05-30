export interface Memory {
  id: number;
  date: string;
  title: string;
  description: string;
  imageUrl?: string;
  color: string;
}

export interface TimelineEvent {
  year: number;
  title: string;
  note: string;
  imageUrl?: string;
}

export interface Wish {
  id: number;
  text: string;
  revealed: boolean;
}

export interface FlowerData {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  message: string;
  petalCount: number;
  delay: number;
}

export interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  brightness: number;
  connectedTo: number[];
}

export interface ConstellationData {
  id: number;
  stars: number[];
  wish: string;
  name: string;
}

export type SceneState = 'loading' | 'intro' | 'passcode' | 'transition' | 'main' | 'ending';

export interface AudioState {
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
}
