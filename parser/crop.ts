import { mkdirSync } from 'fs';
import sharp from 'sharp';

mkdirSync('cropped');
mkdirSync('illustrations');

const num = 722;

for (let i = 1; i <= num; i++) {
  // cropped card
  sharp(`images/${i}.png`).extract({ left: 7, top: 9, width: 130, height: 186 }).toFile(`cropped/${i}.png`);

  // illustration
  sharp(`images/${i}.png`).extract({ left: 21, top: 54, width: 102, height: 96 }).toFile(`illustrations/${i}.png`);
}
