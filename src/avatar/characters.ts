import type { CharacterId } from './types';

const asset = (file: string) => `${import.meta.env.BASE_URL}characters/${file}`;

export interface Character {
  id: CharacterId;
  /** Short name, on tiles and buttons. */
  name: string;
  /** Full name, for screen readers. */
  title: string;
  /** File name stem for downloads. */
  slug: string;
  /** Signature colour, picked from the outfit. */
  color: string;
  /** Label of the second move: the hockey bear skates, everyone else walks. */
  moveLabel: 'Skate' | 'Walk';
  /** 240px WebP for the picker. */
  tile: string;
  /** 800px WebP that holds the character's place until the 3D has drawn. */
  poster: string;
  /** Full-size transparent PNG, for the PNG download. */
  png: string;
  /** The untouched standalone page, served by vite/avatar-source.ts. */
  html: string;
}

export const CHARACTERS: readonly Character[] = [
  { id: 'bear', name: 'Glace', title: 'Glace, the Montréal hockey bear', slug: 'glace', color: '#ef3b3b', moveLabel: 'Skate', tile: asset('bear-tile.webp'), poster: asset('glace-poster.webp'), png: asset('glace.png'), html: asset('source/bear.html') },
  { id: 'robot', name: 'Nova', title: 'Nova, the Toronto baseball robot', slug: 'nova', color: '#4f86f0', moveLabel: 'Walk', tile: asset('robot-tile.webp'), poster: asset('nova-poster.webp'), png: asset('nova.png'), html: asset('source/robot.html') },
  { id: 'cat', name: 'Liberty', title: 'Liberty the cat', slug: 'liberty', color: '#d8c2ad', moveLabel: 'Walk', tile: asset('cat-tile.webp'), poster: asset('liberty-poster.webp'), png: asset('liberty.png'), html: asset('source/cat.html') },
  { id: 'pig', name: 'Chanchito', title: 'Chanchito', slug: 'chanchito', color: '#f6c445', moveLabel: 'Walk', tile: asset('pig-tile.webp'), poster: asset('chanchito-poster.webp'), png: asset('chanchito.png'), html: asset('source/pig.html') },
];

export const characterById = (id: CharacterId): Character => CHARACTERS.find((c) => c.id === id) ?? CHARACTERS[0];

/** Same order as the buttons in every character page. */
export const EMOTIONS = ['Happy', 'Euphoric', 'Surprised', 'Curious', 'Sleepy', 'Sad', 'Embarrassed', 'Angry'] as const;
