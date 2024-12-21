import FlexSearch from "flexsearch";
import type { Mod, ModData } from "../types/Mods";

let modsIndex: FlexSearch.Index;
let mods: ModData[];

export function createModsIndex(data: ModData[]) {
  // create the mods index
  modsIndex = new FlexSearch.Index({ tokenize: "forward" });

  data.forEach((mod, i) => {
    // index the title and content together
    const item = `${mod.mod.name} ${mod.mod.description}`;
    // add the item to the index
    modsIndex.add(i, item);
  });

  mods = data;
}

export function searchModsIndex(searchTerm: string) {
  // escape special regex characters
  const match = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // return matching mod indexes
  const results = modsIndex.search(match);

  return (
    results
      // filter the mods based on the matched index
      .map((index) => mods[index as number])
  );
}

function replaceTextWithMarker(text: string, match: string) {
  const regex = new RegExp(match, "gi");
  return text.replaceAll(regex, (match) => `<mark>${match}</mark>`);
}
