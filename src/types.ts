/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CelestialBody {
  id: string;
  name: string;
  type: 'star' | 'planet' | 'moon' | 'blackhole' | 'nebula' | 'exoplanet';
  classification: string;
  mass: string;
  temperature: string;
  atmosphere: string;
  distance: string;
  habitable: boolean;
  description: string;
  colors: string[]; // Custom color hex gradients
  radius: number;   // Base visual size
  orbitRadius: number; // Distance from parent or galactic core
  orbitSpeed: number;  // Sideral orbit velocity multiplier
  moonsCount: number;
  featured?: boolean;
}

export type OSWindowID = 'scanner' | 'ai_assistant' | 'encyclopedia' | 'control_center' | 'favorites' | 'star_map';

export interface OSWindow {
  id: OSWindowID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AIMessage {
  sender: 'user' | 'cosmos';
  text: string;
  timestamp: string;
  type?: 'assistant' | 'tutor' | 'tour' | 'scanned_exoplanet';
  planetData?: Partial<CelestialBody>;
}

export interface TelemetrySignal {
  frequency: number;
  amplitude: number;
  phase: number;
  signalStrength: number;
  spectralPeak: string;
}

export interface SpaceTechEntry {
  id: string;
  title: string;
  category: 'mission' | 'technology' | 'pioneer' | 'phenomenon';
  era: string;
  description: string;
  specs: Record<string, string>;
  longText: string;
}
