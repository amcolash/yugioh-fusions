/// <reference types="vite/client" />

type CardType = 'Equip' | 'Field' | 'Magic' | 'Monster' | 'Ritual' | 'Trap';
type GuardianStar =
  | 'Sun'
  | 'Mercury'
  | 'Venus'
  | 'Moon'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto';

type Fusion = number[];
type FusionRecord = { id: number; cards: Fusion; secondary?: FusionRecord };

type SimpleCard = { id: number; location: 'hand' | 'field' };
type CardWithIndex = SimpleCard & { index: number };

type Type =
  | 'Aqua'
  | 'Beast'
  | 'Beast-Warrior'
  | 'Dinosaur'
  | 'Dragon'
  | 'Fairy'
  | 'Fish'
  | 'Fiend'
  | 'Insect'
  | 'Machine'
  | 'Plant'
  | 'Pyro'
  | 'Rock'
  | 'SeaSerpent'
  | 'Spellcaster'
  | 'Thunder'
  | 'Warrior'
  | 'WingedBeast'
  | 'Zombie';

type GeneralFusion = {
  input: GeneralFusionInput[];
  output: number[];
};

type GeneralFusionInput = {
  type?: Type;
  subtype?: string;
  id?: number;
};

type Stats = {
  id: number;
  name: string;
  original_name?: string;
  cardType: CardType;
  type: Type;
  subtype?: string[];
  level: number;
  attack: number;
  defense: number;
  guardianStars: GuardianStar[];
  password: number;
  starchips: number;
  image: string;
};

type FusionFilter = 'primary' | 'secondary' | 'all';
type FusionStats = {
  primary: number;
  secondary: number;
  totalAttack: number;
  totalDefense: number;
};
