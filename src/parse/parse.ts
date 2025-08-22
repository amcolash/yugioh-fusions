import { readFileSync } from "fs";
import { join } from "path";

const statsRaw = readFileSync(join(__dirname, "stats.tsv"), "utf8").split("\n");
const secondaryTypesRaw = readFileSync(
  join(__dirname, "secondary_types.tsv"),
  "utf8"
).split("\n");

const fusionsRaw = readFileSync(join(__dirname, "fusions.txt"), "utf8").split(
  "\n"
);

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
  image: string;
};

const stats: Record<number, Stats> = {};

for (let i = 1; i < statsRaw.length; i++) {
  const row = statsRaw[i].split(/\t/).map((col) => col.trim());
  const stat: Stats = {
    name: row[1],
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
    if (
      value === undefined ||
      (typeof value === "number" && isNaN(value)) ||
      value === ""
    )
      delete stat[key as keyof Stats];
  }

  stats[parseInt(row[0])] = stat;
}

for (let i = 1; i < secondaryTypesRaw.length; i++) {
  const row = secondaryTypesRaw[i].split(/\t/).map((col) => col.trim());
  const name = row[0];
  const primary = row[1];
  const secondary = row[2].split(", ");

  const found = Object.values(stats).find(
    (stat) => stat.name.toLowerCase() === name.toLowerCase()
  );
  if (found) {
    found.type = primary;
    found.secondary = secondary;
  } else console.error("Could not find matching stats for", name);
}

console.log(stats);

// Zera the Mant (2800/2300) 360
// ------------------------------------------

// Zoa (2600/1900) 391
// ------------------------------------------
// MetalMorph (Equip) = Metalzoa (3000/2300)

const data = {};

let name;
for (let i = 0; i < fusionsRaw.length; i++) {
  const line = fusionsRaw[i];
  const next = fusionsRaw[i + 1];

  if (next && next.startsWith("---")) {
    name = line.split(" (")[0].trim();
    // data[name] = {};

    // console.log(name);
  }

  // if (next && next.startsWith("---")) {
  //   name = undefined;
  // }
}
