// Seperates out the logic used for the carousel on the homepage

import type { ModData } from "$lib/types/Mods";
import axios from "axios";
import { appendURL } from "./url";

export async function getLatestVersionMods(): Promise<ModData[]> {
  let versions = await axios
    .get(appendURL("api/versions?gameName=BeatSaber"), {
      withCredentials: false,
    })
    .then((response) => {
      if (response.status === 302 || response.status === 200) {
        if (response.data !== null) {
          return response.data;
        }
      } else {
      }
    })
    .catch((error) => {
      error(404, "Not found");
    });

  if (!versions) return [];

  //let latestVersion =
  return [];
}
