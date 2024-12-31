import type { PageLoad } from "./$types";
import axios from "axios";
import { appendURL } from "$lib/utils/url";

export const load: PageLoad = async ({ params }) => {
  let data = await axios
    .get(appendURL(`/api/mods/${params.id}`), {
      withCredentials: false,
    })
    .then((response) => {
      if (response.status === 302 || response.status === 200) {
        if (response.data !== null) {
          const mod = response.data;
          console.log(mod);
          return {
            mod: mod,
          };
        }
      } else {
      }
    })
    .catch((error) => {
      error(404, "Not found");
    });

  return data;
};
