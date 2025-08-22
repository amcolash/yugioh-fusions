import { readFileSync, stat } from "fs";
import { join } from "path";

const statsRaw = readFileSync(join(__dirname, "stats.txt"), "utf8").split("\n");

type CardType = "Equip" | "Field" | "Magic" | "Monster" | "Ritual" | "Trap";

type Stats = {
  name: string;
  cardType: CardType;
  type: string;
  secondary?: string[];
  level: number;
  attack: number;
  defense: number;
  password: number;
  starchips: number;
};

const stats: Record<number, Stats> = {};

for (let i = 1; i < statsRaw.length; i++) {
  const row = statsRaw[i].split(/\t+/).map((col) => col.trim());
  const stat: Stats = {
    name: row[1],
    cardType: row[2] as CardType,
    type: row[3],
    level: parseInt(row[4]),
    attack: parseInt(row[5]),
    defense: parseInt(row[6]),
    password: parseInt(row[7]),
    starchips: parseInt(row[8]),
  };

  for (const key in stat) {
    const value = stat[key as keyof Stats];
    if (value === undefined || (typeof value === "number" && isNaN(value)))
      delete stat[key as keyof Stats];
  }

  stats[parseInt(row[0])] = stat;
}

console.log(stats);

const lines = readFileSync(join(__dirname, "data.txt"), "utf8").split("\n");

// Zera the Mant (2800/2300) 360
// ------------------------------------------

// Zoa (2600/1900) 391
// ------------------------------------------
// MetalMorph (Equip) = Metalzoa (3000/2300)

const data = {};

let name;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const next = lines[i + 1];

  if (next && next.startsWith("---")) {
    name = line.split(" (")[0].trim();
    // data[name] = {};

    // console.log(name);
  }

  // if (next && next.startsWith("---")) {
  //   name = undefined;
  // }
}
