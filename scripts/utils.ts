import rarityLevels from "../src/rarity-levels";
import occurrences from "../data/occurences.json"
import { hashItem } from "../src/hash-item";

type Occurrences = Record<string, Record<string, number>>;

export function levelFromItem(item: string): number {
  return levelFromHash(hashItem(item))
}

export function levelFromHash(itemHash: string): number {
  const group = findGroup(itemHash)
  const rank = 1 - ((group.indexOf(itemHash) + 1) / group.length)

  for (let i = 1, len = rarityLevels.length; i < len; i++) {
    if (rank > rarityLevels[i][0]) {
      continue
    }
    return i;
  }
  return 6;
}

function findGroup(item: string): string[] {
  const group = Object.values(occurrences as Occurrences)
    .find(group => Object.keys(group).map(key => hashItem(key)).find(it => it == item) != null)

  return Object.keys(group!!).map(it => hashItem(it))
}
