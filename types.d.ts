type CardType = 'Equip' | 'Field' | 'Magic' | 'Monster' | 'Ritual' | 'Trap';
type Fusion = number[];
type FusionRecord = { id: number; cards: Fusion };

type Stats = {
  id: number;
  name: string;
  original_name?: string;
  cardType: CardType;
  type: string;
  secondary?: string[];
  level: number;
  attack: number;
  defense: number;
  password: number;
  starchips: number;
  image: string;
};
