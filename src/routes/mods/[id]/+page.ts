import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import axios from "axios";

export const load: PageLoad = async ({ params }) => {
  let data = await axios
    .get(`${import.meta.env.VITE_API_BASE_URL}/api/mods/${params.id}`, {
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
