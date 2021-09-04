import occurences from "../data/occurences.json";
import { levelFromItem } from "./utils";
import { rarityDescription, RarityLevel } from "../src";
import rarityLevels from "../src/rarity-levels";

type Occurences = Record<string, Record<string, number>>;

async function main() {
  const levels = Object.values(occurences as Occurences)
    .flatMap(occurrences => Object.entries(occurrences))
    .reduce((levels, [name, occurences]) => {
        const level = levelFromItem(name);
        levels[level - 1] += occurences;
        return levels;
      },
      [0, 0, 0, 0, 0, 0]
    );

  const total = levels.reduce((total, count) => count + total, 0);
  if (total !== 8001 * 8) {
    throw new Error(`Wrong total: ${total}`);
  }

  console.log(" Levels distribution:");
  console.log("");

  levels.forEach((items, index) => {
    const description = rarityDescription((index + 1) as RarityLevel);
    const percentage = Math.round((items / total) * 10000) / 100;
    const threshold = rarityLevels[index][0];

    let thresholdLabel = `up to ${threshold}`;
    if (threshold === -1) thresholdLabel = `under ${rarityLevels[1][0]}`;
    if (threshold === 1) thresholdLabel = "exactly 1";

    console.log(
      " " +
      `${description}:`.padEnd(11) +
      `${thresholdLabel}`.padStart(12) +
      `${percentage}%`.padStart(10) +
      ` (${items} items)`.padStart(14)
    );
  });

  console.log("");
  console.log(" Update src/rarity-levels.ts to tweak the distribution.");
  console.log("");
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
