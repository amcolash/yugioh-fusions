import { readFileSync } from "fs";
import { join } from "path";
import levenshtein from "js-levenshtein";

const statsRaw = readFileSync(join(__dirname, "stats.tsv"), "utf8").split("\n");
const secondaryTypesRaw = readFileSync(join(__dirname, "secondary_types.tsv"), "utf8").split("\n");
const customFusionsRaw = readFileSync(join(__dirname, "custom_fusions.txt"), "utf8").split("\n");

type CardType = "Equip" | "Field" | "Magic" | "Monster" | "Ritual" | "Trap";
type Fusion = number[];

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

const misspellings: Record<string, string> = {
  "7 Colored Fish": "7 Color Fish",
  Ameba: "Amoeba",
  Ansatsu: "Ansastu",
  "Armored Starfish": "Armored Fish",
  "Beastking of the Swamps": "BeastKing of the Swamp",
  "Beautiful Beast Trainer": "Beautiful Beast Tamer",
  "Beautiful Headhuntress": "Beautiful Head Huntress",
  "B. Dragon Jungle King": "Black Dragon Jungle King",
  "B. Skull Dragon": "Black Skull Dragon",
  "Blue-eyes Ultimate Dragon": "Blue Eyes Ultimate Dragon",
  "Blue-eyes White Dragon": "Blue Eyes White Dragon",
  "Cocoon of Evolution": "Cacoon of Evolution",
  Chakra: "Charka",
  "Charubin the Fire Knight": "Charubin Fire Knight",
  "Curse of the Millennium Shield": "Curse of Millennium Shield",
  "Cyber Soldier of Darkworld": "Cyber Soldier of the Dark World",
  "Dark Artist": "Dark Arts",
  "Dark Assailant": "Dark Assassin",
  "Dark Gray": "Dark Mask",
  "Dark-piercing Light": "Dark Piercing Light",
  "Deepsea Shark": "Deep Sea Shark",
  "Dian Keto the Cure Master": "Dian Keto the Curse Master",
  "D. Human": "D.Human",
  "Dokuroizo the Grim Reaper": "Dokuroize the Grim Reaper",
  "Eternal Draught": "Eternal Drought",
  "Flame Cerebrus": "Flame Cerberus",
  Gatekeeper: "Gate Keeper",
  "Giant Red Seasnake": "Giant Red Snake",
  "Giant Turtle Who Feeds on Flames": "Giant Turtle Who Feeds on Flame",
  "Giltia the D. Knight": "Giltia the D.Kinght",
  "Hane-Hane": "Hane Hane",
  Hinotama: "Hinotana",
  "Hungry Burger": "Hungery Burger",
  "Insect Armor with Laser Cannon": "Insect Armor with a Laser Cannon",
  "Invisible Wire": "Invisible Trap Wire",
  "Job-change Mirror": "Job Change Mirror",
  "Job-Change Mirror": "Job Change Mirror",
  Kamakiriman: "Kamaliriman",
  "King of Yamimakai": "King of Yami",
  "Kuwagata α": "Kuwagata *Alpha Sign*",
  "Laser Cannon Armor": "Laser Cannon Arm",
  "Masaki the Legendary Swordsman": "Masaki the Legendary Sword",
  Mechanicalchacer: "Mecanicalchacer",
  "Meteor B. Dragon": "Meteor Black Dragon",
  "Monstrous Bird": "Monstrus Bird",
  "Necrolancer the Timelord": "Necromancer the Timelord",
  "Power of Kaishin": "Power of Kaishen",
  "Psycho-Puppet": "Psyco Puppet",
  "Red-eyes B. Dragon": "Red-Eyes Black Dragon",
  "Revival of Sennen Genjin": "Revival O Senmen Genjin",
  Skullbird: "Skull Bird",
  "Soul Hunter": "Soul Hunters",
  "Sky Dragon": "Stone Dragon",
  "Stop Defense": "Stop Denfense",
  "The Judgement Hand": "The Judgment Hand",
  "The Shadow Who Controls the Dark": "The Shadow that Controls the Dark",
  "The Thing That Hides In the Mud": "The Thing that Lives in the Mud",
  "Three-legged Zombies": "Three-Legged Zombie",
  "Tremendous Fire": "Tremendose Fire",
  "Twin Long Rods #1": "Twin Long Rods #2",
  Wilmee: "Twister",
  "Wow Warrior": "W-Warrior",
  "Revived of Serpent Night Dragon": "Revival of Serpent Night Dragon",
  "Right Leg of the Forbidden One": "Sealed Exodia's Right Leg",
  "Left Leg of the Forbidden One": "Sealed Exodia's Left Leg",
  "Right Arm of the Forbidden One": "Sealed Exodia's Right Arm",
  "Left Arm of the Forbidden One": "Sealed Exodia's Left Arm",
};

const stats: Record<number, Stats> = {};

for (let i = 1; i < statsRaw.length; i++) {
  const row = statsRaw[i].split(/\t/).map((col) => col.trim());
  const newName = getName(row[1]);
  const stat: Stats = {
    id: parseInt(row[0]),
    name: newName,
    original_name: row[1] !== newName ? row[1] : undefined,
    cardType: row[2] as CardType,
    type: row[3],
    level: parseInt(row[4]),
    attack: parseInt(row[5]),
    defense: parseInt(row[6]),
    password: parseInt(row[7]),
    starchips: parseInt(row[8]),
    image: row[9],
  };

  for (const key in stat) {
    const value = stat[key as keyof Stats];
    if (value === undefined || (typeof value === "number" && isNaN(value)) || value === "") delete stat[key as keyof Stats];
  }

  stats[parseInt(row[0])] = stat;
}

for (let i = 1; i < secondaryTypesRaw.length; i++) {
  const row = secondaryTypesRaw[i].split(/\t/).map((col) => col.trim());
  const name = row[0];
  const primary = row[1];
  const secondary = row[2].split(", ");

  const found = statsByName(name);
  if (found) {
    found.type = primary;
    found.secondary = secondary;
  } else console.error("Could not find matching stats for", name);
}

function getName(name: string): string {
  return misspellings[name] || name;
}

function statsByName(name: string): Stats | undefined {
  return Object.values(stats).find(
    (stat) => stat.name.toLowerCase() === name.toLowerCase() || stat.name.toLowerCase() === getName(name).toLowerCase()
  );
}

function statsById(id: number): Stats | undefined {
  return stats[id - 1];
}

const fusions: Record<number, Fusion[]> = {};

let name: string;
for (let i = 0; i < customFusionsRaw.length; i++) {
  const line = customFusionsRaw[i];
  const prev = customFusionsRaw[i - 1];
  const next = customFusionsRaw[i + 1];

  if (next && next.startsWith("---")) {
    name = line.split(" (")[0].trim();

    const id = statsByName(name)?.id;
    if (!id) {
      console.error("Cannot find id for", name);

      // const guess = Object.values(stats)
      //   .map((s) => s.name)
      //   .reduce(
      //     (a, b) => {
      //       const distance = levenshtein(name.toLowerCase(), b.toLowerCase());
      //       if (distance < a.distance) {
      //         return { name: b, distance };
      //       }
      //       return a;
      //     },
      //     { name: "", distance: Infinity }
      //   );

      // console.log("Did you mean:", guess.name);
      // misspellings[guess.name] = name;
    }
  } else if (line.trim().length > 0 && !line.startsWith("---") && !line.startsWith("Note:") && !line.includes("(Equip)")) {
    const cards = line.split(" = ").map((s) => s.split(" (")[0].trim());

    const stats = statsByName(cards[1]);
    if (!stats) {
      console.error("--------- Missing stats ---------");
      console.log(line, "|", cards[1]);
    } else {
      const id = stats.id;

      fusions[id] = fusions[id] || [];
      fusions[id].push(cards.map(parseInt));

      // if (!cards[0] || !cards[1]) {
      //   console.error("--------- Missing card fusion ---------");
      //   console.error(prev + "\n" + line + "\n" + next);
      //   console.error(cards[0], "|", cards[1]);
      // }
    }
  }

  // if (next && next.startsWith("---")) {
  //   name = undefined;
  // }
}

// Zera the Mant (2800/2300) 360
// ------------------------------------------

// Zoa (2600/1900) 391
// ------------------------------------------
// MetalMorph (Equip) = Metalzoa (3000/2300)

// console.log(fusions);

// List original names -> new names
// console.log(
//   Object.values(stats)
//     .filter((stat) => stat.original_name)
//     .map((stat) => ({
//       id: stat.id,
//       name: stat.name,
//       original_name: stat.original_name,
//     }))
// );
