// All of the data from this folder came from https://yugipedia.com/
import { readFileSync, writeFileSync } from 'fs';
import jsdom from 'jsdom';

const { JSDOM } = jsdom;

const part1 = readFileSync('part1.html', 'utf-8');
const part2 = readFileSync('part2.html', 'utf-8');
const part3 = readFileSync('part3.html', 'utf-8');
const part4 = readFileSync('part4.html', 'utf-8');
const statsData = readFileSync('stats.tsv', 'utf-8').split('\n');

const stats: Record<number, Stats> = {};

for (let i = 1; i < statsData.length; i++) {
  const row = statsData[i].split(/\t/).map((col) => col.trim());
  const stat: Stats = {
    id: parseInt(row[0]),
    name: row[1],
    cardType: row[2] as CardType,
    type: row[3] as Type,
    level: parseInt(row[4]),
    attack: parseInt(row[5]),
    defense: parseInt(row[6]),
    guardianStars: row[7].split(', ') as GuardianStar[],
    password: parseInt(row[8]),
    starchips: parseInt(row[9]),
    image: row[10],
  };

  for (const key in stat) {
    const value = stat[key as keyof Stats];
    if (value === undefined || (typeof value === 'number' && isNaN(value)) || value === '')
      delete stat[key as keyof Stats];
  }

  stats[parseInt(row[0])] = stat;
}

// Initialize the jsdom constructor
const html = part1 + part2 + part3 + part4;
const dom = new JSDOM(html);
const document = dom.window.document;

const fusionData = {};

// Select all h2 elements, as they are the main section headers
const headers = document.querySelectorAll('h2');

headers.forEach((header) => {
  // Find the headline span and get its text content for the key
  const headline = header.querySelector('span.mw-headline');
  if (!headline) return;

  const key = parseInt(headline.textContent.trim().split(':')[0]);
  fusionData[key] = { rows: [] };

  // Find the next sibling element that is a table
  let nextElement = header.nextElementSibling;
  while (nextElement && nextElement.tagName !== 'TABLE') {
    nextElement = nextElement.nextElementSibling;
  }

  const table = nextElement;
  if (!table) return;

  // Get all table rows, skipping the first one (the header row with <th>)
  const rows = Array.from(table.querySelectorAll('tbody > tr')).slice(1);

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    if (cells.length < 2) return;

    // Helper function to extract text from all <li> elements in a cell
    const getMaterials = (cell) => {
      return Array.from(cell.querySelectorAll('li')).map((li) =>
        parseInt(li.textContent.trim().replace(/"/g, '').split(':')[0].replace('#', ''))
      );
    };

    const material1 = getMaterials(cells[0]);
    const material2 = getMaterials(cells[1]);

    fusionData[key].rows.push({ material1, material2 });
  });
});

// Part 2 of parsing, figure out every possible combo and merge it all together
// const trimmed = Object.fromEntries(Object.entries(fusionData).slice(0, 1));

const newData = {};
for (const [card, { rows }] of Object.entries(fusionData)) {
  newData[card] = [];
  for (const { material1, material2 } of rows) {
    for (let i = 0; i < material1.length; i++) {
      for (let j = 0; j < material2.length; j++) {
        if (material1[i] === material2[j]) continue; // skip same card fusions
        newData[card].push([material1[i], material2[j]]);
      }
    }
  }
}

// console.log(JSON.stringify(newData, null, 2));

// Print the final JSON object with pretty formatting
writeFileSync('data.json', JSON.stringify({ stats, fusions: newData }, null, 2));
