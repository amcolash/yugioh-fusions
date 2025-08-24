import data from './data.json';

export const { stats, customFusions, generalFusions } = data;

export function satisfiesInput(card: number, input: GeneralFusionInput): boolean {
  const cardStats = stats[card];
  if (!cardStats) {
    console.error(`Card not found: ${card}`);
    return false;
  }

  if (input.id) {
    return card === input.id;
  } else if (input.type) {
    return cardStats.type === input.type || cardStats.subtype?.includes(input.type);
  } else if (input.subtype) {
    return cardStats.subtype?.includes(input.subtype);
  }
  return false;
}

export function getGeneralFusions(hand: number[]): FusionRecord[] {
  const results: FusionRecord[] = [];

  for (const fusion of generalFusions) {
    const input: GeneralFusionInput[] = fusion.input as GeneralFusionInput[];
    const output: number[] = fusion.output;

    for (let i = 0; i < hand.length; i++) {
      for (let j = 0; j < hand.length; j++) {
        if (i === j) continue;

        const card1 = hand[i];
        const card2 = hand[j];

        if (satisfiesInput(card1, input[0]) && satisfiesInput(card2, input[1])) {
          // console.log(
          //   `Found general fusion: ${stats[card1]?.name} + ${stats[card2]?.name} = ${output.map((id) => stats[id]?.name).join(', ')}`,
          //   input
          // );

          const maxAttack = Math.max(stats[card1].attack, stats[card2].attack);

          let outputIndex = 0;
          for (let k = 0; k < output.length; k++) {
            const outAttack = stats[output[k]]?.attack;
            if (maxAttack >= outAttack) outputIndex = k + 1;
          }

          if (outputIndex < output.length) {
            results.push({ id: output[outputIndex], cards: [card1, card2] });
          }
        }
      }
    }
  }

  return results;
}

export function getCustomFusions(hand: number[]): FusionRecord[] {
  const results: FusionRecord[] = [];

  const f = Object.entries(customFusions);
  for (let i = 0; i < f.length; i++) {
    const [id, combinations] = f[i];
    for (let j = 0; j < combinations.length; j++) {
      const [card1, card2] = combinations[j];

      const duplicateCards = card1 === card2;
      const hasDuplicates = hand.filter((card) => card === card1).length > 1;

      const hasCard1 = hand.includes(card1);
      const hasCard2 = hand.includes(card2);

      const result = { id: parseInt(id), cards: [card1, card2] };

      if (duplicateCards && hasDuplicates) results.push(result);
      if (!duplicateCards && hasCard1 && hasCard2) results.push(result);
    }
  }

  return results;
}

export function getName(name: string): string {
  return misspellings[name] || name;
}

export function statsByName(name: string): Stats | undefined {
  return Object.values(stats).find(
    (stat) => stat.name.toLowerCase() === name.toLowerCase() || stat.name.toLowerCase() === getName(name).toLowerCase()
  ) as Stats;
}

export function statsById(id: number): Stats | undefined {
  return stats[id];
}

const misspellings: Record<string, string> = {
  '7 Colored Fish': '7 Color Fish',
  Ameba: 'Amoeba',
  Ansatsu: 'Ansastu',
  'Armored Starfish': 'Armored Fish',
  'Beastking of the Swamps': 'BeastKing of the Swamp',
  'Beautiful Beast Trainer': 'Beautiful Beast Tamer',
  'Beautiful Headhuntress': 'Beautiful Head Huntress',
  'B. Dragon Jungle King': 'Black Dragon Jungle King',
  'B. Skull Dragon': 'Black Skull Dragon',
  'Blue-eyes Ultimate Dragon': 'Blue Eyes Ultimate Dragon',
  'Blue-eyes White Dragon': 'Blue Eyes White Dragon',
  'Cocoon of Evolution': 'Cacoon of Evolution',
  Chakra: 'Charka',
  'Charubin the Fire Knight': 'Charubin Fire Knight',
  'Curse of the Millennium Shield': 'Curse of Millennium Shield',
  'Cyber Soldier of Darkworld': 'Cyber Soldier of the Dark World',
  'Dark Artist': 'Dark Arts',
  'Dark Assailant': 'Dark Assassin',
  'Dark Gray': 'Dark Mask',
  'Dark-piercing Light': 'Dark Piercing Light',
  'Deepsea Shark': 'Deep Sea Shark',
  'Dian Keto the Cure Master': 'Dian Keto the Curse Master',
  'D. Human': 'D.Human',
  'Dokuroizo the Grim Reaper': 'Dokuroize the Grim Reaper',
  'Eternal Draught': 'Eternal Drought',
  'Flame Cerebrus': 'Flame Cerberus',
  Gatekeeper: 'Gate Keeper',
  'Giant Red Seasnake': 'Giant Red Snake',
  'Giant Turtle Who Feeds on Flames': 'Giant Turtle Who Feeds on Flame',
  'Giltia the D. Knight': 'Giltia the D.Kinght',
  'Hane-Hane': 'Hane Hane',
  Hinotama: 'Hinotana',
  'Hungry Burger': 'Hungery Burger',
  'Insect Armor with Laser Cannon': 'Insect Armor with a Laser Cannon',
  'Invisible Wire': 'Invisible Trap Wire',
  'Job-change Mirror': 'Job Change Mirror',
  'Job-Change Mirror': 'Job Change Mirror',
  'Kagemusha of the Blue Flame': 'Kagemushi of the Blue Flame',
  Kamakiriman: 'Kamaliriman',
  'King of Yamimakai': 'King of Yami',
  'Kuwagata α': 'Kuwagata *Alpha Sign*',
  'Laser Cannon Armor': 'Laser Cannon Arm',
  'Masaki the Legendary Swordsman': 'Masaki the Legendary Sword',
  Mechanicalchacer: 'Mecanicalchacer',
  'Meteor B. Dragon': 'Meteor Black Dragon',
  'Monstrous Bird': 'Monstrus Bird',
  'Necrolancer the Timelord': 'Necromancer the Timelord',
  'Power of Kaishin': 'Power of Kaishen',
  'Psycho-Puppet': 'Psyco Puppet',
  'Red-eyes B. Dragon': 'Red-Eyes Black Dragon',
  'Revival of Sennen Genjin': 'Revival O Senmen Genjin',
  Skullbird: 'Skull Bird',
  'Soul Hunter': 'Soul Hunters',
  'Sky Dragon': 'Stone Dragon',
  'Spiked Snail': 'Spiked Seadra',
  'Stop Defense': 'Stop Denfense',
  'The Judgement Hand': 'The Judgment Hand',
  'The Shadow Who Controls the Dark': 'The Shadow that Controls the Dark',
  'The Thing That Hides In the Mud': 'The Thing that Lives in the Mud',
  'Three-legged Zombies': 'Three-Legged Zombie',
  'Tremendous Fire': 'Tremendose Fire',
  'Twin Long Rods #1': 'Twin Long Rods #2',
  Wilmee: 'Twister',
  'Wow Warrior': 'W-Warrior',
  'Revived of Serpent Night Dragon': 'Revival of Serpent Night Dragon',
  'Right Leg of the Forbidden One': "Sealed Exodia's Right Leg",
  'Left Leg of the Forbidden One': "Sealed Exodia's Left Leg",
  'Right Arm of the Forbidden One': "Sealed Exodia's Right Arm",
  'Left Arm of the Forbidden One': "Sealed Exodia's Left Arm",
};
