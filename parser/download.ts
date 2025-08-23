import { join } from "path";
import data from "./data.json";
import { existsSync, writeFileSync } from "fs";

async function downloadImages() {
  const stats = Object.values(data.stats);
  for (let i = 0; i < stats.length; i++) {
    const stat = stats[i];
    const imagePath = join(__dirname, `images/${stat.id}.png`);

    if (!existsSync(imagePath)) {
      console.log(`Downloading image ${i + 1}/${stats.length} for`, stat.name);

      const imageUrl = stat.image;
      const response = await fetch(imageUrl);
      const buffer = await response.arrayBuffer();

      writeFileSync(imagePath, Buffer.from(buffer));

      await new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 100));
    }
  }
}

downloadImages();
