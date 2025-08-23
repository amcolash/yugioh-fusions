import { dirname, join } from "path";
import sharp from "sharp";

const num = 722;

for (let i = 1; i <= num; i++) {
  sharp(`images/${i}.png`).extract({ left: 7, top: 9, width: 130, height: 186 }).toFile(`cropped/${i}.png`);
}
